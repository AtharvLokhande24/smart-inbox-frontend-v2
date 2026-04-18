import React from "react";

const priorityStyles = {
  High: "bg-red-50 text-red-700",
  Medium: "bg-yellow-50 text-yellow-700",
  Low: "bg-gray-100 text-gray-700",
};

function EmailCard({
  subject,
  sender,
  preview,
  priority = "Low",
  date,
  app,
  onReply,
}) {
  const badgeStyles = priorityStyles[priority] ?? priorityStyles.Low;

  const handleReply = () => {
    if (onReply) {
      onReply();
    }
  };

  return (
    <article className="group relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      {/* Priority Badge - Top Right */}
      <div className="absolute top-4 right-4">
        <span
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${badgeStyles}`}
        >
          <span className="h-2 w-2 rounded-full bg-current" />
          {priority}
        </span>
      </div>

      {/* Main Content */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="truncate text-base font-semibold text-slate-900">
                {subject}
              </h3>
              <p className="mt-1 text-sm text-slate-500">{sender}</p>
            </div>
            {date ? (
              <p className="whitespace-nowrap text-xs text-slate-400">{date}</p>
            ) : null}
          </div>

          <p className="mt-3 text-sm text-slate-600 max-h-10 overflow-hidden">
            {preview}
          </p>
        </div>
      </div>

      {/* Footer: Source and Reply Button */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
        {app ? (
          <span className="text-xs font-medium text-slate-400">
            Source: {app}
          </span>
        ) : (
          <div />
        )}

        {/* Reply Button - Bottom Right, Hidden by default */}
        <button
          type="button"
          onClick={handleReply}
          className="opacity-0 translate-y-1 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200 text-sm px-3 py-1 rounded-md bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Reply
        </button>
      </div>
    </article>
  );
}

export default EmailCard;
