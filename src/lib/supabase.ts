import { createClient } from '@supabase/supabase-js';

// Default values for development - replace these with your actual Supabase project values
const defaultSupabaseUrl = 'https://your-project.supabase.co';
const defaultSupabaseKey = 'your-anon-key';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || defaultSupabaseUrl;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || defaultSupabaseKey;

export const supabase = createClient(supabaseUrl, supabaseKey);