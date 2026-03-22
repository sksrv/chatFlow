import { useState } from "react";
import Sidebar from "../components/chat/Sidebar.jsx";
import ChatWindow from "../components/chat/ChatWindow.jsx";
import EmptyState from "../components/chat/EmptyState.jsx";

const ChatPage = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(true);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setMobileSidebarOpen(false);
  };

  const handleBack = () => {
    setMobileSidebarOpen(true);
    setSelectedUser(null);
  };

  return (
    <div className="h-full flex overflow-hidden">
      {/* Sidebar — hidden on mobile when chat is open */}
      <div
        className={`${
          mobileSidebarOpen ? "flex" : "hidden"
        } md:flex h-full`}
      >
        <Sidebar selectedUser={selectedUser} onSelectUser={handleSelectUser} />
      </div>

      {/* Chat area */}
      <div className={`${!mobileSidebarOpen ? "flex" : "hidden"} md:flex flex-1 flex-col h-full overflow-hidden`}>
        {/* Mobile back button */}
        {selectedUser && (
          <button
            onClick={handleBack}
            className="md:hidden flex items-center gap-2 px-4 py-3 text-brand-400 text-sm font-medium bg-dark-400 border-b border-dark-100"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        )}

        {selectedUser ? (
          <ChatWindow selectedUser={selectedUser} key={selectedUser._id} />
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
};

export default ChatPage;
