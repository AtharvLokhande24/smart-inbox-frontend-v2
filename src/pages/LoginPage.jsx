import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await api.post("/auth/login", { email, password });
      login(response.data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  async function handleGoogleLogin() {
    try {
      const res = await api.get("/gmail/login");
      window.location.href = res.data.loginUrl;
    } catch (err) {
      setError(err.response?.data?.error || "Failed to start Google login.");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="flex flex-1 items-center justify-center py-12 px-4">
        <div className="bg-white shadow-lg rounded-2xl p-10 w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Login to your account
          </h2>

          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              className="w-full mb-4 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-600 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full mb-6 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-600 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition disabled:bg-indigo-400"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="flex flex-col gap-3 mt-6 border-t pt-6">
            <button 
              onClick={handleGoogleLogin} 
              type="button"
              className="flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-lg hover:bg-gray-100 transition transform hover:scale-105"
            >
              <FcGoogle size={20} /> Continue with Google
            </button>
          </div>

          <p className="text-center text-sm text-gray-600 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-600 font-medium hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;