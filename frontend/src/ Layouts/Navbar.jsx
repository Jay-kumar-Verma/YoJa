import React, { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/Logo.JPG";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md w-full z-50">
      <div className="max-w-screen-xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src={Logo}
            alt="YoJa Logo"
            className="h-16 w-auto rounded-md object-cover"
          />
          {/* <span className="text-xl font-bold text-sky-600 hidden sm:block">YoJa</span> */}
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/about" className="text-gray-700 hover:text-sky-500 transition">
            About
          </Link>
          <Link to="/blog" className="text-gray-700 hover:text-sky-500 transition">
            Blog
          </Link>
          <Link to="/contact" className="text-gray-700 hover:text-sky-500 transition">
            Contact
          </Link>
          <Link to="/demo" className="text-gray-700 hover:text-sky-500 transition">
            Watch Demo
          </Link>
          <Link to="/asanas" className="text-gray-700 hover:text-sky-500 transition">
            Asanas
          </Link>
        </div>

        {/* Sign In (Desktop) */}
        <div className="hidden md:block ml-6">
          <Link
            to="/login"
            className="bg-sky-500 text-white px-6 py-2 rounded-full hover:bg-sky-600 transition-all duration-300"
          >
            Sign In
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-gray-700 hover:text-sky-500 focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden px-6 pb-4 animate-slide-down">
          <div className="flex flex-col gap-4">
            <Link to="/about" className="text-gray-700 hover:text-sky-500 transition">
              About
            </Link>
            <Link to="/blog" className="text-gray-700 hover:text-sky-500 transition">
              Blog
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-sky-500 transition">
              Contact
            </Link>
            <Link to="/demo" className="text-gray-700 hover:text-sky-500 transition">
              Watch Demo
            </Link>
            <Link to="/asanas" className="text-gray-700 hover:text-sky-500 transition">
              Asanas
            </Link>
            <Link
              to="/login"
              className="bg-sky-500 text-white text-center px-5 py-2 rounded-full hover:bg-sky-600 transition"
            >
              Sign In
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
