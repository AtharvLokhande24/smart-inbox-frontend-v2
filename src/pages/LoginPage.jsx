import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { FcGoogle } from "react-icons/fc";

function LoginPage() {
  function handleGoogleLogin() {
    // Simulate Google login for now — replace with OAuth backend later
    console.log("Google login clicked");
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="flex items-center justify-center py-16 px-4">
        <div className="bg-white shadow-lg rounded-2xl p-10 w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Login to your account
          </h2>

          <input
            type="email"
            placeholder="Email"
            className="w-full mb-4 p-3 border rounded-lg"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full mb-6 p-3 border rounded-lg"
          />

          <button className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition">
            Login
          </button>

          <div className="flex flex-col gap-3 mt-6">
            <button onClick={handleGoogleLogin} className="flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-lg hover:bg-gray-100 transition transform hover:scale-105">
              <FcGoogle size={20} /> Continue with Google
            </button>
          </div>

          <p className="text-center text-sm text-gray-600 mt-4">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-600 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;