import React, { useEffect, useMemo, useState } from "react";
import { HiOutlineCalendar, HiOutlineClipboardList, HiOutlinePlus } from "react-icons/hi";
import DashboardLayout from "../components/DashboardLayout";
import api from "../services/api";

function toLocalDatetimeValue(dateValue) {
  if (!dateValue) return "";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "";

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
}

function prettyDate(dateValue) {
  if (!dateValue) return "No date";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "No date";
  return date.toLocaleString();
}

function normalizeTask(item, index) {
  const due = item?.due_date || item?.dueDate || item?.time || null;
  return {
    id: item?.id || `task-${index}`,
    title: item?.title || "Untitled task",
    description: item?.description || "",
    time: due,
    provider: item?.provider || "gmail",
    status: item?.status || "CREATED"
  };
}

function normalizeEvent(item, index) {
  const start = item?.start_time || item?.startTime || item?.time || null;
  const end = item?.end_time || item?.endTime || null;
  return {
    id: item?.id || `event-${index}`,
    title: item?.title || "Untitled event",
    description: item?.description || "",
    location: item?.location || "",
    start,
    end,
    provider: item?.provider || "gmail",
    status: item?.status || "CREATED"
  };
}

export default function TasksPage() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    provider: "gmail",
    type: "task",
    title: "",
    description: "",
    dueDate: "",
    startTime: "",
    endTime: ""
  });

  async function loadAgenda() {
    try {
      setLoading(true);
      setErrorMessage("");
      const response = await api.get("/tasks");
      const incomingTasks = Array.isArray(response?.data?.tasks) ? response.data.tasks : [];
      const incomingEvents = Array.isArray(response?.data?.events) ? response.data.events : [];

      setTasks(incomingTasks.map(normalizeTask));
      setEvents(incomingEvents.map(normalizeEvent));
    } catch (error) {
      console.error("Failed to fetch tasks/events", error);
      setErrorMessage(error?.response?.data?.error || "Failed to load tasks and events.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAgenda();
  }, []);

  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      if (!a.time) return 1;
      if (!b.time) return -1;
      return new Date(a.time) - new Date(b.time);
    });
  }, [tasks]);

  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => {
      if (!a.start) return 1;
      if (!b.start) return -1;
      return new Date(a.start) - new Date(b.start);
    });
  }, [events]);

  async function handleCreate(event) {
    event.preventDefault();
    if (!formData.title.trim()) {
      setErrorMessage("Title is required.");
      return;
    }

    try {
      setSubmitting(true);
      setErrorMessage("");

      const payload = {
        provider: formData.provider,
        type: formData.type,
        title: formData.title.trim(),
        description: formData.description.trim(),
        dueDate: formData.type === "task" && formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
        startTime: formData.type === "event" && formData.startTime ? new Date(formData.startTime).toISOString() : null,
        endTime: formData.type === "event" && formData.endTime ? new Date(formData.endTime).toISOString() : null,
      };

      await api.post("/tasks", payload);
      setShowCreateModal(false);
      setFormData({
        provider: "gmail",
        type: "task",
        title: "",
        description: "",
        dueDate: "",
        startTime: "",
        endTime: ""
      });
      await loadAgenda();
    } catch (error) {
      console.error("Failed to create task/event", error);
      setErrorMessage(error?.response?.data?.error || "Failed to create item.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteItem(id, type, provider) {
    try {
      setDeletingId(String(id));
      setErrorMessage("");
      await api.delete(`/tasks/${id}`, {
        params: {
          type,
          provider
        }
      });
      await loadAgenda();
    } catch (error) {
      console.error("Failed to delete task/event", error);
      setErrorMessage(error?.response?.data?.error || "Failed to delete item.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <DashboardLayout title="Tasks">
      <section className="h-full rounded-2xl border border-gray-200 bg-white px-6 py-5 dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-start justify-between gap-4">
          <p className="text-sm text-gray-500 dark:text-slate-400">Manage your synced agenda across platforms.</p>
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-700"
          >
            <HiOutlinePlus className="text-base" />
            Add New
          </button>
        </div>

        {errorMessage ? (
          <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
            {errorMessage}
          </p>
        ) : null}

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <article>
            <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <HiOutlineCalendar className="text-lg text-indigo-600" />
              <h2 className="text-3xl font-semibold tracking-tight">Upcoming Events</h2>
            </div>
            <div className="mt-3 h-px bg-gray-200 dark:bg-slate-800" />

            {loading ? (
              <p className="mt-5 text-sm italic text-gray-500 dark:text-slate-400">Loading events...</p>
            ) : sortedEvents.length === 0 ? (
              <p className="mt-5 text-sm italic text-gray-500 dark:text-slate-400">No upcoming events scheduled.</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {sortedEvents.map((item) => (
                  <li key={item.id} className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.title}</p>
                      <button
                        type="button"
                        onClick={() => handleDeleteItem(item.id, "event", item.provider)}
                        disabled={deletingId === String(item.id)}
                        className="rounded-md border border-red-200 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-60 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-950/30"
                      >
                        {deletingId === String(item.id) ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">{prettyDate(item.start)}{item.end ? ` - ${prettyDate(item.end)}` : ""}</p>
                    {item.description ? <p className="mt-1 text-xs text-gray-600 dark:text-slate-300">{item.description}</p> : null}
                  </li>
                ))}
              </ul>
            )}
          </article>

          <article>
            <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <HiOutlineClipboardList className="text-lg text-indigo-600" />
              <h2 className="text-3xl font-semibold tracking-tight">To-Do List</h2>
            </div>
            <div className="mt-3 h-px bg-gray-200 dark:bg-slate-800" />

            {loading ? (
              <p className="mt-5 text-sm italic text-gray-500 dark:text-slate-400">Loading tasks...</p>
            ) : sortedTasks.length === 0 ? (
              <p className="mt-5 text-sm italic text-gray-500 dark:text-slate-400">No pending tasks found.</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {sortedTasks.map((item) => (
                  <li key={item.id} className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.title}</p>
                      <button
                        type="button"
                        onClick={() => handleDeleteItem(item.id, "task", item.provider)}
                        disabled={deletingId === String(item.id)}
                        className="rounded-md border border-red-200 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-60 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-950/30"
                      >
                        {deletingId === String(item.id) ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">{prettyDate(item.time)}</p>
                    {item.description ? <p className="mt-1 text-xs text-gray-600 dark:text-slate-300">{item.description}</p> : null}
                  </li>
                ))}
              </ul>
            )}
          </article>
        </div>
      </section>

      {showCreateModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4">
          <form
            onSubmit={handleCreate}
            className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl dark:border-slate-700 dark:bg-slate-900"
          >
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Create New</h3>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-1 text-sm text-slate-700 dark:text-slate-300">
                Provider
                <select
                  value={formData.provider}
                  onChange={(e) => setFormData((prev) => ({ ...prev, provider: e.target.value }))}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950"
                >
                  <option value="gmail">Gmail</option>
                  <option value="outlook">Outlook</option>
                </select>
              </label>

              <label className="flex flex-col gap-1 text-sm text-slate-700 dark:text-slate-300">
                Type
                <select
                  value={formData.type}
                  onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value }))}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950"
                >
                  <option value="task">Task</option>
                  <option value="event">Event</option>
                </select>
              </label>
            </div>

            <label className="mt-3 flex flex-col gap-1 text-sm text-slate-700 dark:text-slate-300">
              Title
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950"
                required
              />
            </label>

            <label className="mt-3 flex flex-col gap-1 text-sm text-slate-700 dark:text-slate-300">
              Description
              <textarea
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                className="min-h-24 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950"
              />
            </label>

            {formData.type === "task" ? (
              <label className="mt-3 flex flex-col gap-1 text-sm text-slate-700 dark:text-slate-300">
                Due Date
                <input
                  type="datetime-local"
                  value={toLocalDatetimeValue(formData.dueDate)}
                  onChange={(e) => setFormData((prev) => ({ ...prev, dueDate: e.target.value }))}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950"
                />
              </label>
            ) : (
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="flex flex-col gap-1 text-sm text-slate-700 dark:text-slate-300">
                  Start Time
                  <input
                    type="datetime-local"
                    value={toLocalDatetimeValue(formData.startTime)}
                    onChange={(e) => setFormData((prev) => ({ ...prev, startTime: e.target.value }))}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950"
                    required
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm text-slate-700 dark:text-slate-300">
                  End Time
                  <input
                    type="datetime-local"
                    value={toLocalDatetimeValue(formData.endTime)}
                    onChange={(e) => setFormData((prev) => ({ ...prev, endTime: e.target.value }))}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950"
                  />
                </label>
              </div>
            )}

            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-gray-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-70"
              >
                {submitting ? "Creating..." : "Create"}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </DashboardLayout>
  );
}