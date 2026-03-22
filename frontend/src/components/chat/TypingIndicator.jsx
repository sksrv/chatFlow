const TypingIndicator = ({ name }) => {
  return (
    <div className="flex items-center gap-2 px-4 py-2 animate-fade-in">
      <div className="bg-dark-100 rounded-2xl rounded-tl-sm px-4 py-2.5 flex items-center gap-2">
        <div className="flex items-center gap-1">
          <span className="typing-dot" />
          <span className="typing-dot" />
          <span className="typing-dot" />
        </div>
      </div>
      <span className="text-xs text-slate-500">{name} is typing</span>
    </div>
  );
};

export default TypingIndicator;
