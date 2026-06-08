const express = require("express");
const router = express.Router();
const supabase = require("../db");

// GET all vehicles
router.get("/", async (req, res) => {
  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) return res.status(500).json({ message: error.message });

  const formatted = data.map(v => ({
    _id: v.id,
    id: v.plate_number,
    name: v.name,
    model: v.model,
    type: v.type,
    fuel: v.fuel,
    speed: v.speed,
    status: v.status,
    createdBy: v.created_by,
    currentUser: v.current_user 
  }));
  
  res.json(formatted);
});
//asdasdada
// POST a new vehicle
router.post("/", async (req, res) => {
  const { name, id, model, type, fuel, speed, creator } = req.body;
  const creatorName = typeof creator === 'string' ? creator : (creator?.name || 'Admin');

  const { data, error } = await supabase
    .from('vehicles')
    .insert([{
      name: name,
      plate_number: id, // Mapping 'id' from frontend to 'plate_number' in DB
      model: model,
      type: type,
      fuel: fuel,
      speed: parseInt(speed) || 0,
      status: 'Idle',
      created_by: creatorName
    }])
    .select();

  if (error) {
    console.error("Supabase Insertion Error:", error);
    return res.status(500).json({ message: error.message });
  }
  
  res.status(201).json({ _id: data[0].id, message: "Vehicle added" });
});

// UPDATE Status & Driver
router.put("/:id/status", async (req, res) => {
  const { status, currentUser } = req.body;
  const driver = status === 'On the run' ? currentUser : null;

  const { error } = await supabase
    .from('vehicles')
    .update({ status, current_user: driver })
    .eq('id', req.params.id);
    
  if (error) return res.status(500).json({ message: error.message });
  res.json({ message: "Status updated successfully" });
});

// DELETE a vehicle
router.delete("/:id", async (req, res) => {
  const { error } = await supabase
    .from('vehicles')
    .delete()
    .eq('id', req.params.id);

  if (error) return res.status(500).json({ message: error.message });
  res.json({ message: "Vehicle deleted" });
});

module.exports = router;