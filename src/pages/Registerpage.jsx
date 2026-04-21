import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    if (password.length < 8) {
      return setError("Password must be at least 8 characters");
    }

    setIsLoading(true);

    try {
      const response = await api.post("/auth/register", { name, email, password });
      login(response.data.user);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050816] text-slate-100">
      <Navbar />

      <div className="flex flex-1 items-center justify-center px-6 py-12 lg:px-8">
        <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-950/85 p-10 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-sm">
          <h2 className="mb-6 text-center text-2xl font-semibold text-slate-50">
            Create your Smart Inbox account
          </h2>

          {error && (
            <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Full Name"
              className="mb-4 w-full rounded-xl border border-slate-700 bg-slate-900/70 p-3 text-slate-50 placeholder:text-slate-500 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

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
              className="mb-4 w-full rounded-xl border border-slate-700 bg-slate-900/70 p-3 text-slate-50 placeholder:text-slate-500 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Confirm Password"
              className="mb-6 w-full rounded-xl border border-slate-700 bg-slate-900/70 p-3 text-slate-50 placeholder:text-slate-500 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <button
              type="submit"
              disabled={isLoading}
              className="mb-4 w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-3 font-medium text-white transition hover:from-indigo-500 hover:to-purple-500 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? "Creating account..." : "Register"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-300">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-indigo-300 hover:text-indigo-200 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;