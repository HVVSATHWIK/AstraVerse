
-- Fix RLS policies for profiles table (with proper error handling)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create RLS policies for profiles table
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

-- Add missing RLS policies for user tables (drop first to avoid conflicts)
DROP POLICY IF EXISTS "Users can view their own workflows" ON public.user_workflows;
DROP POLICY IF EXISTS "Users can create their own workflows" ON public.user_workflows;
DROP POLICY IF EXISTS "Users can update their own workflows" ON public.user_workflows;
DROP POLICY IF EXISTS "Users can delete their own workflows" ON public.user_workflows;

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

-- Integrations policies
DROP POLICY IF EXISTS "Users can view their own integrations" ON public.user_integrations;
DROP POLICY IF EXISTS "Users can create their own integrations" ON public.user_integrations;
DROP POLICY IF EXISTS "Users can update their own integrations" ON public.user_integrations;
DROP POLICY IF EXISTS "Users can delete their own integrations" ON public.user_integrations;

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

-- Activity logs policies
DROP POLICY IF EXISTS "Users can view their own activity logs" ON public.user_activity_logs;
DROP POLICY IF EXISTS "Users can create their own activity logs" ON public.user_activity_logs;

CREATE POLICY "Users can view their own activity logs" 
  ON public.user_activity_logs 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own activity logs" 
  ON public.user_activity_logs 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Improve the handle_new_user function to be more robust
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert or update profile
  INSERT INTO public.profiles (id, email, full_name, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data ->> 'full_name', 
      NEW.raw_user_meta_data ->> 'fullName', 
      'User'
    ),
    now(),
    now()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = NEW.email,
    updated_at = now();
  
  -- Log user creation
  INSERT INTO public.user_activity_logs (user_id, action, description, created_at)
  VALUES (
    NEW.id,
    'user_registered',
    'User account created successfully',
    now()
  );
  
  RETURN NEW;
END;
$$;

-- Ensure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
