const express = require("express");
const router = express.Router();
const db = require("../db");

// GET all vehicles
router.get("/", async (req, res) => {
  const db = req.app.get('db');
  
  try {
    const [rows] = await db.query("SELECT * FROM vehicles ORDER BY created_at DESC");
    
    const formatted = rows.map(v => ({
      _id: v.id,
      id: v.plate_number,
      name: v.name,
      model: v.model,
      type: v.type,
      fuel: v.fuel,
      speed: v.speed,
      status: v.status,
      createdBy: v.created_by,
      // NEW: Fetch the current driver
      currentUser: v.current_user 
    }));
    
    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database Error: " + err.message });
  }
});

// POST a new vehicle
router.post("/", async (req, res) => {
  const db = req.app.get('db');
  const { name, id, model, type, fuel, speed, status, creator } = req.body;

  try {
    const sql = `INSERT INTO vehicles (name, plate_number, model, type, fuel, speed, status, created_by) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    
    const creatorName = typeof creator === 'string' ? creator : (creator?.name || 'Admin');
    
    // Default new vehicles to Idle
    const values = [name, id, model, type, fuel, speed, 'Idle', creatorName];
    
    const [result] = await db.query(sql, values);
    res.status(201).json({ _id: result.insertId, message: "Vehicle added" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Insert Error: " + err.message });
  }
});

// PUT (Update Base Info)
router.put("/:id", async (req, res) => {
  const db = req.app.get('db');
  const vehicleId = req.params.id;
  const { name, id, model, type, fuel } = req.body;

  try {
    const sql = `UPDATE vehicles SET name = ?, plate_number = ?, model = ?, type = ?, fuel = ? WHERE id = ?`;
    const [result] = await db.query(sql, [name, id, model, type, fuel, vehicleId]);
    
    if (result.affectedRows === 0) return res.status(404).json({ message: "Vehicle not found" });
    res.json({ message: "Vehicle updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database Error: " + err.message });
  }
});

// NEW ROUTE: PUT (Update Status & Driver)
router.put("/:id/status", async (req, res) => {
  const db = req.app.get('db');
  const vehicleId = req.params.id;
  const { status, currentUser } = req.body;

  try {
    // FIX: Wrapped current_user in backticks to prevent MariaDB keyword conflict
    const sql = `UPDATE vehicles SET status = ?, \`current_user\` = ? WHERE id = ?`;
    
    // If status is not "On the run", we clear the driver name
    const driver = status === 'On the run' ? currentUser : null;
    
    const [result] = await db.query(sql, [status, driver, vehicleId]);
    
    if (result.affectedRows === 0) return res.status(404).json({ message: "Vehicle not found" });
    res.json({ message: "Status updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database Error: " + err.message });
  }
});

// DELETE a vehicle
router.delete("/:id", async (req, res) => {
  const db = req.app.get('db');
  try {
    await db.query("DELETE FROM vehicles WHERE id = ?", [req.params.id]);
    res.json({ message: "Vehicle deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;