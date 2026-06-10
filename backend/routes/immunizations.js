const express = require("express");
const router = express.Router();
const supabase = require("../db");

router.post("/", async (req, res) => {
  try {
    const {
      patient_id,
      vaccineType,
      dose,
      administeredBy,
      status,
      nextSchedule,
      remarks,
      dateGiven
    } = req.body;

    const { data, error } = await supabase
      .from("immunizations")
      .insert([
        {
          patient_id,
          vaccineType,
          dose,
          administeredBy,
          status,
          nextSchedule,
          remarks,
          dateGiven
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