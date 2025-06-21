import React, { useState } from "react";
import Logo from "../Logo/Logo";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = (
    <>
      <li>
        <NavLink
          to="/"
          className={({ isActive }) =>
            `px-4 py-2 rounded-lg transition-colors duration-200 hover:bg-gray-100 ${
              isActive ? "bg-gray-100 font-semibold" : ""
            }`
          }
        >
          Home
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/coverage"
          className={({ isActive }) =>
            `px-4 py-2 rounded-lg transition-colors duration-200 hover:bg-gray-100 ${
              isActive ? "bg-gray-100 font-semibold" : ""
            }`
          }
        >
          Coverage
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            `px-4 py-2 rounded-lg transition-colors duration-200 hover:bg-gray-100 ${
              isActive ? "bg-gray-100 font-semibold" : ""
            }`
          }
        >
          About Us
        </NavLink>
      </li>
    </>
  );

  return (
    <nav data-aos="fade-down" className="bg-white rounded-xl  px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Logo />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex">
          <ul className="flex items-center space-x-2">{navItems}</ul>
        </div>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center space-x-3">
          <button className="px-6 py-2 text-gray-700 font-medium hover:text-gray-900 transition-colors duration-200">
            Sign In
          </button>
          <button className="bg-[#CAEB66] px-6 py-2 rounded-lg font-medium text-gray-800 hover:bg-[#b8d659] transition-colors duration-200">
            Be a Rider
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
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
        <div className="md:hidden mt-4 pt-4 border-t border-gray-200">
          <ul className="space-y-2 mb-4">{navItems}</ul>
          <div className="flex flex-col space-y-2">
            <button className="w-full px-4 py-2 text-left text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors duration-200">
              Sign In
            </button>
            <button className="w-full bg-[#CAEB66] px-4 py-2 rounded-lg font-medium text-gray-800 hover:bg-[#b8d659] transition-colors duration-200">
              Be a Rider
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
