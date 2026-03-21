// backend/middleware/auth.js
const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  // Bearer <token>
  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Invalid token format" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user info for downstream routes
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Token is invalid or expired" });
  }
}

module.exports = verifyToken;