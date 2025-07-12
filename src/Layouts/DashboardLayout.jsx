import React, { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../Hook/useAuth";
import logo from "../assets/logo.png";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { 
  FaBox, 
  FaPaperPlane, 
  FaSearch, 
  FaUser, 
  FaCreditCard, 
  FaHome, 
  FaSignOutAlt, 
  FaTimes, 
  FaBars 
} from 'react-icons/fa';
import useUserRole from "../Hook/useUserRole";


const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const {role} = useUserRole()
  console.log(role)

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 600,
      easing: 'ease-out-cubic',
      once: true,
      mirror: false,
      offset: 50,
      disable: 'mobile'
    });
    
    return () => {
      AOS.refresh();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Base menu items for all users
  const baseMenuItems = [
    {
      name: "My Parcels",
      path: "/dashboard/myParcels",
      icon: <FaBox />,
      description: "View and manage your parcels",
    },
    {
      name: "Track Parcel",
      path: "/dashboard/tracking",
      icon: <FaSearch />,
      description: "Track your parcels",
    },
    {
      name: "Payment History",
      path: "/dashboard/payments",
      icon: <FaCreditCard />,
      description: "View payment history",
    },
  ];

  // Admin-only menu items
  const adminMenuItems = [
    {
      name: "Active Rider",
      path: "/dashboard/activeRider",
      icon: <FaPaperPlane />,
      description: "View active riders",
    },
    {
      name: "Pending Rider",
      path: "/dashboard/pendingRider",
      icon: <FaUser />,
      description: "View pending riders",
    },
    {
      name: "Make Admin",
      path: "/dashboard/makeAdmin",
      icon: <FaUser />,
      description: "Manage user roles and permissions",
    },
  ];

  // Combine menu items based on user role
  const menuItems = role === 'admin' 
    ? [...baseMenuItems, ...adminMenuItems]
    : baseMenuItems;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0  bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-[#03373D]" data-aos="fade-right">
          <div className="flex items-center space-x-3">
            <div>
              <Link to="/">
                <div className="flex items-end">
                  <img className="mb-2" src={logo} alt="" />
                  <p className="font-bold text-[28px] -ml-4 text-white">
                    ProFast
                  </p>
                </div>
              </Link>
              <p className="text-[#CAEB66] text-sm">Dashboard</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white hover:text-[#CAEB66] transition-colors"
          >
            <FaTimes className="w-6 h-6" />
          </button>
        </div>

        {/* User Profile Section */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-[#03373D]/5 to-[#CAEB66]/10" data-aos="fade-right" data-aos-delay="100">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-[#CAEB66] flex items-center justify-center">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-[#03373D] font-bold text-lg">
                  {user?.displayName?.charAt(0) ||
                    user?.email?.charAt(0) ||
                    "U"}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#03373D] truncate">
                {user?.displayName || "User"}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto" data-aos="fade-up" data-aos-delay="200">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? "bg-[#03373D] text-white shadow-lg"
                    : "text-gray-600 hover:bg-[#CAEB66]/10 hover:text-[#03373D]"
                }`}
              >
                <span
                  className={`text-2xl ${
                    isActive
                      ? "transform scale-110"
                      : "group-hover:transform group-hover:scale-110"
                  } transition-transform duration-200`}
                >
                  {item.icon}
                </span>
                <div className="flex-1">
                  <div
                    className={`font-medium ${
                      isActive ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {item.name}
                  </div>
                  <div
                    className={`text-xs ${
                      isActive ? "text-gray-300" : "text-gray-500"
                    }`}
                  >
                    {item.description}
                  </div>
                </div>
                {isActive && (
                  <div className="w-2 h-2 bg-[#CAEB66] rounded-full"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200 space-y-2" data-aos="fade-up" data-aos-delay="600">
          <Link
            to="/"
            data-aos="fade-right"
            data-aos-delay="650"
            className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors duration-200"
          >
            <FaHome className="text-xl" />
            <span className="font-medium">Back to Home</span>
          </Link>
          <button
            onClick={handleLogout}
            data-aos="fade-right"
            data-aos-delay="700"
            className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors duration-200"
          >
            <FaSignOutAlt className="text-xl" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white shadow-sm border-b border-gray-200 px-4 py-3" data-aos="fade-down">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#CAEB66] transition-colors"
              >
                <FaBars className="w-6 h-6" />
              </button>
              <div className="flex items-end">
                <img className="h-6 mb-1" src={logo} alt="ProFast" />
                <p className="font-bold text-lg -ml-2 text-[#03373D]">ProFast</p>
              </div>
            </div>
            
            {/* User Avatar */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-[#CAEB66] flex items-center justify-center">
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-[#03373D] font-bold text-sm">
                    {user?.displayName?.charAt(0) ||
                      user?.email?.charAt(0) ||
                      "U"}
                  </span>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50" data-aos="fade-up" data-aos-delay="300">
          <div className="p-4 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
