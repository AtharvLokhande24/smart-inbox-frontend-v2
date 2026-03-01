import { useState } from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

function LandingPage() {
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const emails = [
    { id: 1, subject: "Meeting Tomorrow", priority: "high" },
    { id: 2, subject: "Amazon Sale", priority: "low" },
    { id: 3, subject: "Project Deadline", priority: "high" },
  ];

  function runAnalysis() {
    setShowResults(false);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowResults(true);
    }, 1500);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />

      {/* Hero Section */}
      <section className="min-h-[85vh] flex items-center">
        <div className="max-w-6xl mx-auto px-6 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center">

            {/* Left Side */}
            <div className="max-w-md space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 leading-tight">
                Prioritize What Matters
              </h1>

              <p className="text-lg text-gray-600 leading-relaxed">
                Smart Inbox uses AI to prioritize your Gmail inbox so you can focus
                on the messages that move the needle.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition duration-300 text-center"
                >
                  Get Started
                </Link>

                <Link
                  to="/login"
                  className="border-2 border-gray-300 text-gray-900 px-8 py-3 rounded-xl font-semibold hover:border-gray-400 hover:bg-gray-50 transition duration-300 text-center"
                >
                  Login
                </Link>
              </div>
            </div>

            {/* Right Side */}
            <div className="flex justify-center lg:justify-end">
              <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm hover:shadow-2xl transition duration-300">

                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    Live Example
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Your inbox with AI prioritization
                  </p>
                </div>

                <div className="space-y-3">
                  {emails.map((e) => (
                    <div
                      key={e.id}
                      className="flex justify-between items-center bg-gray-50 rounded-lg px-4 py-3 hover:bg-gray-100 transition cursor-pointer"
                    >
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          {e.subject}
                        </div>
                        <div className="text-xs text-gray-500">
                          from: sender@example.com
                        </div>
                      </div>

                      <div className="ml-3">
                        {loading ? (
                          <svg
                            className="h-4 w-4 animate-spin text-gray-400"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                            />
                          </svg>
                        ) : showResults ? (
                          e.priority === "high" ? (
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-600">
                              High
                            </span>
                          ) : (
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-200 text-gray-600">
                              Low
                            </span>
                          )
                        ) : (
                          <span className="text-gray-400 text-xs font-medium">
                            —
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={
                    showResults
                      ? () => {
                          setLoading(false);
                          setShowResults(false);
                        }
                      : runAnalysis
                  }
                  className="w-full mt-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition duration-300"
                >
                  {loading
                    ? "Analyzing..."
                    : showResults
                    ? "Reset"
                    : "Run AI Analysis"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-tr from-indigo-50 to-indigo-100 p-6 rounded-xl shadow-lg hover:shadow-xl transition">
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                AI Priority Detection
              </h3>
              <p className="text-gray-600">
                Let smart algorithms determine what matters most so you don’t
                have to.
              </p>
            </div>

            <div className="bg-gradient-to-tr from-green-50 to-green-100 p-6 rounded-xl shadow-lg hover:shadow-xl transition">
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                Smart Summary
              </h3>
              <p className="text-gray-600">
                Quick overviews of long email threads to save you time.
              </p>
            </div>

            <div className="bg-gradient-to-tr from-pink-50 to-pink-100 p-6 rounded-xl shadow-lg hover:shadow-xl transition">
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                Gmail Integration
              </h3>
              <p className="text-gray-600">
                Seamless connection with your inbox for real-time updates.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;