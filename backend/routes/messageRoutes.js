import express from "express";
import {
  getMessages,
  sendMessage,
  getUnreadCounts,
} from "../controllers/messageController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/unread", protect, getUnreadCounts);
router.get("/:userId", protect, getMessages);
router.post("/", protect, sendMessage);

export default router;
