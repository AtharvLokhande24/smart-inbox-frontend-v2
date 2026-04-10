import React from "react";

export default function Footer() {
  return (
    <footer className="border-t bg-gray-50 dark:bg-slate-950 border-gray-200 dark:border-slate-800 px-6 py-4 text-sm text-gray-500 dark:text-slate-400">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>Smart Inbox © 2026</div>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-gray-700 dark:hover:text-slate-200">
            Privacy
          </a>
          <a href="#" className="hover:text-gray-700 dark:hover:text-slate-200">
            Terms
          </a>
          <a href="#" className="hover:text-gray-700 dark:hover:text-slate-200">
            Support
          </a>
        </div>
      </div>
    </footer>
  );
}
