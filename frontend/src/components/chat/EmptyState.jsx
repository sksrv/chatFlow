const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-dark-500 select-none">
      {/* Decorative glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative flex flex-col items-center text-center px-8">
        {/* Icon */}
        <div className="w-20 h-20 bg-dark-300 border border-dark-100 rounded-3xl flex items-center justify-center mb-6 shadow-xl">
          <svg className="w-10 h-10 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </div>

        <h2 className="text-xl font-semibold text-slate-200 mb-2">Your Messages</h2>
        <p className="text-slate-500 text-sm max-w-xs leading-relaxed">
          Select a conversation from the sidebar to start chatting in real time.
        </p>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-2 mt-8">
          {[
            { icon: "⚡", label: "Real-time" },
            { icon: "✓", label: "Read receipts" },
            { icon: "🟢", label: "Online status" },
          ].map((f) => (
            <span
              key={f.label}
              className="flex items-center gap-1.5 bg-dark-300 border border-dark-100 text-slate-400 text-xs px-3 py-1.5 rounded-full"
            >
              <span>{f.icon}</span>
              {f.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmptyState;
