-- Create user_workflows table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.user_workflows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  steps jsonb DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'draft',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Add status check constraint if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'user_workflows_status_check' AND conrelid = 'public.user_workflows'::regclass
  ) THEN
    ALTER TABLE public.user_workflows 
      ADD CONSTRAINT user_workflows_status_check 
      CHECK (status IN ('draft', 'active', 'paused', 'error'));
  END IF;
END $$;

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to user_workflows if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'handle_workflows_updated_at' AND tgrelid = 'public.user_workflows'::regclass
  ) THEN
    CREATE TRIGGER handle_workflows_updated_at
    BEFORE UPDATE ON public.user_workflows
    FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
  END IF;
END $$;

-- Enable Row Level Security
ALTER TABLE public.user_workflows ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can create their own workflows" ON public.user_workflows;
DROP POLICY IF EXISTS "Users can view their own workflows" ON public.user_workflows;
DROP POLICY IF EXISTS "Users can update their own workflows" ON public.user_workflows;
DROP POLICY IF EXISTS "Users can delete their own workflows" ON public.user_workflows;

-- Create RLS policies
CREATE POLICY "Users can create their own workflows"
  ON public.user_workflows
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own workflows"
  ON public.user_workflows
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own workflows"
  ON public.user_workflows
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workflows"
  ON public.user_workflows
  FOR DELETE
  USING (auth.uid() = user_id);