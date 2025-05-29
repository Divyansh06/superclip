const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/authMiddleware");
const clipController = require("../controllers/clips");

router.get("/", authMiddleware, clipController.get_clips);

router.post("/", authMiddleware, clipController.create_clip);

router.delete("/clear", authMiddleware, clipController.delete_clips);

router.delete("/:clipId", authMiddleware, clipController.delete_clip_by_id);

module.exports = router;
