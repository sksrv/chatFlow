import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useSocket } from "../../context/SocketContext.jsx";
import api from "../../utils/api.js";
import { getAvatarColor, formatSidebarTime } from "../../utils/helpers.js";

const Sidebar = ({ selectedUser, onSelectUser }) => {
  const { user, logout } = useAuth();
  const { isUserOnline } = useSocket();
  const [users, setUsers] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    try {
      const { data } = await api.get("/users");
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUnread = useCallback(async () => {
    try {
      const { data } = await api.get("/messages/unread");
      setUnreadCounts(data);
    } catch (err) {
      console.error("Failed to fetch unread", err);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchUnread();
    const interval = setInterval(fetchUnread, 5000);
    return () => clearInterval(interval);
  }, [fetchUsers, fetchUnread]);

  const handleSelectUser = (u) => {
    onSelectUser(u);
    setUnreadCounts((prev) => ({ ...prev, [u._id]: 0 }));
  };

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalUnread = Object.values(unreadCounts).reduce((a, b) => a + b, 0);

  return (
    <aside className="flex flex-col h-full bg-dark-400 border-r border-dark-100 w-72 lg:w-80 flex-shrink-0">
      {/* Header */}
      <div className="px-4 pt-5 pb-3 border-b border-dark-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <span className="font-bold text-white text-lg tracking-tight">ChatFlow</span>
            {totalUnread > 0 && (
              <span className="bg-brand-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                {totalUnread}
              </span>
            )}
          </div>
          <button
            onClick={logout}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-dark-200 transition-colors"
            title="Logout"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="w-full bg-dark-200 border border-dark-100 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
          />
        </div>
      </div>

      {/* User list */}
      <div className="flex-1 overflow-y-auto py-2">
        {loading ? (
          <div className="flex flex-col gap-2 px-4 pt-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl animate-pulse">
                <div className="w-10 h-10 bg-dark-200 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-dark-200 rounded w-2/3" />
                  <div className="h-2.5 bg-dark-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-slate-500 text-sm py-10">
            {search ? "No users found" : "No users yet"}
          </div>
        ) : (
          filtered.map((u) => {
            const online = isUserOnline(u._id);
            const unread = unreadCounts[u._id] || 0;
            const isActive = selectedUser?._id === u._id;

            return (
              <div
                key={u._id}
                onClick={() => handleSelectUser(u)}
                className={`sidebar-user-item ${isActive ? "active" : ""}`}
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className={`avatar w-11 h-11 text-sm ${getAvatarColor(u.name)}`}>
                    {u.name.charAt(0)}
                  </div>
                  {online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-dark-400" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-100 text-sm truncate">{u.name}</span>
                    {unread > 0 && (
                      <span className="bg-brand-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center flex-shrink-0 ml-1">
                        {unread > 9 ? "9+" : unread}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {online ? (
                      <span className="text-emerald-400 font-medium">Online</span>
                    ) : (
                      "Offline"
                    )}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Current user footer */}
      <div className="px-4 py-3 border-t border-dark-100 bg-dark-400">
        <div className="flex items-center gap-3">
          <div className={`avatar w-9 h-9 text-sm ${getAvatarColor(user?.name)}`}>
            {user?.name?.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-200 truncate">{user?.name}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>
          <div className="w-2 h-2 bg-emerald-400 rounded-full" />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
