
import { createClient } from '@supabase/supabase-js';

// For development, we'll use placeholder values if env vars aren't set
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

console.log('Supabase config:', { 
  url: supabaseUrl, 
  hasKey: !!supabaseAnonKey,
  isPlaceholder: supabaseUrl.includes('placeholder')
});

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
