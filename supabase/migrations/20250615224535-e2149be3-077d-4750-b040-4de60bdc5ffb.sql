
-- Fix the Function Search Path Mutable security issue
-- Update the handle_updated_at function to have a stable search path
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Update the handle_new_user function to have a stable search path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

-- Remove OpenAI related tables
DROP TABLE IF EXISTS public.openai_usage_logs;
DROP TABLE IF EXISTS public.openai_configurations;
