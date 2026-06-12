const express = require("express");
const router = express.Router();
const supabase = require("../db");

router.get("/", async (req, res) => {
  const { data, error } = await supabase
    .from("vaccine_inventory")
    .select("*");

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

router.post("/", async (req, res) => {
  try {
    const {
      name,
      doses,
      minThreshold,
      category,
      lastRestock
    } = req.body;

    const { data, error } = await supabase
      .from("vaccine_inventory")
      .insert([
        {
          name,
          doses,
          minThreshold,
          category,
          lastRestock
        }
      ])
      .select();

    if (error) throw error;

    res.status(201).json(data[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err.message
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      doses,
      minThreshold,
      category,
      lastRestock
    } = req.body;

    const { data, error } = await supabase
      .from("vaccine_inventory")
      .update({
        name,
        doses,
        minThreshold,
        category,
        lastRestock
      })
      .eq("id", id)
      .select();

    if (error) throw error;

    res.json(data[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err.message
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("vaccine_inventory")
      .delete()
      .eq("id", id);

    if (error) throw error;

    res.json({
      success: true
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err.message
    });
  }
});

module.exports = router;