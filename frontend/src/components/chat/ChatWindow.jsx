import { useEffect, useRef, useState, useCallback } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useSocket } from "../../context/SocketContext.jsx";
import api from "../../utils/api.js";
import MessageBubble from "./MessageBubble.jsx";
import TypingIndicator from "./TypingIndicator.jsx";
import { getAvatarColor } from "../../utils/helpers.js";

const ChatWindow = ({ selectedUser }) => {
  const { user } = useAuth();
  const { getSocket, isUserOnline } = useSocket();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Fetch message history
  useEffect(() => {
    if (!selectedUser) return;
    setMessages([]);
    setLoading(true);
    const fetchMessages = async () => {
      try {
        const { data } = await api.get(`/messages/${selectedUser._id}`);
        setMessages(data);

        // Notify socket that messages are seen
        const socket = getSocket();
        if (socket) {
          const conversationId = [user._id, selectedUser._id].sort().join("_");
          socket.emit("message:seen", {
            conversationId,
            senderId: selectedUser._id,
          });
        }
      } catch (err) {
        console.error("Failed to load messages", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
    inputRef.current?.focus();
  }, [selectedUser, user._id, getSocket]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  // Socket event listeners
  useEffect(() => {
    const socket = getSocket();
    if (!socket || !selectedUser) return;

    const handleMessageReceived = (message) => {
      const isRelevant =
        (message.sender._id === selectedUser._id && message.receiver._id === user._id) ||
        (message.sender._id === user._id && message.receiver._id === selectedUser._id);

      if (!isRelevant) return;

      setMessages((prev) => {
        // Avoid duplicates
        const exists = prev.find((m) => m._id === message._id);
        if (exists) {
          return prev.map((m) => (m._id === message._id ? message : m));
        }
        return [...prev, message];
      });

      // Mark as seen if the other user sent it
      if (message.sender._id === selectedUser._id) {
        const conversationId = [user._id, selectedUser._id].sort().join("_");
        socket.emit("message:seen", {
          conversationId,
          senderId: selectedUser._id,
        });
      }
    };

    const handleTypingStart = ({ senderId }) => {
      if (senderId === selectedUser._id) setIsTyping(true);
    };

    const handleTypingStop = ({ senderId }) => {
      if (senderId === selectedUser._id) setIsTyping(false);
    };

    const handleSeenAck = ({ conversationId }) => {
      const expectedId = [user._id, selectedUser._id].sort().join("_");
      if (conversationId === expectedId) {
        setMessages((prev) =>
          prev.map((m) =>
            m.sender._id === user._id ? { ...m, status: "seen" } : m
          )
        );
      }
    };

    socket.on("message:received", handleMessageReceived);
    socket.on("typing:start", handleTypingStart);
    socket.on("typing:stop", handleTypingStop);
    socket.on("message:seen:ack", handleSeenAck);

    return () => {
      socket.off("message:received", handleMessageReceived);
      socket.off("typing:start", handleTypingStart);
      socket.off("typing:stop", handleTypingStop);
      socket.off("message:seen:ack", handleSeenAck);
    };
  }, [getSocket, selectedUser, user._id]);

  const handleTextChange = (e) => {
    setText(e.target.value);
    const socket = getSocket();
    if (!socket || !selectedUser) return;

    socket.emit("typing:start", { senderId: user._id, receiverId: selectedUser._id });

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("typing:stop", { senderId: user._id, receiverId: selectedUser._id });
    }, 1500);
  };

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!text.trim() || sending) return;

    const socket = getSocket();
    socket?.emit("typing:stop", { senderId: user._id, receiverId: selectedUser._id });

    setSending(true);
    const content = text.trim();
    setText("");

    try {
      // Use socket for real-time delivery
      if (socket) {
        socket.emit("message:send", {
          senderId: user._id,
          receiverId: selectedUser._id,
          content,
        });
      } else {
        // Fallback to HTTP
        const { data } = await api.post("/messages", {
          receiverId: selectedUser._id,
          content,
        });
        setMessages((prev) => [...prev, data]);
      }
    } catch (err) {
      console.error("Failed to send message", err);
      setText(content);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const online = isUserOnline(selectedUser._id);

  return (
    <div className="flex flex-col h-full bg-dark-500">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 bg-dark-400 border-b border-dark-100 flex-shrink-0">
        <div className="relative">
          <div className={`avatar w-10 h-10 text-sm ${getAvatarColor(selectedUser.name)}`}>
            {selectedUser.name.charAt(0)}
          </div>
          {online && (
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-dark-400" />
          )}
        </div>
        <div>
          <h2 className="font-semibold text-white text-sm">{selectedUser.name}</h2>
          <p className={`text-xs ${online ? "text-emerald-400" : "text-slate-500"}`}>
            {online ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-0.5">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className={`avatar w-16 h-16 text-2xl mb-4 ${getAvatarColor(selectedUser.name)}`}>
              {selectedUser.name.charAt(0)}
            </div>
            <p className="text-slate-300 font-medium">{selectedUser.name}</p>
            <p className="text-slate-500 text-sm mt-1">
              Send a message to start the conversation
            </p>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <MessageBubble
                key={msg._id}
                message={msg}
                isSent={msg.sender._id === user._id || msg.sender === user._id}
              />
            ))}
          </>
        )}

        {isTyping && <TypingIndicator name={selectedUser.name} />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="px-4 py-4 bg-dark-400 border-t border-dark-100 flex-shrink-0">
        <form onSubmit={handleSend} className="flex items-end gap-3">
          <div className="flex-1 bg-dark-200 border border-dark-100 rounded-2xl px-4 py-3 flex items-end gap-2 focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500 transition-colors">
            <textarea
              ref={inputRef}
              value={text}
              onChange={handleTextChange}
              onKeyDown={handleKeyDown}
              placeholder={`Message ${selectedUser.name}...`}
              rows={1}
              className="flex-1 bg-transparent text-slate-200 placeholder-slate-500 text-sm resize-none focus:outline-none leading-relaxed max-h-32 overflow-y-auto"
              style={{ minHeight: "24px" }}
            />
          </div>
          <button
            type="submit"
            disabled={!text.trim() || sending}
            className="w-11 h-11 bg-brand-600 hover:bg-brand-500 active:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-150 shadow-lg shadow-brand-600/20"
          >
            {sending ? (
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <svg className="w-4 h-4 text-white translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 2L11 13M22 2L15 22 11 13 2 9l20-7z" />
              </svg>
            )}
          </button>
        </form>
        <p className="text-xs text-slate-600 mt-2 text-center">
          Press <kbd className="font-mono bg-dark-200 px-1 rounded">Enter</kbd> to send
        </p>
      </div>
    </div>
  );
};

export default ChatWindow;
