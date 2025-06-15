
-- Create user workflows table
CREATE TABLE public.user_workflows (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  config jsonb DEFAULT '{}',
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('active', 'paused', 'draft')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Create user integrations table
CREATE TABLE public.user_integrations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  integration_type text NOT NULL,
  name text NOT NULL,
  config jsonb DEFAULT '{}',
  enabled boolean NOT NULL DEFAULT true,
  last_sync timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Create user activity logs table
CREATE TABLE public.user_activity_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action text NOT NULL,
  description text NOT NULL,
  metadata jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Add missing columns to existing profiles table if they don't exist
DO $$
BEGIN
  -- Add email column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='email') THEN
    ALTER TABLE public.profiles ADD COLUMN email text;
  END IF;
END $$;

-- Enable Row Level Security on new tables
ALTER TABLE public.user_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for workflows
CREATE POLICY "Users can view their own workflows" 
  ON public.user_workflows 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own workflows" 
  ON public.user_workflows 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workflows" 
  ON public.user_workflows 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workflows" 
  ON public.user_workflows 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create RLS policies for integrations
CREATE POLICY "Users can view their own integrations" 
  ON public.user_integrations 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own integrations" 
  ON public.user_integrations 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own integrations" 
  ON public.user_integrations 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own integrations" 
  ON public.user_integrations 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create RLS policies for activity logs
CREATE POLICY "Users can view their own activity logs" 
  ON public.user_activity_logs 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own activity logs" 
  ON public.user_activity_logs 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Update the existing handle_new_user function to work with our schema
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Update the existing profiles table with email if it exists
  UPDATE public.profiles 
  SET email = NEW.email,
      updated_at = now()
  WHERE id = NEW.id;
  
  -- If no update happened, insert new record
  IF NOT FOUND THEN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'fullName', 'User')
    );
  END IF;
  
  -- Log user creation
  INSERT INTO public.user_activity_logs (user_id, action, description)
  VALUES (
    NEW.id,
    'user_registered',
    'User account created successfully'
  );
  
  RETURN NEW;
END;
$$;

-- Create function to update updated_at timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Add triggers for updated_at on relevant tables
CREATE TRIGGER handle_workflows_updated_at
  BEFORE UPDATE ON public.user_workflows
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_integrations_updated_at
  BEFORE UPDATE ON public.user_integrations
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
