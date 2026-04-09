import { createClient } from '@supabase/supabase-js';

// Vite automatically handles the .env loading, no require() needed!
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);


