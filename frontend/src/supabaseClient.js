import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Make sure both variables are passed to createClient
export const supabase = createClient(supabaseUrl, supabaseAnonKey)