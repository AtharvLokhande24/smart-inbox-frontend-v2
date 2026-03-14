import React from "react";
import DashboardLayout from "../components/DashboardLayout";
import EmailCard from "../components/EmailCard";
import { HiOutlineSearch, HiOutlineBell } from "react-icons/hi";

const mockEmails = [
  {
    id: 1,
    subject: "Project Deadline Tomorrow",
    sender: "pm@company.com",
    app: "Slack",
    preview: "Please review the latest deliverables and confirm the timeline.",
    priority: "High",
  },
  {
    id: 2,
    subject: "Weekly Newsletter",
    sender: "news@updates.com",
    app: "Gmail",
    preview: "Your curated digest for the week is here. Highlights inside.",
    priority: "Low",
  },
  {
    id: 3,
    subject: "Team Meeting Reminder",
    sender: "hr@company.com",
    app: "Teams",
    preview: "Don't forget the all-hands tomorrow at 10 AM. Agenda attached.",
    priority: "Medium",
  },
];

const Dashboard = () => {

  return (
    <DashboardLayout>
      <div className="bg-slate-50">
        <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
          <div className="flex flex-col">
            <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
            <p className="text-sm text-gray-500">
              Your AI-prioritized inbox — focus on what matters most.
            </p>
          </div>

          <div className="flex flex-1 justify-center px-6">
            <div className="w-full max-w-md flex items-center bg-gray-100 rounded-lg px-3 py-2">
              <HiOutlineSearch className="text-gray-500 text-lg" />
              <input
                type="text"
                placeholder="Search emails, senders, or keywords..."
                className="ml-3 w-full bg-transparent outline-none text-sm text-gray-700"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              className="p-2 rounded-lg hover:bg-gray-100 transition relative"
              aria-label="Notifications"
            >
              <HiOutlineBell className="text-gray-600 text-lg" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500" />
            </button>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-800">Atharv</p>
                <p className="text-xs text-gray-500">Product Manager</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-sm font-semibold text-white">
                A
              </div>
            </div>
          </div>
        </header>


        <main className="p-6 flex-1 overflow-y-auto">
          <div className="h-full grid grid-cols-1 lg:grid-cols-12 gap-6">
            <section className="lg:col-span-8 flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Smart Inbox</h2>
                  <p className="text-sm text-slate-500">Prioritized by AI, ordered by importance.</p>
                </div>
                <div className="inline-flex items-center gap-3 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600">
                  <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  Connected
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {mockEmails.map((email) => (
                  <EmailCard
                    key={email.id}
                    subject={email.subject}
                    sender={email.sender}
                    preview={email.preview}
                    priority={email.priority}
                    app={email.app}
                  />
                ))}
              </div>
            </section>

            <aside className="lg:col-span-4 flex flex-col gap-6">
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">AI Insights</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Quick insights to help you stay on top of your inbox and focus on what matters.
                </p>

                <div className="mt-6 space-y-4">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-800">Top sender</p>
                    <p className="mt-1 text-sm text-slate-600">Project updates from pm@company.com</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-800">Follow ups</p>
                    <p className="mt-1 text-sm text-slate-600">3 threads need a reply this week.</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-800">Focus time</p>
                    <p className="mt-1 text-sm text-slate-600">You have 2 uninterrupted hours today.</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">Tips & shortcuts</h2>
                <ul className="mt-4 space-y-3 text-sm text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-indigo-500" />
                    Use filters to surface starred or unread email quickly.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-indigo-500" />
                    Pin important threads and turn off non-essential notifications.
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;