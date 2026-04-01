const express = require("express");
const router = express.Router();
const supabase = require("../db"); // Your new Supabase client
const bcrypt = require("bcryptjs");
const verifyToken = require("../middleware/auth");

// CREATE - Add a new user
router.post("/", verifyToken, async (req, res) => {
  const { name, email, password, role, status } = req.body;
  const password_hash = bcrypt.hashSync(password, 10);

  const { data, error } = await supabase
    .from('users')
    .insert([{ name, email, password_hash, role, status }])
    .select();

  if (error) return res.status(500).json({ message: error.message });
  res.status(201).json({ message: "User created", userId: data[0].id });
});

// READ - Get all users
router.get("/", verifyToken, async (req, res) => {
  const { data, error } = await supabase
    .from('users')
    .select('id, name, email, role, status');

  if (error) return res.status(500).json({ message: error.message });
  res.json(data);
});

// READ - Get current user profile
router.get("/me", verifyToken, async (req, res) => {
  const { data, error } = await supabase
    .from('users')
    .select('name, role')
    .eq('id', req.user.id)
    .single();
    
  if (error || !data) return res.status(404).json({ message: "User not found" });
  res.json(data);
});

// UPDATE - Update user by id
router.put("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const { name, email, password, role, status } = req.body;
  
  const updateData = { name, email, role, status };
  if (password) {
    updateData.password_hash = bcrypt.hashSync(password, 10);
  }

  const { error } = await supabase
    .from('users')
    .update(updateData)
    .eq('id', id);

  if (error) return res.status(500).json({ message: error.message });
  res.json({ message: "User updated" });
});

// DELETE - Delete user by id
router.delete("/:id", verifyToken, async (req, res) => {
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', req.params.id);

  if (error) return res.status(500).json({ message: error.message });
  res.json({ message: "User deleted" });
});

module.exports = router;