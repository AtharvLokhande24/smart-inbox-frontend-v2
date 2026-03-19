import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineMail } from "react-icons/hi";
import DashboardLayout from "../components/DashboardLayout";

function SettingsPage() {
  const navigate = useNavigate(); // ✅ ADD THIS

  const [autoPrioritization, setAutoPrioritization] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  return (
    <DashboardLayout title="Settings">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile */}
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-indigo-600 text-white flex items-center justify-center text-2xl font-semibold">
              A
            </div>
            <div>
              <p className="text-lg font-semibold text-slate-900">Atharv Singh</p>
              <p className="text-sm text-slate-500">atharv@example.com</p>
              <p className="text-xs text-slate-400">Product Manager</p>
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

            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-600" />
              Connected
            </span>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white">
                  <HiOutlineMail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Gmail</p>
                  <p className="text-xs text-slate-500">Connected</p>
                </div>
              </div>
              <button className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">
                Reconnect
              </button>
            </div>
          </div>
        </section>

        {/* Preferences */}
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Preferences</h2>
              <p className="mt-1 text-sm text-slate-500">
                Control how Smart Inbox works for you.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
              <div>
                <p className="text-sm font-semibold text-slate-900">Email notifications</p>
                <p className="text-xs text-slate-500">
                  Receive a summary of priority messages by email.
                </p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                />
                <span className="h-6 w-11 rounded-full bg-slate-200 peer-checked:bg-indigo-600 transition" />
                <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
              </label>
            </div>

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
      </div>
    </DashboardLayout>
  );
}

export default SettingsPage;
