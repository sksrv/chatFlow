import Message from "../models/Message.js";
import User from "../models/User.js";


const onlineUsers = new Map();

const initSocket = (io) => {
  io.on("connection", (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    // User comes online
    socket.on("user:online", async (userId) => {
      onlineUsers.set(userId, socket.id);
      socket.userId = userId;

      // Update user status in DB
      await User.findByIdAndUpdate(userId, { isOnline: true, lastSeen: new Date() });

      // Broadcast updated online users list to all
      io.emit("users:online", Array.from(onlineUsers.keys()));
      console.log(`✅ User online: ${userId}`);
    });

    // Send a message
    socket.on("message:send", async (data) => {
      const { senderId, receiverId, content } = data;

      try {
        const conversationId = [senderId, receiverId].sort().join("_");
        const receiverOnline = onlineUsers.has(receiverId);

        const message = await Message.create({
          sender: senderId,
          receiver: receiverId,
          content,
          conversationId,
          status: receiverOnline ? "delivered" : "sent",
        });

        await message.populate("sender", "name email");
        await message.populate("receiver", "name email");

        // Emit to sender
        socket.emit("message:received", message);

        // Emit to receiver if online
        const receiverSocketId = onlineUsers.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("message:received", message);
        }
      } catch (error) {
        console.error("Socket message error:", error.message);
        socket.emit("message:error", { message: "Failed to send message" });
      }
    });

    // Message seen
    socket.on("message:seen", async ({ conversationId, senderId }) => {
      try {
        await Message.updateMany(
          { conversationId, sender: senderId, status: { $ne: "seen" } },
          { status: "seen" }
        );

        // Notify the original sender their messages were seen
        const senderSocketId = onlineUsers.get(senderId);
        if (senderSocketId) {
          io.to(senderSocketId).emit("message:seen:ack", { conversationId });
        }
      } catch (error) {
        console.error("Message seen error:", error.message);
      }
    });

    // Typing indicator
    socket.on("typing:start", ({ senderId, receiverId }) => {
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("typing:start", { senderId });
      }
    });

    socket.on("typing:stop", ({ senderId, receiverId }) => {
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("typing:stop", { senderId });
      }
    });

    // Disconnect
    socket.on("disconnect", async () => {
      const userId = socket.userId;
      if (userId) {
        onlineUsers.delete(userId);

        await User.findByIdAndUpdate(userId, {
          isOnline: false,
          lastSeen: new Date(),
        });

        io.emit("users:online", Array.from(onlineUsers.keys()));
        console.log(` User offline: ${userId}`);
      }
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
};

export default initSocket;
