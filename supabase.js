// Supabase Initialization
const { createClient } = supabase;
const sb = createClient(
  window.PPG_CONFIG.SUPABASE_URL,
  window.PPG_CONFIG.SUPABASE_ANON_KEY
);
