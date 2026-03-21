const express = require("express");
const cors = require("cors");
const db = require("./db"); // Import your pool.promise() from db.js

const app = express();
app.use(cors());
app.use(express.json());

// Attach the database pool to the app so routes can access it
app.set('db', db); 

// Routes (Make sure these come AFTER app.set('db'))
app.use("/api/vehicles", require("./routes/vehicles"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));

app.listen(5000, () => console.log("🚀 Server running on http://localhost:5000"));