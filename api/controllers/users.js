const connectToDatabase = require("../../db");
const { ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");

exports.get_user = async (req, res) => {
  const db = await connectToDatabase();
  if (!db) {
    return res.status(500).json({
      error: "Database connection failed",
    });
  }

  const userId = new ObjectId(req.user.userId);
  const user = await db.collection("users").findOne({ _id: userId });
  if (!user) {
    return res.status(404).json({
      error: "User not found",
    });
  }

  res.status(200).json({
    id: user._id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  });
};

exports.create_user = async (req, res) => {
  const db = await connectToDatabase();
  if (!db) {
    return res.status(500).json({
      error: "Database connection failed",
    });
  }

  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({
      error: "Name, email, and password are required",
    });
  }

  try {
    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ email: email });

    if (existingUser) {
      return res.status(400).json({
        error: "User with this email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      name,
      email,
      password: hashedPassword,
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    };

    const user = await db.collection("users").insertOne(newUser);
    res.status(200).json(user);
  } catch (error) {
    console.error("Error inserting user:", error);
    res.status(500).json({
      error: "Failed to insert user",
    });
  }
};

exports.delete_user = async (req, res) => {
  const userId = new ObjectId(req.user.userId);
  if (!userId) {
    return res.status(400).json({
      error: "User ID is required",
    });
  }

  const db = await connectToDatabase();
  if (!db) {
    return res.status(500).json({
      error: "Database connection failed",
    });
  }

  const result = await db.collection("users").deleteOne({ _id: userId });
  if (result.deletedCount === 0) {
    return res.status(404).json({
      error: "User not found",
    });
  }
  res.status(200).json({
    message: "User deleted successfully!",
  });
};
