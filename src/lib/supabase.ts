import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://jtrorcbkufgdblethefh.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0cm9yY2JrdWZnZGJsZXRoZWZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI1MzU5NDksImV4cCI6MjA0ODExMTk0OX0.Ec76dgUQMrrbwm3MizsNuE06C-TMyNYiXZvxFsGTFJY";

export const supabase = createClient(supabaseUrl, supabaseKey);