const ConnectionRequest = require("../models/ConnectionRequest");
const Message = require("../models/Message");

const getConnectionByIdForUser = async (connectionId, userId) => {
  const connection = await ConnectionRequest.findById(connectionId)
    .populate("student", "name email course institution location")
    .populate("alumni", "name email company course institution location");

  if (!connection || connection.status !== "accepted") {
    return null;
  }

  const isParticipant =
    String(connection.student._id) === userId || String(connection.alumni._id) === userId;

  if (!isParticipant) {
    return null;
  }

  return connection;
};

const getMessages = async (req, res) => {
  try {
    const connection = await getConnectionByIdForUser(req.params.connectionId, req.user.id);

    if (!connection) {
      return res.status(404).json({ message: "Chat not available for this connection." });
    }

    const messages = await Message.find({ connection: connection._id })
      .populate("sender", "name email role")
      .populate("receiver", "name email role")
      .sort({ createdAt: 1 });

    res.status(200).json({
      connection,
      messages,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to load chat messages." });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Message text is required." });
    }

    const connection = await getConnectionByIdForUser(req.params.connectionId, req.user.id);

    if (!connection) {
      return res.status(404).json({ message: "Chat not available for this connection." });
    }

    const receiverId =
      String(connection.student._id) === req.user.id
        ? connection.alumni._id
        : connection.student._id;

    const message = await Message.create({
      connection: connection._id,
      sender: req.user.id,
      receiver: receiverId,
      text: text.trim(),
    });

    const populatedMessage = await message.populate([
      { path: "sender", select: "name email role" },
      { path: "receiver", select: "name email role" },
    ]);

    res.status(201).json({
      message: "Message sent successfully.",
      chatMessage: populatedMessage,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to send message." });
  }
};

module.exports = {
  getMessages,
  sendMessage,
};
