const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// We use the Service Role Key so the backend has "Admin Powers"
const supabase = createClient(
  process.env.SUPABASE_URL, 
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = supabase;