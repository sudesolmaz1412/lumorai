import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("LUMORA: .env.local dosyasında Supabase anahtarları eksik!");
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);