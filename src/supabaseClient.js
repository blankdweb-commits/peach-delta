
import { createClient } from '@supabase/supabase-js';

// NOTE: In a real environment, use process.env.VITE_SUPABASE_URL (for Vite) or REACT_APP_ (for Create React App)
// React Scripts uses REACT_APP_ prefix by default.
// The provided keys are VITE_ prefixed, but standard CRA ignores them unless mapped.
// We will access them directly or via fallback for this prototype.

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL || 'https://gztcwtcxptpypouowosv.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY || process.env.REACT_APP_SUPABASE_KEY || 'sb_publishable_HrB7ZUfnpep15QTofH7n3w_l45iG5J7';

// Initialize the client
// In this mocked environment, we might not have internet access to reach the real Supabase instance.
// But this file serves as the integration point.
export const supabase = createClient(supabaseUrl, supabaseKey);
