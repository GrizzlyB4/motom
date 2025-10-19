import { createClient } from '@supabase/supabase-js';

// These would typically come from environment variables
// For now, using placeholder values - replace with your actual Supabase credentials
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';

// Create a single supabase client for the entire application
export const supabase = createClient(supabaseUrl, supabaseAnonKey);