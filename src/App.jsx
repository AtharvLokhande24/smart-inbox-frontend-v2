import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import useDarkMode from "./hooks/useDarkMode";
import { useEffect, useState } from "react";

function App() {
  useDarkMode();
  const [sessionExpiredMessage, setSessionExpiredMessage] = useState("");

  useEffect(() => {
    const onSessionExpired = (event) => {
      const message = event?.detail?.message || "Your session has expired. Please login again.";
      setSessionExpiredMessage(message);
    };

    window.addEventListener("session-expired", onSessionExpired);

    return () => {
      window.removeEventListener("session-expired", onSessionExpired);
    };
  }, []);

  const goToLogin = () => {
    const message = sessionExpiredMessage || "Your session has expired. Please login again.";
    const loginUrl = `/login?oauthError=${encodeURIComponent(message)}`;
    setSessionExpiredMessage("");
    window.location.assign(loginUrl);
  };

  return (
    <AuthProvider>
      <AppRoutes />
      {sessionExpiredMessage ? (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/60 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Session expired</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{sessionExpiredMessage}</p>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={goToLogin}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition"
              >
                Re-login
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </AuthProvider>
  );
}


export default App;