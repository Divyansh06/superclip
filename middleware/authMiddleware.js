const jwt = require("jsonwebtoken");
const connectToDatabase = require("../db");
const { ObjectId } = require("mongodb");

module.exports = async function (req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const db = await connectToDatabase();
    if (!db) {
      return res.status(500).json({ message: "Database connection failed" });
    }
    const userId = new ObjectId(decoded.userId);
    const user = await db.collection("users").findOne({ _id: userId });

    if (!user) {
      return res.status(403).json({ message: "Invalid User!" });
    }
    req.user = decoded;

    next();
  } catch (err) {
    res.status(403).json({ message: "Token is invalid or expired" });
  }
};
