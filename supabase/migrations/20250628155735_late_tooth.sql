/*
# Check and Create Metrics Table

1. New Features
   - Adds metrics table if it doesn't exist
   - Creates indexes for efficient querying
   - Adds RLS policies for security
   - Adds function to get latest metrics

2. Security
   - Enable RLS on metrics table
   - Add policies for authenticated users
*/

-- Check if metrics table exists before creating it
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'metrics') THEN
    -- Create metrics table
    CREATE TABLE public.metrics (
      id uuid NOT NULL DEFAULT gen_random_uuid(),
      user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      metric_name text NOT NULL,
      metric_value numeric NOT NULL,
      created_at timestamp with time zone NOT NULL DEFAULT now(),
      PRIMARY KEY (id)
    );

    -- Create index for faster queries
    CREATE INDEX metrics_user_id_metric_name_idx ON public.metrics (user_id, metric_name);
    CREATE INDEX metrics_created_at_idx ON public.metrics (created_at);

    -- Enable Row Level Security
    ALTER TABLE public.metrics ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Create RLS policies if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'metrics' AND policyname = 'Users can view their own metrics') THEN
    CREATE POLICY "Users can view their own metrics"
      ON public.metrics
      FOR SELECT
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'metrics' AND policyname = 'Users can insert their own metrics') THEN
    CREATE POLICY "Users can insert their own metrics"
      ON public.metrics
      FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'metrics' AND policyname = 'Users can update their own metrics') THEN
    CREATE POLICY "Users can update their own metrics"
      ON public.metrics
      FOR UPDATE
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Create or replace function to get the latest metrics for a user
CREATE OR REPLACE FUNCTION get_latest_metrics(p_user_id uuid)
RETURNS TABLE (
  metric_name text,
  metric_value numeric,
  created_at timestamp with time zone
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  WITH latest_metrics AS (
    SELECT 
      m.metric_name,
      m.metric_value,
      m.created_at,
      ROW_NUMBER() OVER (PARTITION BY m.metric_name ORDER BY m.created_at DESC) as rn
    FROM 
      metrics m
    WHERE 
      m.user_id = p_user_id
  )
  SELECT 
    lm.metric_name,
    lm.metric_value,
    lm.created_at
  FROM 
    latest_metrics lm
  WHERE 
    lm.rn = 1;
END;
$$;