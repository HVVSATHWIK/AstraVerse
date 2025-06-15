
import { createClient } from '@supabase/supabase-js';

// Use the actual Supabase project configuration
const supabaseUrl = 'https://hiwbmeaiwrusuvtkabyz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhpd2JtZWFpd3J1c3V2dGthYnl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5ODM4ODcsImV4cCI6MjA2NTU1OTg4N30.Np7LGLxtzUs--Cymu9D3zWyToJgpYWqgSEPrGkHCjFI';

// Log configuration status for debugging
console.log('Supabase Configuration:', { 
  url: supabaseUrl, 
  hasKey: !!supabaseAnonKey,
  status: 'Using production Supabase project'
});

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: localStorage
  }
});

// Export configuration status for other modules
export const supabaseConfig = {
  isConfigured: true,
  url: supabaseUrl,
  isPlaceholder: false
};
