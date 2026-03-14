import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-5">
        <div className="text-xl font-bold text-indigo-600 tracking-tight hover:text-indigo-700 transition">
          Smart Inbox
        </div>

        <div className="flex items-center gap-8">
          <Link to="/" className="text-gray-600 hover:text-gray-900 font-medium transition">
            Features
          </Link>
          <Link to="/" className="text-gray-600 hover:text-gray-900 font-medium transition">
            Pricing
          </Link>
        </div>

        <Link
          to="/login"
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200"
        >
          Login
        </Link>
      </div>
    </header>
  );
}

export default Navbar;