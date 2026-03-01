import { Link } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="text-2xl font-bold text-indigo-600">
            Smart Inbox
          </Link>

          <div className="hidden md:flex space-x-6 items-center">
            <Link to="/" className="hover:text-indigo-600">
              Features
            </Link>
            <Link to="/" className="hover:text-indigo-600">
              Pricing
            </Link>
            <Link
              to="/login"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Login
            </Link>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setOpen(!open)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {open && (
        <div className="md:hidden px-4 pt-2 pb-4 space-y-1">
          <Link to="/" className="block hover:text-indigo-600">
            Features
          </Link>
          <Link to="/" className="block hover:text-indigo-600">
            Pricing
          </Link>
          <Link
            to="/login"
            className="block bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Login
          </Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;