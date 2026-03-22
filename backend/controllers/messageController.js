import Message from "../models/Message.js";
import User from "../models/User.js";

//Get all messages between two users
//GET /api/messages/:userId
export const getMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const myId = req.user._id;

    const conversationId = Message.getConversationId(myId, userId);

    const messages = await Message.find({ conversationId })
      .populate("sender", "name email")
      .populate("receiver", "name email")
      .sort({ createdAt: 1 });

    // Mark messages as seen if receiver is the logged-in user
    await Message.updateMany(
      {
        conversationId,
        receiver: myId,
        status: { $ne: "seen" },
      },
      { status: "seen" }
    );

    res.json(messages);
  } catch (error) {
    console.error("Get messages error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

//Send a message
//POST /api/messages
export const sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;

    if (!receiverId || !content) {
      return res.status(400).json({ message: "Receiver and content are required" });
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    const conversationId = Message.getConversationId(req.user._id, receiverId);

    const message = await Message.create({
      sender: req.user._id,
      receiver: receiverId,
      content,
      conversationId,
      status: receiver.isOnline ? "delivered" : "sent",
    });

    await message.populate("sender", "name email");
    await message.populate("receiver", "name email");

    res.status(201).json(message);
  } catch (error) {
    console.error("Send message error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

//Get unread message counts for all conversations
//GET /api/messages/unread
export const getUnreadCounts = async (req, res) => {
  try {
    const unreadMessages = await Message.aggregate([
      {
        $match: {
          receiver: req.user._id,
          status: { $ne: "seen" },
        },
      },
      {
        $group: {
          _id: "$sender",
          count: { $sum: 1 },
        },
      },
    ]);

    const unreadMap = {};
    unreadMessages.forEach((item) => {
      unreadMap[item._id.toString()] = item.count;
    });

    res.json(unreadMap);
  } catch (error) {
    console.error("Get unread counts error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
