const express = require('express');
const router = express.Router();
const supabase = require('../db'); // This is your Supabase client

router.post('/sync-user', async (req, res) => {
  const { auth_id, name, email, role, status } = req.body;

  // Supabase syntax instead of db.query
  const { data, error } = await supabase
    .from('profiles')
    .insert([
      { auth_id, name, email, role, status }
    ]);

  if (error) {
    console.error("Supabase Error:", error);
    return res.status(500).json({ error: "Failed to sync profile to Supabase" });
  }

  return res.status(201).json({ message: "Profile successfully synced to Supabase", data });
});

// backend/routes/authRoutes.js

// backend/routes/authRoutes.js

// Fetch profile data using Supabase syntax instead of db.query
router.get('/profile/:auth_id', async (req, res) => {
  const { auth_id } = req.params;

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('name, role, status')
      .eq('auth_id', auth_id)
      .single(); // Gets exactly one row

    if (error) {
      console.error("Supabase Error:", error);
      return res.status(500).json({ error: "Database error fetching profile" });
    }

    if (!data) {
      return res.status(404).json({ error: "Profile not found" });
    }

    res.json(data);
  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


// backend/routes/authRoutes.js

// This handles: GET http://localhost:5000/api/auth/profiles
router.get('/profiles', async (req, res) => {
  try {
    // If using Supabase as your DB:
    const { data, error } = await supabase
      .from('profiles')
      .select('*');

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch profiles" });
  }
});

// UPDATE USER PROFILE
router.put('/profiles/:auth_id', async (req, res) => {
  const { auth_id } = req.params;
  const { name, role, status } = req.body;

  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({ name, role, status })
      .eq('auth_id', auth_id);

    if (error) throw error;
    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE USER PROFILE
router.delete('/profiles/:auth_id', async (req, res) => {
  const { auth_id } = req.params;

  try {
    // STEP 1: Delete from Supabase Auth (The Service Role Key is required for this)
    // This prevents the "already signed up" error on re-registration
    const { error: authError } = await supabase.auth.admin.deleteUser(auth_id);
    
    if (authError) {
      console.error("Auth Deletion Error:", authError);
      // We continue anyway to try and clean up the profile table
    }

    // STEP 2: Delete from your MySQL/Profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('auth_id', auth_id);

    if (profileError) throw profileError;

    res.json({ message: "User completely wiped from the system." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fully delete user." });
  }
});

module.exports = router;