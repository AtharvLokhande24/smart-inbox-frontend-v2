import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { FcGoogle } from "react-icons/fc";
import { FaMicrosoft } from "react-icons/fa";
import { startOAuthLogin } from "../services/oauth";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  React.useEffect(() => {
    const oauthError = searchParams.get("oauthError");
    if (oauthError) {
      setError(oauthError);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await api.post("/auth/login", { email, password });
      login(response.data.user);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || "Failed to login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  async function handleGoogleLogin() {
    setIsLoading(true);
    const oauthError = await startOAuthLogin("gmail");
    if (oauthError) {
      setError(oauthError);
      setIsLoading(false);
    }
  }

  async function handleOutlookLogin() {
    setIsLoading(true);
    const oauthError = await startOAuthLogin("outlook");
    if (oauthError) {
      setError(oauthError);
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#050816] text-slate-100">
      <Navbar />

      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-950/85 p-10 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-sm">
          <h2 className="mb-6 text-center text-2xl font-semibold text-slate-50">
            Sign in to Smart Inbox
          </h2>

          {error && (
            <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              className="mb-4 w-full rounded-xl border border-slate-700 bg-slate-900/70 p-3 text-slate-50 placeholder:text-slate-500 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="mb-6 w-full rounded-xl border border-slate-700 bg-slate-900/70 p-3 text-slate-50 placeholder:text-slate-500 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-3 font-medium text-white transition hover:from-indigo-500 hover:to-purple-500 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="my-5 text-center text-sm text-slate-300">
            You can also sign in with any Gmail or Outlook account linked to your profile.
          </p>

          <button
            onClick={handleGoogleLogin}
            type="button"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/60 py-3 text-slate-100 transition hover:border-slate-500 hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <FcGoogle size={20} /> {isLoading ? "Redirecting..." : "Continue with Google"}
          </button>

          <button
            onClick={handleOutlookLogin}
            type="button"
            disabled={isLoading}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/60 py-3 text-slate-100 transition hover:border-slate-500 hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <FaMicrosoft size={18} className="text-blue-600" /> {isLoading ? "Redirecting..." : "Continue with Outlook"}
          </button>

          <p className="mt-6 text-center text-sm text-slate-300">
            New here?{' '}
            <Link to="/register" className="font-medium text-indigo-300 hover:text-indigo-200 hover:underline">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;