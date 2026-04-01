const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const supabase = require("../db");

// REGISTER
router.post("/register", async (req, res) => {
  const { name, email, password, role = "user", status = "pending" } = req.body;

  // Check if email exists
  const { data: existingUser } = await supabase
    .from('users')
    .select('email')
    .eq('email', email)
    .single();

  if (existingUser) return res.status(400).json({ message: "Email already exists" });

  const password_hash = bcrypt.hashSync(password, 10);
  
  const { error } = await supabase
    .from('users')
    .insert([{ name, email, password_hash, role, status }]);

  if (error) return res.status(500).json({ message: error.message });
  res.status(201).json({ message: "Registration successful. Pending admin approval." });
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !user) return res.status(400).json({ message: "User not found" });

  if (user.status.toLowerCase() !== "active") {
    return res.status(403).json({ message: "Your account is pending approval." });
  }

  const valid = bcrypt.compareSync(password, user.password_hash);
  if (!valid) return res.status(400).json({ message: "Invalid password" });

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);
  res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
});

module.exports = router;