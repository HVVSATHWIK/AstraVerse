/*
  # Metrics Table for Dashboard KPIs

  1. New Tables
    - `metrics`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `metric_name` (text)
      - `metric_value` (numeric)
      - `timestamp` (timestamp with time zone)
  
  2. Security
    - Enable RLS on the metrics table
    - Add policies for authenticated users to manage their own metrics
*/

-- Create metrics table
CREATE TABLE public.metrics (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  metric_name text NOT NULL,
  metric_value numeric NOT NULL,
  timestamp timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Create index for faster queries
CREATE INDEX metrics_user_id_metric_name_idx ON public.metrics (user_id, metric_name);
CREATE INDEX metrics_timestamp_idx ON public.metrics (timestamp);

-- Enable Row Level Security
ALTER TABLE public.metrics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for metrics
CREATE POLICY "Users can view their own metrics"
  ON public.metrics
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own metrics"
  ON public.metrics
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own metrics"
  ON public.metrics
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create a function to get the latest metrics for a user
CREATE OR REPLACE FUNCTION get_latest_metrics(p_user_id uuid)
RETURNS TABLE (
  metric_name text,
  metric_value numeric,
  timestamp timestamp with time zone
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
      m.timestamp,
      ROW_NUMBER() OVER (PARTITION BY m.metric_name ORDER BY m.timestamp DESC) as rn
    FROM 
      metrics m
    WHERE 
      m.user_id = p_user_id
  )
  SELECT 
    lm.metric_name,
    lm.metric_value,
    lm.timestamp
  FROM 
    latest_metrics lm
  WHERE 
    lm.rn = 1;
END;
$$;