import React, { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import {
  HiOutlineBell,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
  HiOutlineInformationCircle,
  HiOutlineTrash,
} from "react-icons/hi";

function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "success",
      title: "Profile Updated",
      message: "Your profile information has been updated successfully.",
      timestamp: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      type: "info",
      title: "New Email Integrated",
      message: "Your Gmail account has been successfully integrated with Smart Inbox.",
      timestamp: "1 day ago",
      read: false,
    },
    {
      id: 3,
      type: "warning",
      title: "Email Overload Alert",
      message: "You have 50+ unread important emails. Check your inbox!",
      timestamp: "2 days ago",
      read: true,
    },
    {
      id: 4,
      type: "info",
      title: "Weekly Summary Ready",
      message: "Your weekly email summary is ready for review.",
      timestamp: "3 days ago",
      read: true,
    },
    {
      id: 5,
      type: "success",
      title: "Settings Saved",
      message: "Your preference settings have been saved successfully.",
      timestamp: "1 week ago",
      read: true,
    },
    {
      id: 6,
      type: "info",
      title: "New Feature Available",
      message: "Smart Inbox now supports email templates. Try it out!",
      timestamp: "1 week ago",
      read: true,
    },
  ]);

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <HiOutlineCheckCircle className="text-emerald-500 text-2xl" />;
      case "warning":
        return <HiOutlineExclamationCircle className="text-yellow-500 text-2xl" />;
      case "info":
        return <HiOutlineInformationCircle className="text-blue-500 text-2xl" />;
      default:
        return <HiOutlineBell className="text-indigo-500 text-2xl" />;
    }
  };

  const handleMarkAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const handleDelete = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <DashboardLayout title="Notifications">
      <div className="max-w-4xl mx-auto">
        {/* Header with Mark All as Read */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Notifications
            </h2>
            {unreadCount > 0 && (
              <p className="text-sm text-slate-500 mt-1">
                You have <span className="font-semibold">{unreadCount}</span> unread notifications
              </p>
            )}
          </div>
          {unreadCount > 0 && (
            <button className="px-4 py-2 rounded-lg bg-indigo-50 text-indigo-600 text-sm font-semibold hover:bg-indigo-100 transition">
              Mark all as read
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {notifications.length === 0 ? (
            <div className="rounded-2xl bg-white p-12 shadow-sm text-center">
              <HiOutlineBell className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600 font-medium">No notifications yet</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`rounded-2xl p-6 shadow-sm transition ${
                  notification.read
                    ? "bg-white border border-slate-200"
                    : "bg-indigo-50 border border-indigo-200"
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-1">
                    {getIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3
                          className={`text-lg font-semibold ${
                            notification.read
                              ? "text-slate-900"
                              : "text-indigo-900"
                          }`}
                        >
                          {notification.title}
                        </h3>
                        <p
                          className={`mt-2 text-sm ${
                            notification.read
                              ? "text-slate-600"
                              : "text-indigo-800"
                          }`}
                        >
                          {notification.message}
                        </p>
                        <p className="mt-3 text-xs text-slate-500">
                          {notification.timestamp}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {!notification.read && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition"
                          >
                            Mark as read
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notification.id)}
                          className="p-2 rounded-lg hover:bg-red-50 text-gray-600 hover:text-red-600 transition"
                          aria-label="Delete notification"
                        >
                          <HiOutlineTrash className="text-lg" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default NotificationsPage;
