import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "../services/api";
import {
  HiOutlineBell,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
  HiOutlineInformationCircle,
  HiOutlineMail,
  HiOutlineTrash,
} from "react-icons/hi";

function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadNotifications() {
      if (!user?.id) {
        if (isMounted) {
          setNotifications([]);
          setLoading(false);
        }
        return;
      }

      try {
        if (isMounted) {
          setLoading(true);
        }
        const res = await getNotifications();
        if (isMounted) {
          setNotifications(Array.isArray(res.data?.notifications) ? res.data.notifications : []);
        }
      } catch {
        if (isMounted) {
          setNotifications([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadNotifications();

    const refreshTimer = setInterval(loadNotifications, 15000);

    return () => {
      isMounted = false;
      clearInterval(refreshTimer);
    };
  }, [user?.id]);

  const getIcon = (type) => {
    switch (type) {
      case "mail_sync":
        return <HiOutlineMail className="text-sky-600 text-2xl" />;
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
    markNotificationAsRead(id)
      .then(() => {
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id === id ? { ...notif, read: true } : notif
          )
        );
      })
      .catch(() => {});
  };

  const handleDelete = (id) => {
    deleteNotification(id)
      .then(() => {
        setNotifications((prev) => prev.filter((notif) => notif.id !== id));
      })
      .catch(() => {});
  };

  const handleMarkAllAsRead = () => {
    markAllNotificationsAsRead()
      .then(() => {
        setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
      })
      .catch(() => {});
  };

  const formatTimestamp = (value) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleString();
  };

  const renderMessage = (notification) => {
    const message = String(notification?.message || "");
    if (notification?.type !== "mail_sync") {
      return <p className="mt-2 text-sm text-current">{message}</p>;
    }

    const parts = message
      .split(". ")
      .map((part) => part.trim())
      .filter(Boolean);

    if (parts.length === 0) {
      return <p className="mt-2 text-sm text-current">{message}</p>;
    }

    return (
      <div className="mt-2 space-y-1">
        {parts.map((part, idx) => (
          <p key={`${notification.id}-${idx}`} className="text-sm text-current">
            {part}
          </p>
        ))}
      </div>
    );
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
            <button
              onClick={handleMarkAllAsRead}
              className="px-4 py-2 rounded-lg bg-indigo-50 text-indigo-600 text-sm font-semibold hover:bg-indigo-100 transition"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {notifications.length === 0 ? (
            <div className="rounded-2xl bg-white p-12 shadow-sm text-center">
              <HiOutlineBell className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600 font-medium">
                {loading ? "Loading notifications..." : "No notifications yet"}
              </p>
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
                        <div
                          className={`mt-2 ${
                            notification.read
                              ? "text-slate-600"
                              : "text-indigo-800"
                          }`}
                        >
                          {renderMessage(notification)}
                        </div>
                        <p className="mt-3 text-xs text-slate-500">
                          {formatTimestamp(notification.createdAt || notification.created_at)}
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
