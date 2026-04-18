import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineSearch } from "react-icons/hi";
import { useAuth } from "../context/AuthContext";

export default function Header({ title }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const storedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  })();

  const userName = user?.name || storedUser?.name || "User";
  const userInitial = userName.charAt(0).toUpperCase();

  const subtitle = {
    Dashboard: "Your AI-prioritized inbox — focus on what matters most.",
    Gmail: "Your Gmail inbox prioritized by AI.",
    Outlook: "Your Outlook inbox prioritized by AI.",
    Settings: "Manage account settings and integrations.",
    "Edit Profile": "Update your personal and professional information.",
    Notifications: "Stay updated with all your notifications.",
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const query = searchTerm.trim();

    if (!query) {
      navigate("/gmail");
      return;
    }

    navigate(`/gmail?q=${encodeURIComponent(query)}`);
  };

  return (
    <header className="flex items-center justify-between border-b border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-6 py-4">

      {/* LEFT */}
      <div className="flex flex-col">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-slate-100">
          {title}
        </h1>
        <p className="text-sm text-gray-500 dark:text-slate-400">
          {subtitle[title] || ""}
        </p>
      </div>

      {/* CENTER SEARCH */}
      <div className="flex flex-1 justify-center px-6">
        <form
          onSubmit={handleSearchSubmit}
          className="w-full max-w-md flex items-center bg-gray-100 dark:bg-slate-800 rounded-lg px-3 py-2 hover:bg-gray-200 dark:hover:bg-slate-700 transition"
        >
          <button type="submit" className="text-gray-500 dark:text-slate-400 text-lg" aria-label="Search emails">
            <HiOutlineSearch className="text-gray-500 dark:text-slate-400 text-lg" />
          </button>
          <input
            type="text"
            placeholder="Search emails, senders, or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="ml-3 w-full bg-transparent outline-none text-sm text-gray-700 dark:text-slate-200"
          />
        </form>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">

        {/* PROFILE */}
        <button
          onClick={() => navigate("/profile")}
          className="flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-slate-800 px-3 py-2 rounded-lg transition"
        >
          <div className="text-right">
            <p className="text-sm font-medium text-gray-800 dark:text-slate-100">{userName}</p>
          </div>

          <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-sm font-semibold text-white">
            {userInitial}
          </div>
        </button>

      </div>
    </header>
  );
}