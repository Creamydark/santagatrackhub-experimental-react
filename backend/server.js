const express = require("express");
const cors = require("cors");
const supabase = require("./db"); // This is now your Supabase client

const app = express();
app.use(cors());
app.use(express.json());

// We still attach it so your 'req.app.get("db")' calls don't break immediately
app.set('db', supabase); 

// Routes
app.use("/api/vehicles", require("./routes/vehicles"));
app.use("/api/patients", require("./routes/patients"));
app.use("/api/immunizations", require("./routes/immunizations"));
app.use("/api/auth", require("./routes/authRoutes")); // New route for syncing users

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));