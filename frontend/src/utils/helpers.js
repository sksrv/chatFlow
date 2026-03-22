import { format, isToday, isYesterday, formatDistanceToNow } from "date-fns";

export const formatMessageTime = (date) => {
  return format(new Date(date), "h:mm a");
};

export const formatLastSeen = (date) => {
  if (!date) return "Offline";
  const d = new Date(date);
  if (isToday(d)) return `Today at ${format(d, "h:mm a")}`;
  if (isYesterday(d)) return `Yesterday at ${format(d, "h:mm a")}`;
  return format(d, "MMM d, yyyy");
};

export const formatSidebarTime = (date) => {
  if (!date) return "";
  const d = new Date(date);
  if (isToday(d)) return format(d, "h:mm a");
  if (isYesterday(d)) return "Yesterday";
  return format(d, "MM/dd/yyyy");
};

export const getAvatarColor = (name) => {
  const colors = [
    "bg-violet-600",
    "bg-blue-600",
    "bg-emerald-600",
    "bg-amber-600",
    "bg-rose-600",
    "bg-cyan-600",
    "bg-fuchsia-600",
    "bg-teal-600",
  ];
  const index = name?.charCodeAt(0) % colors.length;
  return colors[index] || colors[0];
};
