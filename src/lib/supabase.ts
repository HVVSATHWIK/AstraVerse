
import { createClient } from '@supabase/supabase-js';

// Configuration with fallback values for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Log configuration status for debugging
const isPlaceholder = supabaseUrl.includes('placeholder');
console.log('Supabase Configuration:', { 
  url: supabaseUrl, 
  hasKey: !!supabaseAnonKey,
  isPlaceholder,
  status: isPlaceholder ? 'Using placeholder values' : 'Using environment variables'
});

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Export configuration status for other modules
export const supabaseConfig = {
  isConfigured: !isPlaceholder,
  url: supabaseUrl,
  isPlaceholder
};
