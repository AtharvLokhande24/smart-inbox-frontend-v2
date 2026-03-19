import React, { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import EmailCard from "../components/EmailCard";
import ReplyBox from "../components/ReplyBox";

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

  return (
    <DashboardLayout title="Dashboard">
      <div className="h-full grid grid-cols-1 lg:grid-cols-12 gap-6 px-2">

        {/* LEFT SECTION */}
        <section className="lg:col-span-8 flex flex-col overflow-hidden rounded-3xl bg-white/70 backdrop-blur-xl shadow-lg border border-gray-200">

          {/* 🔥 MODERN HEADER */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-white to-gray-50/50">

            <div>
              <h2 className="text-xl font-semibold text-gray-900 tracking-tight">
                Smart Inbox
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Prioritized by AI • Ordered by importance
              </p>
            </div>

            <div className="flex items-center gap-2 bg-green-50 text-green-600 px-4 py-1.5 rounded-full text-xs font-medium shadow-sm">
              <span className="h-2 w-2 bg-green-500 rounded-full"></span>
              Connected
            </div>
          </div>

          {/* EMAIL LIST */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5">

            {mockEmails.map((email) => (
              <div key={email.id} className="group">

                <div className="transition-all duration-300 hover:scale-[1.01] hover:shadow-md rounded-xl">
                  <EmailCard
                    subject={email.subject}
                    sender={email.sender}
                    preview={email.preview}
                    priority={email.priority}
                    app={email.app}
                    onReply={() => handleReply(email.id)}
                  />
                </div>

                {/* REPLY BOX */}
                {replyingEmailId === email.id && (
                  <div className="mt-3">
                    <ReplyBox
                      sender={email.sender}
                      subject={email.subject}
                      onCancel={handleCancelReply}
                      onSend={(message) =>
                        handleSendReply(email.id, message)
                      }
                    />
                  </div>
                )}

              </div>
            ))}

          </div>
        </section>

        {/* RIGHT SECTION */}
        <aside className="lg:col-span-4 flex flex-col gap-6">

          {/* AI INSIGHTS */}
          <div className="rounded-3xl bg-white/70 backdrop-blur-xl p-6 shadow-lg border border-gray-200">

            <h2 className="text-lg font-semibold text-gray-900">
              AI Insights
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Quick insights to help you stay on top of your inbox.
            </p>

            <div className="mt-6 space-y-4">

              <div className="rounded-xl bg-gray-50 p-4 hover:shadow-md transition">
                <p className="text-sm font-semibold text-gray-800">
                  Top sender
                </p>
                <p className="text-sm text-gray-600">
                  Project updates from pm@company.com
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-4 hover:shadow-md transition">
                <p className="text-sm font-semibold text-gray-800">
                  Follow ups
                </p>
                <p className="text-sm text-gray-600">
                  3 threads need a reply this week
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-4 hover:shadow-md transition">
                <p className="text-sm font-semibold text-gray-800">
                  Focus time
                </p>
                <p className="text-sm text-gray-600">
                  You have 2 uninterrupted hours today
                </p>
              </div>

            </div>
          </div>

        </aside>

      </div>
    </DashboardLayout>
  );
};

export default Dashboard;