import React, { useState, useEffect, useCallback, useRef } from "react";
import DashboardLayout from "../components/DashboardLayout";
import EmailCard from "../components/EmailCard";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const RECENT_DAYS = 2;
const RECENT_LIMIT = 25;

const Dashboard = () => {
  const { user, gmailConnected } = useAuth();
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const eventSourceRef = useRef(null);

  // Fetch prioritized emails from DB
  const fetchEmails = useCallback(async () => {
    if (!user || !gmailConnected) {
      setLoading(false);
      return;
    }
    try {
      const res = await api.get(`/priority/user/${user.id}/emails`, {
        params: { days: RECENT_DAYS, limit: RECENT_LIMIT }
      });
      const mappedEmails = (res.data.emails || []).map((e) => {
        let uiPriority = "Low";
        if (e.priority) {
          if (e.priority.label === "URGENT" || e.priority.label === "IMPORTANT") uiPriority = "High";
          else if (e.priority.label === "NORMAL") uiPriority = "Medium";
        }

        return {
          id: e.id,
          subject: e.subject || "(No Subject)",
          sender: e.sender_email || "Unknown",
          app: "Gmail",
          preview: e.snippet || "",
          priority: uiPriority,
          gmailLink: e.gmail_link || "",
        };
      });
      setEmails(mappedEmails);
    } catch (error) {
      console.error("Failed to fetch priority emails", error);
    } finally {
      setLoading(false);
    }
  }, [user, gmailConnected]);

  // Initial load
  useEffect(() => {
    fetchEmails();
  }, [fetchEmails]);

  // Live updates from backend SSE stream + Pub/Sub watch notifications.
  useEffect(() => {
    if (!user || !gmailConnected) return;

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const streamUrl = `${api.defaults.baseURL}/gmail/stream/${user.id}`;
    const source = new EventSource(streamUrl, { withCredentials: true });
    eventSourceRef.current = source;

    source.addEventListener("connected", () => {
      setToast("Live sync connected");
      setTimeout(() => setToast(null), 1800);
    });

    source.addEventListener("new_emails", async (event) => {
      try {
        const payload = JSON.parse(event.data || "{}");
        const count = Number(payload.count || 0);
        if (count > 0) {
          setToast(`${count} new email${count > 1 ? "s" : ""} received`);
          setTimeout(() => setToast(null), 3500);
        }
      } catch {
        // Ignore parse failures; still refresh data.
      }

      await fetchEmails();
    });

    source.onerror = () => {
      setToast("Live sync unstable, reconnecting...");
      setTimeout(() => setToast(null), 2500);
    };

    return () => {
      source.close();
    };
  }, [user, gmailConnected, fetchEmails]);

  const handleReply = (gmailLink) => {
    if (!gmailLink) {
      setToast("Gmail link not available for this email");
      setTimeout(() => setToast(null), 3000);
      return;
    }

    window.open(gmailLink, "_blank", "noopener,noreferrer");
  };

  return (
    <DashboardLayout title="Dashboard">
      <div className="h-full grid grid-cols-1 lg:grid-cols-12 gap-6 px-2">
        <section className="lg:col-span-8 flex flex-col overflow-hidden rounded-3xl bg-white/70 backdrop-blur-xl shadow-lg border border-gray-200">
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-white to-gray-50/50">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 tracking-tight">Smart Inbox</h2>
              <p className="text-xs text-gray-500 mt-1">Top {RECENT_LIMIT} emails from last {RECENT_DAYS} days • Live updates via Gmail watch</p>
            </div>
            <div className="flex items-center gap-3">
              {gmailConnected ? (
                <div className="flex items-center gap-2 bg-green-50 text-green-600 px-4 py-1.5 rounded-full text-xs font-medium shadow-sm">
                  <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                  Connected
                </div>
              ) : (
                <div className="flex items-center gap-2 bg-amber-50 text-amber-600 px-4 py-1.5 rounded-full text-xs font-medium shadow-sm">
                  <span className="h-2 w-2 bg-amber-500 rounded-full"></span>
                  Not Connected
                </div>
              )}
            </div>
          </div>

          {/* Toast notification */}
          {toast && (
            <div className="mx-6 mt-3 px-4 py-2 rounded-xl text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-between animate-pulse">
              <span>{toast}</span>
              <button onClick={() => setToast(null)} className="ml-3 text-current opacity-50 hover:opacity-100 cursor-pointer">✕</button>
            </div>
          )}

          {gmailConnected && (
            <div >
             
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {loading ? (
              <p className="text-gray-500 text-sm">Loading emails...</p>
            ) : !gmailConnected ? (
              <div className="flex flex-col items-center justify-center p-12 text-center h-full">
                <div className="bg-indigo-50 text-indigo-600 p-4 rounded-full mb-4">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Connect Your Gmail</h3>
                <p className="text-sm text-gray-500 max-w-sm mb-6">
                  To use the Smart Inbox and gather insights, please authorize access to your Google account.
                </p>
                <button 
                  onClick={async () => {
                    try {
                      const res = await api.get("/gmail/login");
                      window.location.href = res.data.loginUrl;
                    } catch (err) {
                      console.error("Failed to load login URL", err);
                    }
                  }}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-md cursor-pointer transition-transform active:scale-95"
                >
                  Connect Gmail
                </button>
              </div>
            ) : emails.length === 0 ? (
              <p className="text-gray-500 text-sm">No emails found or priority analysis is still pending.</p>
            ) : (
              emails.map((email) => (
                <div key={email.id} className="group">
                  <div className="transition-all duration-300 hover:scale-[1.01] hover:shadow-md rounded-xl">
                    <EmailCard
                      subject={email.subject}
                      sender={email.sender}
                      preview={email.preview}
                      priority={email.priority}
                      app={email.app}
                      onReply={() => handleReply(email.gmailLink)}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <aside className="lg:col-span-4 flex flex-col gap-6">
          <div className="rounded-3xl bg-white/70 backdrop-blur-xl p-6 shadow-lg border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">AI Insights</h2>
            <p className="mt-1 text-sm text-gray-500">Quick insights to help you stay on top of your inbox.</p>
            <div className="mt-6 space-y-4">
              <div className="rounded-xl bg-gray-50 p-4 hover:shadow-md transition">
                <p className="text-sm font-semibold text-gray-800">Top sender</p>
                <p className="text-sm text-gray-600">
                  {emails.length > 0 ? `Frequent updates from ${emails[0].sender}` : "Awaiting data..."}
                </p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4 hover:shadow-md transition">
                <p className="text-sm font-semibold text-gray-800">Follow ups</p>
                <p className="text-sm text-gray-600">
                  {emails.filter(e => e.priority === "High").length} high priority messages pending
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