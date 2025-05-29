const connectToDatabase = require("../../db");
const { ObjectId } = require("mongodb");

exports.get_clips = async (req, res) => {
  const db = await connectToDatabase();
  if (!db) {
    return res.status(500).json({
      error: "Database connection failed",
    });
  }

  const userId = new ObjectId(req.user.userId);

  try {
    let clips = await db
      .collection("clips")
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();

    if (!clips || clips.length === 0) {
      return res.status(200).json([]);
    }

    clips = clips.map((clip) => ({
      id: clip._id,
      text: clip.text,
    }));

    res.status(200).json(clips);
  } catch (error) {
    console.error("Error fetching clips:", error);
    res.status(500).json({
      error: "Failed to fetch clips",
    });
  }
};

exports.create_clip = async (req, res) => {
  const db = await connectToDatabase();
  if (!db) {
    return res.status(500).json({
      error: "Database connection failed",
    });
  }

  const userId = new ObjectId(req.user.userId);
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({
      error: "Text is required",
    });
  }
  try {
    const newClip = {
      text,
      userId,
      createdAt: new Date().getTime(),
    };

    const result = await db.collection("clips").insertOne(newClip);
    if (!result.insertedId) {
      return res.status(500).json({
        error: "Failed to create clip",
      });
    }

    res.status(201).json({
      id: result.insertedId.toString(),
      text: newClip.text,
    });
  } catch (error) {
    console.error("Error creating clip:", error);
    res.status(500).json({
      error: "Failed to create clip",
    });
  }
};

exports.delete_clips = async (req, res) => {
  const db = await connectToDatabase();
  if (!db) {
    return res.status(500).json({
      error: "Database connection failed",
    });
  }

  const userId = new ObjectId(req.user.userId);
  if (!userId) {
    return res.status(400).json({
      error: "User ID is required",
    });
  }
  try {
    const result = await db.collection("clips").deleteMany({ userId });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        error: "No clips found for this user",
      });
    }

    res.status(200).json({
      message: "All clips deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting clips:", error);
    res.status(500).json({
      error: "Failed to delete clips",
    });
  }
};

exports.delete_clip_by_id = async (req, res) => {
  const db = await connectToDatabase();
  if (!db) {
    return res.status(500).json({
      error: "Database connection failed",
    });
  }

  const clipId = req.params.clipId;
  const userId = new ObjectId(req.user.userId);

  try {
    const result = await db.collection("clips").deleteOne({
      _id: new ObjectId(clipId),
      userId,
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        error: "Clip not found or you do not have permission to delete it",
      });
    }

    res.status(200).json({
      message: "Clip deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting clip:", error);
    res.status(500).json({
      error: "Failed to delete clip",
    });
  }
};
