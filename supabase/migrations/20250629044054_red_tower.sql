/*
  # Add additional profile fields

  1. Changes
    - Add bio, company, location, phone, and website fields to profiles table
*/

-- Add new columns to profiles table if they don't exist
DO $$ 
BEGIN
  -- Add bio column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_schema = 'public' 
                AND table_name = 'profiles' 
                AND column_name = 'bio') THEN
    ALTER TABLE public.profiles ADD COLUMN bio text;
  END IF;

  -- Add company column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_schema = 'public' 
                AND table_name = 'profiles' 
                AND column_name = 'company') THEN
    ALTER TABLE public.profiles ADD COLUMN company text;
  END IF;

  -- Add location column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_schema = 'public' 
                AND table_name = 'profiles' 
                AND column_name = 'location') THEN
    ALTER TABLE public.profiles ADD COLUMN location text;
  END IF;

  -- Add phone column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_schema = 'public' 
                AND table_name = 'profiles' 
                AND column_name = 'phone') THEN
    ALTER TABLE public.profiles ADD COLUMN phone text;
  END IF;

  -- Add website column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_schema = 'public' 
                AND table_name = 'profiles' 
                AND column_name = 'website') THEN
    ALTER TABLE public.profiles ADD COLUMN website text;
  END IF;
END $$;