
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// OpenAI model pricing per 1K tokens (input/output)
const MODEL_PRICING = {
  'gpt-4o-mini': { input: 0.00015, output: 0.0006 },
  'gpt-4o': { input: 0.0025, output: 0.01 },
  'gpt-4.1-2025-04-14': { input: 0.003, output: 0.012 },
};

function calculateCost(model: string, promptTokens: number, completionTokens: number): number {
  const pricing = MODEL_PRICING[model as keyof typeof MODEL_PRICING];
  if (!pricing) return 0;
  
  const inputCost = (promptTokens / 1000) * pricing.input;
  const outputCost = (completionTokens / 1000) * pricing.output;
  return inputCost + outputCost;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const {
      prompt,
      configurationId,
      model = 'gpt-4o-mini',
      temperature = 0.7,
      max_tokens = 2048,
      system_prompt = 'You are a helpful AI assistant.',
    } = await req.json();

    if (!prompt) {
      throw new Error('Prompt is required');
    }

    // Get user from JWT token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Authorization header required');
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Invalid authentication');
    }

    console.log('Making OpenAI request:', { model, temperature, max_tokens, prompt: prompt.substring(0, 100) + '...' });

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: system_prompt },
          { role: 'user', content: prompt }
        ],
        temperature,
        max_tokens,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(errorData.error?.message || 'OpenAI API request failed');
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;
    const usage = data.usage;

    // Calculate cost
    const cost = calculateCost(model, usage.prompt_tokens, usage.completion_tokens);

    // Log usage to database
    try {
      const { error: logError } = await supabase
        .from('openai_usage_logs')
        .insert({
          user_id: user.id,
          configuration_id: configurationId || null,
          model,
          prompt_tokens: usage.prompt_tokens,
          completion_tokens: usage.completion_tokens,
          total_tokens: usage.total_tokens,
          cost_usd: cost,
          request_type: 'chat_completion',
          status: 'success',
          metadata: {
            temperature,
            max_tokens,
            system_prompt: system_prompt.substring(0, 200),
          },
        });

      if (logError) {
        console.error('Failed to log usage:', logError);
      }
    } catch (logError) {
      console.error('Usage logging error:', logError);
    }

    const result = {
      content: generatedContent,
      usage: {
        prompt_tokens: usage.prompt_tokens,
        completion_tokens: usage.completion_tokens,
        total_tokens: usage.total_tokens,
      },
      model,
      cost_usd: cost,
    };

    console.log('OpenAI generation successful:', {
      tokens: usage.total_tokens,
      cost: cost.toFixed(6),
      contentLength: generatedContent.length,
    });

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in openai-generate function:', error);
    
    // Try to log the error if we have user context
    try {
      const authHeader = req.headers.get('Authorization');
      if (authHeader) {
        const { data: { user } } = await supabase.auth.getUser(
          authHeader.replace('Bearer ', '')
        );
        
        if (user) {
          await supabase
            .from('openai_usage_logs')
            .insert({
              user_id: user.id,
              model: 'unknown',
              prompt_tokens: 0,
              completion_tokens: 0,
              total_tokens: 0,
              cost_usd: 0,
              request_type: 'chat_completion',
              status: 'failed',
              error_message: error.message,
            });
        }
      }
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }

    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
