import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://pcwapuyxrqisisnmlyev.supabase.co';
const SUPABASE_KEY = 'sb_publishable_xSqe4igI-6hR7wjuNprcYg_tS2_Xijs';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);