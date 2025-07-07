import React, { useState } from "react";
import Logo from "../Logo/Logo";
import { Link, NavLink } from "react-router-dom";
import useAuth from "../../Hook/useAuth";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logOut } = useAuth();

  const handleLogout = () => {
    logOut()
      .then(() => {
        console.log("User logged out successfully");
        setShowUserMenu(false);
      })
      .catch((error) => {
        console.error("Logout error:", error);
      });
  };

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
          to="/sendParcel"
          className={({ isActive }) =>
            `px-4 py-2 rounded-lg transition-colors duration-200 hover:bg-gray-100 ${
              isActive ? "bg-gray-100 font-semibold" : ""
            }`
          }
        >
          Send Parcel
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
      {
        user && <li>
        <NavLink
          to="/dashboard/myParcels"
          className={({ isActive }) =>
            `px-4 py-2 rounded-lg transition-colors duration-200 hover:bg-gray-100 ${
              isActive ? "bg-gray-100 font-semibold" : ""
            }`
          }
        >
          Dashboard
        </NavLink>
      </li>
      }
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
    <nav data-aos="fade-down" className="bg-white rounded-xl px-6 py-4 relative z-50">
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
          {!user ? (
            <Link to="/login">
              <button className="px-6 py-2 text-gray-700 font-medium hover:text-gray-900 transition-colors duration-200">
                Sign In
              </button>
            </Link>
          ) : (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
              >
                <img
                  src={user.photoURL || "https://via.placeholder.com/40"}
                  alt={user.displayName || "User"}
                  className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
                />
                <span className="text-sm font-medium text-gray-700">
                  {user.displayName || "User"}
                </span>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${
                    showUserMenu ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-[9999]">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">
                      {user.displayName || "User"}
                    </p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/dashboard"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors duration-200"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          )}
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
        <div className="md:hidden mt-4 pt-4 border-t border-gray-200 relative z-[9999]">
          <ul className="space-y-2 mb-4">{navItems}</ul>
          <div className="flex flex-col space-y-2">
            {!user ? (
              <Link to="/login">
                <button
                  className="w-full px-4 py-2 text-left text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </button>
              </Link>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center space-x-3 px-4 py-2 bg-gray-50 rounded-lg">
                  <img
                    src={user.photoURL || "https://via.placeholder.com/40"}
                    alt={user.displayName || "User"}
                    className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {user.displayName || "User"}
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
                <Link to="/profile">
                  <button
                    className="w-full px-4 py-2 text-left text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </button>
                </Link>
                <Link to="/dashboard">
                  <button
                    className="w-full px-4 py-2 text-left text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </button>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-red-600 font-medium hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  Sign Out
                </button>
              </div>
            )}
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
