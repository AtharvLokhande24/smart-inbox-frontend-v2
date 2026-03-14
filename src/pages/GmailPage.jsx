import React, { useMemo, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import EmailCard from "../components/EmailCard";

const mockGmailEmails = [
  {
    id: 1,
    subject: "Welcome to Smart Inbox",
    sender: "no-reply@gmail.com",
    preview: "Your Gmail integration is active — see your prioritized email below.",
    priority: "High",
    date: "Mar 14",
  },
  {
    id: 2,
    subject: "Weekly update from your team",
    sender: "team@example.com",
    preview: "Here’s what happened this week in the project.",
    priority: "Medium",
    date: "Mar 12",
  },
  {
    id: 3,
    subject: "New member joined your workspace",
    sender: "notifications@workspace.com",
    preview: "Say hello to the newest member and assign onboarding tasks.",
    priority: "Low",
    date: "Mar 10",
  },
];

function GmailPage() {
  const [filter, setFilter] = useState("All");

  const filteredEmails = useMemo(() => {
    if (filter === "All") return mockGmailEmails;
    return mockGmailEmails.filter((email) => email.priority === filter);
  }, [filter]);

  return (
    <DashboardLayout>
      <div className="bg-slate-50">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-8 py-6">
          <div>
            <h1 className="text-2xl font-semibold">Gmail</h1>
            <p className="mt-1 text-sm text-slate-500">
              Your Gmail inbox prioritized by AI.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-slate-800">Atharv</p>
              <p className="text-xs text-slate-500">Product Manager</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-semibold text-white">
              A
            </div>
          </div>
        </header>

        <main className="p-6">
          <section className="grid gap-6 lg:grid-cols-3">
            <div className="col-span-2 space-y-6">
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Gmail status</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Connected to Gmail
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    <span className="h-2 w-2 rounded-full bg-emerald-600" />
                    Connected
                  </span>
                </div>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Email list</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Filter what you see in your inbox.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    {[
                      { label: "All", value: "All" },
                      { label: "High", value: "High" },
                      { label: "Medium", value: "Medium" },
                      { label: "Low", value: "Low" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setFilter(option.value)}
                        className={`rounded-full px-4 py-2 text-sm font-semibold transition focus:outline-none ${
                          filter === option.value
                            ? "bg-indigo-600 text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  {filteredEmails.map((email) => (
                    <EmailCard
                      key={email.id}
                      subject={email.subject}
                      sender={email.sender}
                      preview={email.preview}
                      priority={email.priority}
                      date={email.date}
                      app="Gmail"
                    />
                  ))}
                  {filteredEmails.length === 0 ? (
                    <p className="text-sm text-slate-500">
                      No messages match this filter.
                    </p>
                  ) : null}
                </div>
              </div>
            </div>

            <aside className="space-y-6">
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">Quick tips</h2>
                <ul className="mt-4 space-y-3 text-sm text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-indigo-500" />
                    Use filters to see only high priority messages.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-indigo-500" />
                    Mark messages as starred to surface them later.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-indigo-500" />
                    Reconnect Gmail if you notice missing messages.
                  </li>
                </ul>
              </div>
            </aside>
          </section>
        </main>
      </div>
    </DashboardLayout>
  );
}

export default GmailPage;
