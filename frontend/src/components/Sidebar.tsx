import { useState } from "react";
import routeConfig from "../config/routes.json";
import { Link } from "react-router-dom";
import { logout } from "../hooks/useAuth";

const Sidebar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700 transition"
        aria-label="Toggle menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {isMobileMenuOpen ? (
            <path d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          w-64 h-screen bg-green-100 border-r border-green-200 shadow-lg p-6 
          fixed flex flex-col z-40 transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="mb-8 text-center py-4 bg-gradient-to-r from-green-600 to-emerald-700 rounded-xl shadow-md">
          <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-wide">
            Galatura Tea Factory
          </h1>
          <p className="text-green-100 text-xs mt-1 font-medium">
            Management System
          </p>
        </div>

        <nav className="flex-1 space-y-4 overflow-y-auto">
          {routeConfig.map((route) => (
            <Link
              key={route.path}
              className="block px-4 py-2 text-green-700 hover:bg-green-200 rounded-lg transition"
              to={route.path}
              onClick={closeMobileMenu}
            >
              {route.tabName}
            </Link>
          ))}
        </nav>

        <div className="mt-4">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-center"
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
