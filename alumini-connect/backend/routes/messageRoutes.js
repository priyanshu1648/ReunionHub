const express = require("express");
const { getMessages, sendMessage } = require("../controllers/messageController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/:connectionId", protect, getMessages);
router.post("/:connectionId", protect, sendMessage);

module.exports = router;
