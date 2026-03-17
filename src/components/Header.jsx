import React from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineSearch, HiOutlineBell } from "react-icons/hi";

export default function Header({ title }) {
  const navigate = useNavigate();

  const subtitle = {
    Dashboard: "Your AI-prioritized inbox — focus on what matters most.",
    Gmail: "Your Gmail inbox prioritized by AI.",
    Settings: "Manage account settings and integrations.",
    "Edit Profile": "Update your personal and professional information.",
    Notifications: "Stay updated with all your notifications.",
  };

  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
      <div className="flex flex-col">
        <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
        <p className="text-sm text-gray-500">{subtitle[title] || ""}</p>
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
          onClick={() => navigate("/notifications")}
          type="button"
          className="p-2 rounded-lg hover:bg-gray-100 transition relative group"
          aria-label="Notifications"
        >
          <HiOutlineBell className="text-gray-600 text-lg" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500" />
          <span className="absolute -bottom-8 right-0 bg-slate-800 text-white text-xs px-3 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none">
            Notifications
          </span>
        </button>

        <button
          onClick={() => navigate("/profile")}
          className="flex items-center gap-3 hover:bg-gray-50 px-3 py-2 rounded-lg transition"
        >
          <div className="text-right">
            <p className="text-sm font-medium text-gray-800">Atharv</p>
            <p className="text-xs text-gray-500">Product Manager</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-sm font-semibold text-white hover:shadow-md transition">
            A
          </div>
        </button>
      </div>
    </header>
  );
}
