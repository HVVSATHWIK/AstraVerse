import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Auth context of the logged in user
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get the user from the auth context
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    if (!user) {
      throw new Error('Not authorized');
    }

    // Parse the URL to get the path and parameters
    const url = new URL(req.url);
    const path = url.pathname.split('/').pop();

    // Handle different API endpoints
    if (req.method === 'GET' && path === 'agents') {
      // Get all agents for the current user
      const { data, error } = await supabaseClient
        .from('agents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return new Response(JSON.stringify({ data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (req.method === 'POST' && path === 'agents') {
      // Create a new agent
      const requestData = await req.json();
      
      const { data, error } = await supabaseClient
        .from('agents')
        .insert([{
          user_id: user.id,
          name: requestData.name,
          type: requestData.type,
          status: requestData.status || 'idle',
          description: requestData.description,
          capabilities: requestData.capabilities || [],
          config: requestData.config || {},
          performance: {
            tasksCompleted: 0,
            successRate: 0,
            averageResponseTime: 0,
            uptime: 0
          },
          metrics: {
            cpuUsage: 0,
            memoryUsage: 0,
            taskQueue: 0
          }
        }])
        .select()
        .single();

      if (error) throw error;

      return new Response(JSON.stringify({ data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (req.method === 'POST' && path === 'tasks') {
      // Create a new agent task
      const requestData = await req.json();
      
      // Verify the agent belongs to the user
      const { data: agent, error: agentError } = await supabaseClient
        .from('agents')
        .select('id')
        .eq('id', requestData.agent_id)
        .eq('user_id', user.id)
        .single();

      if (agentError || !agent) {
        throw new Error('Agent not found or not authorized');
      }
      
      const { data, error } = await supabaseClient
        .from('agent_tasks')
        .insert([{
          agent_id: requestData.agent_id,
          type: requestData.type,
          status: 'queued',
          priority: requestData.priority || 'medium',
          title: requestData.title,
          description: requestData.description,
          input: requestData.input || {},
          progress: 0,
          retry_count: 0,
          max_retries: requestData.max_retries || 3
        }])
        .select()
        .single();

      if (error) throw error;

      // Update the agent status if needed
      await supabaseClient
        .from('agents')
        .update({ status: 'busy' })
        .eq('id', requestData.agent_id);

      // Log an event
      await supabaseClient
        .from('agent_events')
        .insert([{
          agent_id: requestData.agent_id,
          type: 'task_created',
          message: `New task created: ${requestData.title}`,
          severity: 'info',
          metadata: { task_id: data.id }
        }]);

      return new Response(JSON.stringify({ data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (req.method === 'POST' && path === 'command') {
      // Process an agent command
      const requestData = await req.json();
      
      // Verify the agent belongs to the user
      const { data: agent, error: agentError } = await supabaseClient
        .from('agents')
        .select('*')
        .eq('id', requestData.agent_id)
        .eq('user_id', user.id)
        .single();

      if (agentError || !agent) {
        throw new Error('Agent not found or not authorized');
      }
      
      let result = { success: false, message: 'Unknown command' };
      
      // Process different commands
      switch (requestData.command) {
        case 'start':
          await supabaseClient
            .from('agents')
            .update({ status: 'active' })
            .eq('id', requestData.agent_id);
            
          await supabaseClient
            .from('agent_events')
            .insert([{
              agent_id: requestData.agent_id,
              type: 'status_change',
              message: `Agent status changed to active`,
              severity: 'info'
            }]);
            
          result = { success: true, message: 'Agent started' };
          break;
          
        case 'pause':
          await supabaseClient
            .from('agents')
            .update({ status: 'idle' })
            .eq('id', requestData.agent_id);
            
          await supabaseClient
            .from('agent_events')
            .insert([{
              agent_id: requestData.agent_id,
              type: 'status_change',
              message: `Agent status changed to idle`,
              severity: 'info'
            }]);
            
          result = { success: true, message: 'Agent paused' };
          break;
          
        case 'restart':
          await supabaseClient
            .from('agents')
            .update({ 
              status: 'active',
              metrics: {
                cpuUsage: 0,
                memoryUsage: 0,
                taskQueue: 0
              }
            })
            .eq('id', requestData.agent_id);
            
          await supabaseClient
            .from('agent_events')
            .insert([{
              agent_id: requestData.agent_id,
              type: 'restart',
              message: `Agent restarted`,
              severity: 'info'
            }]);
            
          result = { success: true, message: 'Agent restarted' };
          break;
      }

      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Return 404 for any other routes
    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error processing request:', error);
    
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});