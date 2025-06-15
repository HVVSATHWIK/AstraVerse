
-- Create table for OpenAI configurations
CREATE TABLE public.openai_configurations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  model TEXT NOT NULL DEFAULT 'gpt-4o-mini',
  temperature DECIMAL(3,2) DEFAULT 0.7,
  max_tokens INTEGER DEFAULT 2048,
  top_p DECIMAL(3,2) DEFAULT 1.0,
  frequency_penalty DECIMAL(3,2) DEFAULT 0.0,
  presence_penalty DECIMAL(3,2) DEFAULT 0.0,
  system_prompt TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for OpenAI usage tracking
CREATE TABLE public.openai_usage_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  configuration_id UUID REFERENCES public.openai_configurations(id),
  model TEXT NOT NULL,
  prompt_tokens INTEGER DEFAULT 0,
  completion_tokens INTEGER DEFAULT 0,
  total_tokens INTEGER DEFAULT 0,
  cost_usd DECIMAL(10,6) DEFAULT 0,
  request_type TEXT DEFAULT 'chat_completion',
  status TEXT DEFAULT 'success',
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on OpenAI tables
ALTER TABLE public.openai_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.openai_usage_logs ENABLE ROW LEVEL SECURITY;

-- RLS policies for openai_configurations
CREATE POLICY "Users can view their own OpenAI configurations" 
  ON public.openai_configurations 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own OpenAI configurations" 
  ON public.openai_configurations 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own OpenAI configurations" 
  ON public.openai_configurations 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own OpenAI configurations" 
  ON public.openai_configurations 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- RLS policies for openai_usage_logs
CREATE POLICY "Users can view their own OpenAI usage logs" 
  ON public.openai_usage_logs 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own OpenAI usage logs" 
  ON public.openai_usage_logs 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Add triggers for updated_at
CREATE TRIGGER update_openai_configurations_updated_at 
  BEFORE UPDATE ON public.openai_configurations 
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
