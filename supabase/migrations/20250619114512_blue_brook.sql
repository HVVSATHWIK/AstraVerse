/*
  # Agents System Schema

  1. New Tables
    - `agents`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `name` (text)
      - `type` (text)
      - `status` (text)
      - `description` (text)
      - `capabilities` (jsonb)
      - `current_task_id` (uuid, nullable)
      - `performance` (jsonb)
      - `config` (jsonb)
      - `metrics` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `agent_tasks`
      - `id` (uuid, primary key)
      - `agent_id` (uuid, foreign key to agents)
      - `type` (text)
      - `status` (text)
      - `priority` (text)
      - `title` (text)
      - `description` (text)
      - `input` (jsonb)
      - `output` (jsonb)
      - `progress` (integer)
      - `estimated_duration` (integer)
      - `actual_duration` (integer)
      - `error` (text)
      - `retry_count` (integer)
      - `max_retries` (integer)
      - `created_at` (timestamp)
      - `started_at` (timestamp)
      - `completed_at` (timestamp)
    
    - `agent_events`
      - `id` (uuid, primary key)
      - `agent_id` (uuid, foreign key to agents)
      - `type` (text)
      - `message` (text)
      - `severity` (text)
      - `metadata` (jsonb)
      - `created_at` (timestamp)
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own agents
    - Add policies for agent tasks and events based on agent ownership
*/

-- Create agents table
CREATE TABLE public.agents (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL, -- e.g., 'assistant', 'analyzer', 'executor', 'monitor'
  status text NOT NULL, -- e.g., 'active', 'idle', 'busy', 'error', 'offline'
  description text,
  capabilities jsonb DEFAULT '[]'::jsonb, -- Array of strings, e.g., ['transcription', 'sentiment-analysis']
  current_task_id uuid, -- Optional: Foreign key to agent_tasks.id if an agent can only have one current task
  performance jsonb DEFAULT '{}'::jsonb, -- Object with metrics like tasks_completed, success_rate
  config jsonb DEFAULT '{}'::jsonb, -- Object with agent-specific configuration
  metrics jsonb DEFAULT '{}'::jsonb, -- Object with real-time metrics like cpu_usage, memory_usage
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Create agent_tasks table
CREATE TABLE public.agent_tasks (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  agent_id uuid NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
  type text NOT NULL, -- e.g., 'analysis', 'processing', 'monitoring', 'automation'
  status text NOT NULL, -- e.g., 'queued', 'running', 'completed', 'failed', 'cancelled'
  priority text NOT NULL, -- e.g., 'low', 'medium', 'high', 'urgent'
  title text NOT NULL,
  description text,
  input jsonb,
  output jsonb,
  progress integer DEFAULT 0,
  estimated_duration integer, -- in seconds
  actual_duration integer, -- in seconds
  error text,
  retry_count integer DEFAULT 0,
  max_retries integer,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  started_at timestamp with time zone,
  completed_at timestamp with time zone,
  PRIMARY KEY (id)
);

-- Add foreign key constraint for current_task_id in agents table
ALTER TABLE public.agents
ADD CONSTRAINT fk_current_task
FOREIGN KEY (current_task_id) REFERENCES public.agent_tasks(id) ON DELETE SET NULL;

-- Create agent_events table
CREATE TABLE public.agent_events (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  agent_id uuid NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
  type text NOT NULL, -- e.g., 'start', 'stop', 'error', 'task_complete', 'status_change'
  message text NOT NULL,
  severity text NOT NULL, -- e.g., 'info', 'warning', 'error', 'success'
  metadata jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Enable Row Level Security on new tables
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_events ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for agents
CREATE POLICY "Users can view their own agents"
  ON public.agents
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own agents"
  ON public.agents
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own agents"
  ON public.agents
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own agents"
  ON public.agents
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create RLS policies for agent_tasks
CREATE POLICY "Users can view their own agent tasks"
  ON public.agent_tasks
  FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.agents WHERE id = agent_id AND user_id = auth.uid()));

CREATE POLICY "Users can create their own agent tasks"
  ON public.agent_tasks
  FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.agents WHERE id = agent_id AND user_id = auth.uid()));

CREATE POLICY "Users can update their own agent tasks"
  ON public.agent_tasks
  FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.agents WHERE id = agent_id AND user_id = auth.uid()));

CREATE POLICY "Users can delete their own agent tasks"
  ON public.agent_tasks
  FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.agents WHERE id = agent_id AND user_id = auth.uid()));

-- Create RLS policies for agent_events
CREATE POLICY "Users can view their own agent events"
  ON public.agent_events
  FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.agents WHERE id = agent_id AND user_id = auth.uid()));

CREATE POLICY "Users can create their own agent events"
  ON public.agent_events
  FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.agents WHERE id = agent_id AND user_id = auth.uid()));

-- Add triggers for updated_at on new tables
CREATE TRIGGER handle_agents_updated_at
  BEFORE UPDATE ON public.agents
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_agent_tasks_updated_at
  BEFORE UPDATE ON public.agent_tasks
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();