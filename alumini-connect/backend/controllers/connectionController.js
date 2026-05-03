const ConnectionRequest = require("../models/ConnectionRequest");
const User = require("../models/User");

const sendConnectionRequest = async (req, res) => {
  try {
    const { alumniId } = req.params;
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Please write a message for the alumni." });
    }

    if (req.user.id === alumniId) {
      return res.status(400).json({ message: "You cannot connect with yourself." });
    }

    const alumni = await User.findById(alumniId);
    if (!alumni || alumni.role !== "alumni") {
      return res.status(404).json({ message: "Alumni profile not found." });
    }

    const existingRequest = await ConnectionRequest.findOne({
      student: req.user.id,
      alumni: alumniId,
      status: "pending",
    });

    if (existingRequest) {
      return res.status(400).json({ message: "You already sent a connection request." });
    }

    const request = await ConnectionRequest.create({
      student: req.user.id,
      alumni: alumniId,
      message: message.trim(),
    });

    const populatedRequest = await request.populate([
      { path: "student", select: "name email course location" },
      { path: "alumni", select: "name email company location" },
    ]);

    res.status(201).json({
      message: "Connection request sent successfully.",
      request: populatedRequest,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to send connection request." });
  }
};

const getReceivedRequests = async (req, res) => {
  try {
    const requests = await ConnectionRequest.find({ alumni: req.user.id })
      .populate("student", "name email course location bio")
      .sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: "Failed to load received requests." });
  }
};

const getSentRequests = async (req, res) => {
  try {
    const requests = await ConnectionRequest.find({ student: req.user.id })
      .populate("alumni", "name email company location graduationYear bio")
      .sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: "Failed to load sent requests." });
  }
};

const getMyNetwork = async (req, res) => {
  try {
    const filter =
      req.user.role === "alumni"
        ? { alumni: req.user.id, status: "accepted" }
        : { student: req.user.id, status: "accepted" };

    const requests = await ConnectionRequest.find(filter)
      .populate("student", "name email course institution location bio")
      .populate("alumni", "name email company course institution location graduationYear bio")
      .sort({ updatedAt: -1 });

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: "Failed to load your network." });
  }
};

const updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["accepted", "declined"].includes(status)) {
      return res.status(400).json({ message: "Invalid request status." });
    }

    const request = await ConnectionRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: "Connection request not found." });
    }

    if (String(request.alumni) !== req.user.id) {
      return res.status(403).json({ message: "You can only manage your own requests." });
    }

    request.status = status;
    await request.save();

    const populatedRequest = await request.populate([
      { path: "student", select: "name email course location bio" },
      { path: "alumni", select: "name email company location" },
    ]);

    res.status(200).json({
      message: `Connection request ${status}.`,
      request: populatedRequest,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update connection request." });
  }
};

module.exports = {
  sendConnectionRequest,
  getReceivedRequests,
  getSentRequests,
  getMyNetwork,
  updateRequestStatus,
};
