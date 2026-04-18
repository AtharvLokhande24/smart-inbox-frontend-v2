import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { HiOutlineMail } from "react-icons/hi";
import DashboardLayout from "../components/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import useDarkMode from "../hooks/useDarkMode";
import { startOAuthLogin } from "../services/oauth";
import api from "../services/api";

function getDisplayName(userData = {}) {
  const accounts = Array.isArray(userData.accounts) ? userData.accounts : [];
  const primaryAccount = accounts.find((account) => account?.is_primary) || accounts[0] || null;
  const accountName = primaryAccount?.display_name || primaryAccount?.email?.split("@")[0] || null;
  const rawName = String(userData.name || "").trim();

  if (rawName && rawName.toLowerCase() !== "user") {
    return rawName;
  }

  return accountName || rawName || "User";
}

function SettingsPage() {
  const navigate = useNavigate(); 
  const [searchParams] = useSearchParams();
  const { user, gmailConnected, outlookConnected } = useAuth();
  const storedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  })();

  const activeUser = user || storedUser;

  const userName = getDisplayName(activeUser);
  const userInitial = userName.charAt(0).toUpperCase();

  const [darkMode, setDarkMode] = useDarkMode();
  const [connectingProvider, setConnectingProvider] = useState("");
  const [disconnectingAccountId, setDisconnectingAccountId] = useState("");
  const [connectionError, setConnectionError] = useState(searchParams.get("oauthError") || "");
  const [profileAccounts, setProfileAccounts] = useState([]);
  const connectedAccounts = profileAccounts.length > 0
    ? profileAccounts
    : (Array.isArray(activeUser?.accounts) ? activeUser.accounts : []);
  const gmailAccounts = connectedAccounts.filter((account) => String(account.provider || "").toLowerCase() === "gmail");
  const outlookAccounts = connectedAccounts.filter((account) => String(account.provider || "").toLowerCase() === "outlook");
  const gmailIsConnected = gmailAccounts.length > 0;
  const outlookIsConnected = outlookAccounts.length > 0;

  function getProviderLabel(provider) {
    const normalized = String(provider || "").trim().toLowerCase();
    if (normalized === "gmail") return "Gmail";
    if (normalized === "outlook") return "Outlook";
    if (normalized === "local") return "Password";
    return normalized ? normalized[0].toUpperCase() + normalized.slice(1) : "Account";
  }

  async function startProviderConnect(provider) {
    try {
      setConnectionError("");
      setConnectingProvider(provider);
      const oauthError = await startOAuthLogin(provider);

      if (oauthError) {
        throw new Error(oauthError);
      }
    } catch (err) {
      setConnectionError(err.response?.data?.error || err.message || "Failed to start account connection.");
      setConnectingProvider("");
    }
  }

  async function handleDisconnectAccount(account) {
    if (!user?.id || !account?.id) return;

    const confirmDisconnect = window.confirm(
      `Disconnect ${account.email || account.display_name || account.provider}? This will remove its synced emails too.`
    );
    if (!confirmDisconnect) return;

    try {
      setConnectionError("");
      setDisconnectingAccountId(account.id);

      const res = await api.post(`/users/${user.id}/accounts/${account.id}/disconnect`);
      const updatedProfile = res.data?.data;
      const updatedAccounts = Array.isArray(updatedProfile?.accounts) ? updatedProfile.accounts : [];

      setProfileAccounts(updatedAccounts);

      const currentUser = JSON.parse(localStorage.getItem("user") || "null");
      if (currentUser?.id) {
        localStorage.setItem("user", JSON.stringify({
          ...currentUser,
          accounts: updatedAccounts,
          email: updatedProfile?.email || currentUser.email,
          name: updatedProfile?.name || currentUser.name
        }));
        window.location.reload();
      }
    } catch (err) {
      setConnectionError(err.response?.data?.error || err.message || "Failed to disconnect account.");
    } finally {
      setDisconnectingAccountId("");
    }
  }

  useEffect(() => {
    async function loadLatestAccounts() {
      if (!activeUser?.id) {
        setProfileAccounts([]);
        return;
      }

      try {
        const res = await api.get(`/users/${activeUser.id}`);
        const accounts = res.data?.data?.accounts;
        setProfileAccounts(Array.isArray(accounts) ? accounts : []);
      } catch {
        setProfileAccounts(Array.isArray(activeUser?.accounts) ? activeUser.accounts : []);
      }
    }

    loadLatestAccounts();
  }, [activeUser?.id, activeUser?.accounts]);

  const anyConnected = gmailIsConnected || outlookIsConnected;
  
  return (
    <DashboardLayout title="Settings">
      <div className="grid gap-6 lg:grid-cols-[minmax(320px,1fr)_minmax(0,2fr)]">
        {/* Profile */}
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-indigo-600 text-white flex items-center justify-center text-2xl font-semibold">
              {userInitial}
            </div>
            <div>
              <p className="text-lg font-semibold text-slate-900">{userName}</p>
              <p className="text-sm text-slate-500">Profile</p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <p className="text-sm text-slate-600">
              Update your profile information and manage account security from here.
            </p>
            <button
              onClick={() => navigate("/profile")}
              className="w-full rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100 transition"
            >
              Edit Profile
            </button>

            <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
              <div>
                <p className="text-sm font-semibold text-slate-900">Dark mode</p>
                <p className="text-xs text-slate-500">Switch to a dark theme for the UI.</p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={darkMode}
                  onChange={(e) => setDarkMode(e.target.checked)}
                />
                <span className="h-6 w-11 rounded-full bg-slate-200 peer-checked:bg-indigo-600 transition" />
                <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
              </label>
            </div>
          </div>
        </section>

        {/* Integrations */}
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Integrations</h2>
              <p className="mt-1 text-sm text-slate-500">
                Manage connected accounts and integrations.
              </p>
            </div>

            <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
              anyConnected
                ? "bg-emerald-50 text-emerald-700"
                : "bg-amber-50 text-amber-700"
            }`}>
              <span className={`h-2 w-2 rounded-full ${anyConnected ? "bg-emerald-600" : "bg-amber-500"}`} />
              {anyConnected ? "Connected" : "Not Connected"}
            </span>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Connect New Mail
              </h3>
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white">
                  <HiOutlineMail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Gmail</p>
                  <p className="text-xs text-slate-500">{gmailIsConnected ? "Connected" : "Not connected"}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => startProviderConnect("gmail")}
                disabled={connectingProvider === "gmail"}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition disabled:cursor-not-allowed disabled:opacity-70"
              >
                {connectingProvider === "gmail" ? "Connecting..." : (gmailIsConnected ? "Reconnect" : "Connect")}
              </button>
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white">
                  <HiOutlineMail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Outlook</p>
                  <p className="text-xs text-slate-500">{outlookIsConnected ? "Connected" : "Not connected"}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => startProviderConnect("outlook")}
                disabled={connectingProvider === "outlook"}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition disabled:cursor-not-allowed disabled:opacity-70"
              >
                {connectingProvider === "outlook" ? "Connecting..." : (outlookIsConnected ? "Reconnect" : "Connect")}
              </button>
            </div>

            {connectionError ? (
              <p className="text-xs text-red-600">{connectionError}</p>
            ) : null}

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">Connected emails</p>
              {connectedAccounts.length === 0 ? (
                <p className="mt-2 text-xs text-slate-500">No connected email accounts yet.</p>
              ) : (
                <div className="mt-3 space-y-2">
                  {connectedAccounts.map((account) => (
                    <div
                      key={account.id}
                      className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2"
                    >
                      <div>
                        <p className="text-sm font-medium text-slate-900">{account.email || "No email available"}</p>
                        <p className="text-xs text-slate-500">{getProviderLabel(account.provider)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {account.is_primary ? (
                          <span className="rounded-full bg-indigo-50 px-2 py-1 text-[10px] font-semibold text-indigo-700">Primary</span>
                        ) : null}
                        {String(account.provider || "").toLowerCase() !== "local" ? (
                          <button
                            type="button"
                            onClick={() => handleDisconnectAccount(account)}
                            disabled={disconnectingAccountId === account.id}
                            className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-[11px] font-semibold text-red-700 hover:bg-red-100 transition disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {disconnectingAccountId === account.id ? "Removing..." : "Disconnect"}
                          </button>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <p className="mt-4 text-xs text-slate-500">Use the disconnect button on each mail above to remove it individually.</p>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}

export default SettingsPage;
