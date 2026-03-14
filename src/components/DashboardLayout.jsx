import React from "react";
import Sidebar from "./Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex">
      <Sidebar />

      <div
        className="flex flex-col min-h-screen w-full transition-all duration-300"
        style={{ marginLeft: "var(--sidebar-width, 16rem)" }}
      >
        <div className="flex-1 overflow-y-auto">{children}</div>

        <footer className="border-t bg-gray-50 border-gray-200 px-6 py-4 text-sm text-gray-500">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>Smart Inbox © 2026</div>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-gray-700">
                Privacy
              </a>
              <a href="#" className="hover:text-gray-700">
                Terms
              </a>
              <a href="#" className="hover:text-gray-700">
                Support
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
