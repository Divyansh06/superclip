const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/authMiddleware");
const userController = require('../controllers/users');

router.get("/", authMiddleware, userController.get_user);

router.post("/", userController.create_user);

router.delete("/", authMiddleware, userController.delete_user);

module.exports = router;
