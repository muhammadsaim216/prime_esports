import { createClient } from '@supabase/supabase-js';

// Use the Project ID from your screenshot to form this URL
const supabaseUrl = 'https://bdljohzimjeitwpzktuv.supabase.co';

// Paste the 'default' publishable key from your screenshot here
const supabaseAnonKey = 'sb_publishable_Gs46i84_7OLi7KS1ET8jVA_rlB-fTXR';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);