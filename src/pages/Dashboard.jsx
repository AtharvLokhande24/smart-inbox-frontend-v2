import React, { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import EmailCard from "../components/EmailCard";
import ReplyBox from "../components/ReplyBox";
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
  const [replyingEmailId, setReplyingEmailId] = useState(null);
  const [replies, setReplies] = useState({});

  const handleReply = (emailId) => {
    setReplyingEmailId(emailId);
  };

  const handleSendReply = (emailId, message) => {
    console.log(`Reply sent to email ${emailId}:`, message);
    setReplies({
      ...replies,
      [emailId]: message,
    });
    setReplyingEmailId(null);
  };

  const handleCancelReply = () => {
    setReplyingEmailId(null);
  };
    <DashboardLayout title="Dashboard">
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
              <div key={email.id}>
                <EmailCard
                  subject={email.subject}
                  sender={email.sender}
                  preview={email.preview}
                  priority={email.priority}
                  app={email.app}
                  onReply={() => handleReply(email.id)}
                />
                {replyingEmailId === email.id && (
                  <ReplyBox
                    sender={email.sender}
                    subject={email.subject}
                    onCancel={handleCancelReply}
                    onSend={(message) => handleSendReply(email.id, message)}
                  />
                )}
              </div>
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
    </DashboardLayout>
  

};

export default Dashboard;