import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import EmailCard from "../components/EmailCard";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { startOAuthLogin } from "../services/oauth";

const RECENT_DAYS = 14;
const PAGE_SIZE = 8;

const Dashboard = () => {
  const { user, gmailConnected, outlookConnected, login } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [toast, setToast] = useState(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const eventSourceRef = useRef(null);
  const hasAnyConnectedInbox = gmailConnected || outlookConnected;

  useEffect(() => {
    async function bootstrapFromOAuthQuery() {
      const userId = searchParams.get("userId");
      const provider = searchParams.get("provider");
      const oauth = searchParams.get("oauth");

      if (!userId || oauth !== "success" || user) {
        return;
      }

      try {
        const res = await api.get(`/users/${userId}`);
        const userFromApi = res.data?.data;

        if (!userFromApi?.id) {
          throw new Error("Invalid user received after OAuth");
        }

        login({
          ...userFromApi,
          gmailConnected: Boolean(userFromApi.gmailConnected),
          outlookConnected: Boolean(userFromApi.outlookConnected)
        });

        navigate("/dashboard", { replace: true });
      } catch (error) {
        console.error("Failed to bootstrap dashboard auth from OAuth callback", error);
      }
    }

    bootstrapFromOAuthQuery();
  }, [login, navigate, searchParams, user]);

  // Fetch prioritized emails from combined endpoint with pagination
  const fetchEmails = useCallback(async (pageOffset = 0, isLoadMore = false) => {
    if (!user) {
      setLoading(false);
      return;
    }
    try {
      if (!isLoadMore) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      // Keep provider fetch event-driven (SSE/PubSub), avoid periodic Gmail polling.
      if (outlookConnected) {
        api.get(`/outlook/fetch/${user.id}`).catch(() => {});
      }

      // Fetch combined emails with pagination
      const res = await api.get(`/priority/user/${user.id}/combined`, {
        params: {
          offset: pageOffset,
          limit: PAGE_SIZE,
          days: RECENT_DAYS
        }
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
          app: String(e.provider || "gmail").toLowerCase() === "outlook" ? "Outlook" : "Gmail",
          preview: e.snippet || "",
          priority: uiPriority,
          mailLink: e.mail_link || "",
        };
      });

      if (isLoadMore) {
        setEmails((prev) => [...prev, ...mappedEmails]);
      } else {
        setEmails(mappedEmails);
      }

      // Check if there are more emails
      const totalAvailable = res.data.total || 0;
      const nextOffset = pageOffset + PAGE_SIZE;
      setHasMore(nextOffset < totalAvailable);
      setOffset(nextOffset);
    } catch (error) {
      console.error("Failed to fetch priority emails", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [user, gmailConnected, outlookConnected]);

  // Initial load
  useEffect(() => {
    fetchEmails();
  }, [fetchEmails]);

  // Live updates from backend SSE stream + Pub/Sub watch notifications.
  useEffect(() => {
    if (!user || !hasAnyConnectedInbox) return;

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

      // Reset pagination on new emails
      setOffset(0);
      setHasMore(true);
      await fetchEmails(0, false);
    });

    source.onerror = () => {
      setToast("Live sync unstable, reconnecting...");
      setTimeout(() => setToast(null), 2500);
    };

    return () => {
      source.close();
    };
  }, [user, hasAnyConnectedInbox, fetchEmails]);

  const handleReply = (messageLink) => {
    if (!messageLink) {
      setToast("Message link not available for this email");
      setTimeout(() => setToast(null), 3000);
      return;
    }

    window.open(messageLink, "_blank", "noopener,noreferrer");
  };

  return (
    <DashboardLayout title="Dashboard">
      <div className="h-full grid grid-cols-1 lg:grid-cols-12 gap-6 px-2">
        <section className="lg:col-span-8 flex flex-col overflow-hidden rounded-3xl bg-white/70 dark:bg-slate-900/80 backdrop-blur-xl shadow-lg border border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-slate-700 bg-gradient-to-r from-white to-gray-50/50 dark:from-slate-900 dark:to-slate-800/70">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100 tracking-tight">Smart Inbox</h2>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Latest {PAGE_SIZE} emails from last {RECENT_DAYS} days • Combined Gmail + Outlook inbox</p>
            </div>
            <div className="flex items-center gap-3">
              {hasAnyConnectedInbox ? (
                <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-300 px-4 py-1.5 rounded-full text-xs font-medium shadow-sm">
                  <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                  Connected
                </div>
              ) : (
                <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-300 px-4 py-1.5 rounded-full text-xs font-medium shadow-sm">
                  <span className="h-2 w-2 bg-amber-500 rounded-full"></span>
                  Not Connected
                </div>
              )}
            </div>
          </div>

          {/* Toast notification */}
          {toast && (
            <div className="mx-6 mt-3 px-4 py-2 rounded-xl text-sm font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 flex items-center justify-between animate-pulse">
              <span>{toast}</span>
              <button onClick={() => setToast(null)} className="ml-3 text-current opacity-50 hover:opacity-100 cursor-pointer">✕</button>
            </div>
          )}

          {hasAnyConnectedInbox && (
            <div >
             
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {loading ? (
              <p className="text-gray-500 dark:text-slate-400 text-sm">Loading emails...</p>
            ) : !hasAnyConnectedInbox && emails.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center h-full">
                <div className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 p-4 rounded-full mb-4">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-2">Connect Your Inbox</h3>
                <p className="text-sm text-gray-500 dark:text-slate-400 max-w-sm mb-6">
                  Connect Gmail or Outlook to use Smart Inbox and gather AI insights.
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={async () => {
                      const oauthError = await startOAuthLogin("gmail");
                      if (oauthError) {
                        console.error("Failed to load Gmail login URL", oauthError);
                        setToast(oauthError);
                        setTimeout(() => setToast(null), 3500);
                      }
                    }}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-md cursor-pointer transition-transform active:scale-95"
                  >
                    Connect Gmail
                  </button>
                  <button
                    onClick={async () => {
                      const oauthError = await startOAuthLogin("outlook");
                      if (oauthError) {
                        console.error("Failed to load Outlook login URL", oauthError);
                        setToast(oauthError);
                        setTimeout(() => setToast(null), 3500);
                      }
                    }}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-md cursor-pointer transition-transform active:scale-95"
                  >
                    Connect Outlook
                  </button>
                </div>
              </div>
            ) : emails.length === 0 ? (
              <p className="text-gray-500 dark:text-slate-400 text-sm">No emails found or priority analysis is still pending.</p>
            ) : (
              <>
                {emails.map((email) => (
                  <div key={email.id} className="group">
                    <div className="transition-all duration-300 hover:scale-[1.01] hover:shadow-md rounded-xl">
                      <EmailCard
                        subject={email.subject}
                        sender={email.sender}
                        preview={email.preview}
                        priority={email.priority}
                        app={email.app}
                        onReply={() => handleReply(email.mailLink)}
                      />
                    </div>
                  </div>
                ))}
                {hasMore && (
                  <button
                    onClick={() => fetchEmails(offset, true)}
                    disabled={loadingMore}
                    className="mt-6 w-full px-4 py-3 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 disabled:bg-gray-100 dark:disabled:bg-slate-800 text-indigo-700 dark:text-indigo-300 disabled:text-gray-500 dark:disabled:text-slate-500 font-medium rounded-xl transition-colors"
                  >
                    {loadingMore ? "Loading more..." : `Load More (${PAGE_SIZE} more)`}
                  </button>
                )}
              </>
            )}
          </div>
        </section>

        <aside className="lg:col-span-4 flex flex-col gap-6">
          <div className="rounded-3xl bg-white/70 dark:bg-slate-900/80 backdrop-blur-xl p-6 shadow-lg border border-gray-200 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100">AI Insights</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">Quick insights to help you stay on top of your inbox.</p>
            <div className="mt-6 space-y-4">
              <div className="rounded-xl bg-gray-50 dark:bg-slate-800 p-4 hover:shadow-md transition">
                <p className="text-sm font-semibold text-gray-800 dark:text-slate-200">Top sender</p>
                <p className="text-sm text-gray-600 dark:text-slate-400">
                  {emails.length > 0 ? `Frequent updates from ${emails[0].sender}` : "Awaiting data..."}
                </p>
              </div>
              <div className="rounded-xl bg-gray-50 dark:bg-slate-800 p-4 hover:shadow-md transition">
                <p className="text-sm font-semibold text-gray-800 dark:text-slate-200">Follow ups</p>
                <p className="text-sm text-gray-600 dark:text-slate-400">
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