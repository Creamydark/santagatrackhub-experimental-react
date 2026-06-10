const express = require("express");
const router = express.Router();
const supabase = require("../db");

// GET ALL PATIENTS
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("patients")
      .select(`
        *,
        immunizations (*)
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ADD PATIENT
router.post("/", async (req, res) => {
  try {
    const {
      name,
      age,
      gender,
      bloodType,
      allergies,
      address
    } = req.body;

    const { data, error } = await supabase
      .from("patients")
      .insert([
        {
          name,
          age,
          gender,
          bloodType,
          allergies,
          address
        }
      ])
      .select();

    if (error) throw error;

    res.status(201).json(data[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;