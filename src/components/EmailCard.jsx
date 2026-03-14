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
}) {
  const badgeStyles = priorityStyles[priority] ?? priorityStyles.Low;

  return (
    <article className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
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

        <span
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${badgeStyles}`}
        >
          <span className="h-2 w-2 rounded-full bg-current" />
          {priority}
        </span>
      </div>

      {app ? (
        <div className="mt-3 text-xs font-medium text-slate-400">
          Source: {app}
        </div>
      ) : null}
    </article>
  );
}

export default EmailCard;
