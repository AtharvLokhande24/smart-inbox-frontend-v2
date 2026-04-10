import React, { useMemo, useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import EmailCard from "../components/EmailCard";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { startOAuthLogin } from "../services/oauth";

const RECENT_DAYS = 14;
const RECENT_LIMIT = 25;

function getOutlookPollIntervalMs() {
  const configured = Number(import.meta.env.VITE_OUTLOOK_POLL_MS);
  if (!Number.isFinite(configured)) {
    return 60 * 1000;
  }

  // Keep interval in a safe range: 15s to 10m.
  return Math.min(Math.max(Math.floor(configured), 15 * 1000), 10 * 60 * 1000);
}

const OUTLOOK_POLL_INTERVAL_MS = getOutlookPollIntervalMs();

function isOutlookLink(link) {
  const value = String(link || "").toLowerCase();
  return value.includes("outlook.office.com") || value.includes("outlook.live.com");
}

function isOutlookEmail(email) {
  if (String(email?.provider || "").toLowerCase() === "outlook") {
    return true;
  }

  return isOutlookLink(email?.mail_link);
}

function OutlookPage() {
  const { user, outlookConnected } = useAuth();
  const [searchParams] = useSearchParams();
  const [emails, setEmails] = useState([]);
  const [allEmails, setAllEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const [filter, setFilter] = useState("All");
  const eventSourceRef = useRef(null);

  const fetchOutlook = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    try {
      // Best-effort sync: if provider fetch fails, still show DB-prioritized emails.
      if (outlookConnected) {
        try {
          await api.get(`/outlook/fetch/${user.id}`);
        } catch (syncError) {
          console.error("Outlook sync failed, showing cached prioritized emails", syncError);
        }
      }

      const res = await api.get(`/priority/user/${user.id}/emails`, {
        params: {
          days: RECENT_DAYS,
          limit: RECENT_LIMIT,
          unreadOnly: false,
          provider: "outlook"
        }
      });
      const mappedEmails = (res.data.emails || [])
        .filter((e) => isOutlookEmail(e))
        .map((e) => {
          let uiPriority = "Low";
          if (e.priority) {
            if (e.priority.label === "URGENT" || e.priority.label === "IMPORTANT") uiPriority = "High";
            else if (e.priority.label === "NORMAL") uiPriority = "Medium";
          }

          return {
            id: e.id,
            subject: e.subject || "(No Subject)",
            sender: e.sender_email || "Unknown",
            preview: e.snippet || "",
            priority: uiPriority,
            date: e.received_at ? new Date(e.received_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "",
            messageLink: e.mail_link || "",
          };
        });
      setAllEmails(mappedEmails);
      setEmails(mappedEmails);
    } catch (error) {
      console.error("Failed to fetch outlook", error);
    } finally {
      setLoading(false);
    }
  }, [user, outlookConnected]);

  const runSearch = useCallback(async (queryText) => {
    if (!user) return;

    const query = String(queryText || "").trim();
    if (!query) {
      await fetchOutlook();
      return;
    }

    setLoading(true);
    try {
      const res = await api.get(`/priority/user/${user.id}/search`, {
        params: {
          q: query,
          days: RECENT_DAYS,
          limit: RECENT_LIMIT,
          unreadOnly: false,
          provider: "outlook"
        },
      });

      const mappedEmails = (res.data.emails || [])
        .filter((e) => isOutlookEmail(e))
        .map((e) => {
          let uiPriority = "Low";
          if (e.priority) {
            if (e.priority.label === "URGENT" || e.priority.label === "IMPORTANT") uiPriority = "High";
            else if (e.priority.label === "NORMAL") uiPriority = "Medium";
          }

          return {
            id: e.id,
            subject: e.subject || "(No Subject)",
            sender: e.sender_email || "Unknown",
            preview: e.snippet || "",
            priority: uiPriority,
            date: e.received_at ? new Date(e.received_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "",
            messageLink: e.mail_link || "",
          };
        });

      setEmails(mappedEmails);
    } catch (error) {
      console.error("Failed to search emails", error);

      const fallback = allEmails.filter((email) => {
        const haystack = `${email.subject || ""} ${email.sender || ""} ${email.preview || ""}`.toLowerCase();
        return haystack.includes(query.toLowerCase());
      });

      setEmails(fallback);
      const apiMessage = error.response?.data?.error || error.message || "Search failed";
      setToast(`Search route failed, showing local results. ${apiMessage}`);
      setTimeout(() => setToast(null), 3000);
    } finally {
      setLoading(false);
    }
  }, [user, fetchOutlook, allEmails]);

  useEffect(() => {
    const headerQuery = searchParams.get("q") || "";
    if (headerQuery.trim()) {
      runSearch(headerQuery);
      return;
    }

    fetchOutlook();
  }, [fetchOutlook, runSearch, searchParams]);

  useEffect(() => {
    if (!user || !outlookConnected) {
      return;
    }

    let inFlight = false;

    const pollOutlook = async () => {
      if (document.hidden || inFlight) {
        return;
      }

      inFlight = true;
      try {
        await fetchOutlook();
      } finally {
        inFlight = false;
      }
    };

    const intervalId = window.setInterval(pollOutlook, OUTLOOK_POLL_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [user, outlookConnected, fetchOutlook]);

  useEffect(() => {
    if (!user || !outlookConnected) return;

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const streamUrl = `${api.defaults.baseURL}/gmail/stream/${user.id}`;
    const source = new EventSource(streamUrl, { withCredentials: true });
    eventSourceRef.current = source;

    source.addEventListener("new_emails", async (event) => {
      try {
        const payload = JSON.parse(event.data || "{}");
        const count = Number(payload.count || 0);
        if (count > 0) {
          setToast(`${count} new email${count > 1 ? "s" : ""} received`);
          setTimeout(() => setToast(null), 3500);
        }
      } catch (error) {
        console.error("Failed to parse stream event", error);
      }

      await fetchOutlook();
    });

    source.onerror = () => {
      setToast("Live sync disconnected, retrying...");
      setTimeout(() => setToast(null), 2500);
      source.close();
    };

    return () => {
      source.close();
    };
  }, [user, outlookConnected, fetchOutlook]);

  const filteredEmails = useMemo(() => {
    if (filter === "All") return emails;
    return emails.filter((email) => email.priority === filter);
  }, [filter, emails]);

  const handleReply = (messageLink) => {
    if (!messageLink) {
      setToast("Outlook link not available for this email");
      setTimeout(() => setToast(null), 3000);
      return;
    }

    window.open(messageLink, "_blank", "noopener,noreferrer");
  };

  return (
    <DashboardLayout title="Outlook">
      <section className="grid gap-6 lg:grid-cols-3">
        <div className="col-span-2 space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Outlook status</h2>
                <p className="mt-1 text-sm text-slate-500">{outlookConnected ? `Connected • Last ${RECENT_DAYS} days • Live updates` : "Outlook not connected"}</p>
              </div>
              <div className="flex items-center gap-2">
                {outlookConnected ? (
                  <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    <span className="h-2 w-2 rounded-full bg-emerald-600" />
                    Connected
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                    Not Connected
                  </span>
                )}
              </div>
            </div>
          </div>

          {toast && (
            <div className="px-4 py-2 rounded-xl text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-between animate-pulse">
              <span>{toast}</span>
              <button onClick={() => setToast(null)} className="ml-3 text-current opacity-50 hover:opacity-100 cursor-pointer">x</button>
            </div>
          )}

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Email list</h2>
                <p className="mt-1 text-sm text-slate-500">Filter what you see in your inbox. Use top search bar to search.</p>
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
              {loading ? (
                <p className="text-gray-500 text-sm">Loading emails...</p>
              ) : !outlookConnected && filteredEmails.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-2xl shadow-sm border border-gray-100">
                  <div className="bg-indigo-50 text-indigo-600 p-3 rounded-full mb-3">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Connect Your Outlook</h3>
                  <p className="text-sm text-gray-500 max-w-sm mb-5">To view your emails here, please authorize access to your Outlook account.</p>
                  <button
                    onClick={async () => {
                      const oauthError = await startOAuthLogin("outlook");
                      if (oauthError) {
                        console.error("Failed to load Outlook login URL", oauthError);
                        setToast(oauthError);
                        setTimeout(() => setToast(null), 3500);
                      }
                    }}
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors border border-transparent"
                  >
                    Connect Outlook
                  </button>
                </div>
              ) : filteredEmails.map((email) => (
                <div key={email.id}>
                  <EmailCard
                    subject={email.subject}
                    sender={email.sender}
                    preview={email.preview}
                    priority={email.priority}
                    date={email.date}
                    app="Outlook"
                    onReply={() => handleReply(email.messageLink)}
                  />
                </div>
              ))}
              {!loading && filteredEmails.length === 0 ? (
                <p className="text-sm text-slate-500">No messages match this filter.</p>
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
                Reconnect Outlook if you notice missing messages.
              </li>
            </ul>
          </div>
        </aside>
      </section>
    </DashboardLayout>
  );
}

export default OutlookPage;
