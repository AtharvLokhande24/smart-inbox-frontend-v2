import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { FcGoogle } from "react-icons/fc";
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
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  function handleGoogleLogin() {
    window.location.href = "http://localhost:8000/login/oauth2/login";
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="flex flex-1 items-center justify-center py-12 px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-2xl p-10 w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Create your account
          </h2>

          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Full Name"
              className="w-full mb-4 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-600 focus:outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

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
              className="w-full mb-4 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-600 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full mb-6 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-600 focus:outline-none"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition mb-4 disabled:bg-indigo-400"
            >
              {isLoading ? "Creating account..." : "Register"}
            </button>
          </form>

          <div className="relative flex items-center mb-4 border-t pt-5">
             <div className="flex-grow border-t border-gray-200"></div>
          </div>

          <button 
            type="button"
            onClick={handleGoogleLogin} 
            className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-3 mb-3 hover:bg-gray-50 transition transform hover:scale-105"
          >
            <FcGoogle size={20} />
            Continue with Google
          </button>

          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 font-medium hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;