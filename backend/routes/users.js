const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcryptjs");
const verifyToken = require("../middleware/auth");

// CREATE - Add a new user
router.post("/", verifyToken, async (req, res) => {
  const { name, email, password, role, status } = req.body;
  const password_hash = bcrypt.hashSync(password, 10);

  try {
    const sql = `
      INSERT INTO users (name, email, password_hash, role, status)
      VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await db.query(sql, [name, email, password_hash, role, status]);
    res.status(201).json({ message: "User created", userId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating user" });
  }
});

// READ - Get all users
router.get("/", verifyToken, async (req, res) => {
  try {
    const [rows] = await db.query("SELECT id, name, email, role, status FROM users");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching users" });
  }
});

// Add this to your users.js file
router.get("/me", verifyToken, async (req, res) => {
  try {
    // Assuming verifyToken adds 'user' to the req object (e.g., req.user.id)
    const [rows] = await db.query(
      "SELECT name, role FROM users WHERE id = ?", 
      [req.user.id]
    );
    
    if (rows.length === 0) return res.status(404).json({ message: "User not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching profile" });
  }
});


// READ - Get a single user by id
router.get("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query("SELECT id, name, email, role, status FROM users WHERE id = ?", [id]);
    if (rows.length === 0) return res.status(404).json({ message: "User not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching user" });
  }
});

// UPDATE - Update user by id
router.put("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const { name, email, password, role, status } = req.body;
  const password_hash = password ? bcrypt.hashSync(password, 10) : undefined;

  try {
    const sql = `
      UPDATE users
      SET name = ?, email = ?, password_hash = COALESCE(?, password_hash), role = ?, status = ?
      WHERE id = ?
    `;
    await db.query(sql, [name, email, password_hash, role, status, id]);
    res.json({ message: "User updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating user" });
  }
});

// DELETE - Delete user by id
router.delete("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM users WHERE id = ?", [id]);
    res.json({ message: "User deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting user" });
  }
});




module.exports = router;