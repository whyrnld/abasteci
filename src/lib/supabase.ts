import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jtrorcbkufgdblethefh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0cm9yY2JrdWZnZGJsZXRoZWZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDI0ODI5ODAsImV4cCI6MjAxODA1ODk4MH0.vlpDYgJrNZ1E1x_fh5ZVLxN0Ld1K1XYE-5S6VFII_Vw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});