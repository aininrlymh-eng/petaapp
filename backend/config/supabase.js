const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

let supabase = null;

const hasSupabaseConfig = process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY;

if (hasSupabaseConfig) {
  try {
    supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );
  } catch (err) {
    console.error('Gagal menginisialisasi Supabase:', err.message);
  }
}

module.exports = supabase;
