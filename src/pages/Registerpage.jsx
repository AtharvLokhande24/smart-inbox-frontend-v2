import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { FcGoogle } from "react-icons/fc";

function RegisterPage() {
  function handleGoogleLogin() {
    // Simulate Google login click — integrate OAuth backend here later
    console.log("Google login clicked");
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="flex items-center justify-center py-16 px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-2xl p-10 w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Create your account
          </h2>

          <input
            type="text"
            placeholder="Full Name"
            className="w-full mb-4 p-3 border rounded-lg"
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full mb-4 p-3 border rounded-lg"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full mb-4 p-3 border rounded-lg"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full mb-6 p-3 border rounded-lg"
          />

          <button className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition mb-4">
            Register
          </button>

          <button onClick={handleGoogleLogin} className="w-full flex items-center justify-center gap-3 border rounded-lg py-3 mb-3 hover:bg-gray-50 transition transform hover:scale-105">
            <FcGoogle size={20} />
            Continue with Google
          </button>

          <p className="text-center text-sm mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;