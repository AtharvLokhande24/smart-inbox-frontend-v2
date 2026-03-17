import React, { useState } from "react";
import { HiOutlinePaperClip, HiOutlineEmojiHappy } from "react-icons/hi";

function ReplyBox({ sender, subject, onCancel, onSend }) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage("");
    }
  };

  return (
    <div className="transition-all duration-300 mt-4 bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
      {/* Header with To field */}
      <div className="mb-4">
        <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
          To:
        </p>
        <p className="text-sm text-slate-700 mt-1">{sender}</p>
      </div>

      {/* Subject reference (optional) */}
      <p className="text-xs text-slate-500 mb-3">
        Re: {subject}
      </p>

      {/* Textarea */}
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Write your reply..."
        className="w-full p-3 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
        rows="4"
      />

      {/* Action buttons and icons */}
      <div className="flex items-center justify-between mt-4">
        {/* Left: Icons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
            title="Attach file"
          >
            <HiOutlinePaperClip className="w-5 h-5" />
          </button>
          <button
            type="button"
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
            title="Add emoji"
          >
            <HiOutlineEmojiHappy className="w-5 h-5" />
          </button>
        </div>

        {/* Right: Send and Cancel buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="text-sm text-slate-500 hover:text-slate-700 cursor-pointer transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={!message.trim()}
            className="px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReplyBox;
