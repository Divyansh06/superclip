const connectToDatabase = require("../../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const db = await connectToDatabase();
  if (!db) {
    return res.status(500).json({
      error: "Database connection failed",
    });
  }

  const user = await db.collection("users").findOne({ email: email });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  if (!user.password) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  if (
    email !== user.email ||
    !(await bcrypt.compare(password, user.password))
  ) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Generate JWT token
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1Y",
  });
  res.json({ token });
};

exports.alive = async (req, res) => {
  const db = await connectToDatabase();
  if (!db) {
    return res.status(500).json({
      error: "Database connection failed",
    });
  }

  const isAlive = await db.command({ ping: 1 });
  if (!isAlive.ok) {
    return res.status(500).json({ error: "Database connection is not alive" });
  }

  res.status(200).json({ message: "Service is alive!" });
};
