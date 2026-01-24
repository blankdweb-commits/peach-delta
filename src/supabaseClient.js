
import { createClient } from '@supabase/supabase-js';

// Instructions: Replace with your specific Project URL and Anon Key
const supabaseUrl = 'https://db.mjbyvsfwjynbcibmgrsf.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'PLACEHOLDER_KEY_PLEASE_UPDATE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
