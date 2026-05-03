const express = require("express");
const {
  sendConnectionRequest,
  getReceivedRequests,
  getSentRequests,
  getMyNetwork,
  updateRequestStatus,
} = require("../controllers/connectionController");
const { protect, alumniOnly, studentOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/received", protect, alumniOnly, getReceivedRequests);
router.get("/sent", protect, studentOnly, getSentRequests);
router.get("/network", protect, getMyNetwork);
router.post("/:alumniId", protect, studentOnly, sendConnectionRequest);
router.patch("/:id", protect, alumniOnly, updateRequestStatus);

module.exports = router;
