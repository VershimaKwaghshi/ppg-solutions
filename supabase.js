const sb = supabase.createClient(
  window.PPG_CONFIG.SUPABASE_URL,
  window.PPG_CONFIG.SUPABOR_ANON_KEY || window.PPG_CONFIG.SUPABASE_ANON_KEY
);
