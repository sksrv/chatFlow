import { formatMessageTime } from "../../utils/helpers.js";

const StatusIcon = ({ status }) => {
  if (status === "seen") {
    return (
      <svg className="w-3.5 h-3.5 text-brand-300 inline ml-1" viewBox="0 0 24 24" fill="currentColor">
        <path d="M1.5 12.5L7 18 22.5 3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M6.5 12.5L12 18 22.5 3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    );
  }
  if (status === "delivered") {
    return (
      <svg className="w-3.5 h-3.5 text-slate-400 inline ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1.5 12.5L7 18 22.5 3" /><path d="M6.5 12.5L12 18 22.5 3" />
      </svg>
    );
  }
  return (
    <svg className="w-3.5 h-3.5 text-slate-400 inline ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12L10 17 20 7" />
    </svg>
  );
};

const MessageBubble = ({ message, isSent }) => {
  return (
    <div className={`flex ${isSent ? "justify-end" : "justify-start"} mb-1.5 animate-fade-in`}>
      <div className={isSent ? "msg-bubble-sent" : "msg-bubble-received"}>
        <p className="text-sm leading-relaxed">{message.content}</p>
        <div className={`flex items-center gap-1 mt-1 ${isSent ? "justify-end" : "justify-start"}`}>
          <span className={`text-xs ${isSent ? "text-brand-200/70" : "text-slate-500"}`}>
            {formatMessageTime(message.createdAt)}
          </span>
          {isSent && <StatusIcon status={message.status} />}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
