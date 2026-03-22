import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: [true, "Message content is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["sent", "delivered", "seen"],
      default: "sent",
    },
    conversationId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Generate consistent conversationId for two users
messageSchema.statics.getConversationId = (userId1, userId2) => {
  return [userId1.toString(), userId2.toString()].sort().join("_");
};

const Message = mongoose.model("Message", messageSchema);
export default Message;
