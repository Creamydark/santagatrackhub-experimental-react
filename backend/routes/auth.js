// backend/routes/auth.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");

// REGISTER
// REGISTER
router.post("/register", async (req, res) => {
  // Set default status to 'pending' instead of 'active'
  const { name, email, password, role = "user", status = "pending" } = req.body;

  try {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length > 0) return res.status(400).json({ message: "Email already exists" });

    const password_hash = bcrypt.hashSync(password, 10);
    const sql = `INSERT INTO users (name, email, password_hash, role, status) VALUES (?, ?, ?, ?, ?)`;
    
    await db.query(sql, [name, email, password_hash, role, status]);
    res.status(201).json({ message: "Registration successful. Pending admin approval." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0) return res.status(400).json({ message: "User not found" });

    const user = rows[0];

    // BLOCK LOGIN IF NOT ACTIVE
    if (user.status.toLowerCase() !== "active") {
      return res.status(403).json({ 
        message: "Your account is pending approval. Please contact an admin." 
      });
    }

    const valid = bcrypt.compareSync(password, user.password_hash);
    if (!valid) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);
    res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});



module.exports = router;