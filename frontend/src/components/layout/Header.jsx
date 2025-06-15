import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaTasks, FaUsers, FaUser, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../../utils/AuthContext";

const Header = () => {
  const navigate = useNavigate();
  const auth = useAuth();

  const handleLogout = () => {
    auth.logout();
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-blue-600">
            Task Manager
          </Link>

          {auth.token && <nav className="flex items-end space-x-6"></nav>}

          <div className="flex items-center space-x-4">
            {auth.token ? (
              <>
                <Link
                  to="/"
                  className="flex items-center text-gray-600 hover:text-blue-600"
                >
                  <FaHome className="mr-2" />
                  Dashboard
                </Link>
                <Link
                  to="/tasks"
                  className="flex items-center text-gray-600 hover:text-blue-600"
                >
                  <FaTasks className="mr-2" />
                  Tasks
                </Link>
                {auth.role === "admin" && (
                  <Link
                    to="/admin/users"
                    className="flex items-center text-gray-600 hover:text-blue-600"
                  >
                    <FaUsers className="mr-2" />
                    Users
                  </Link>
                )}
                <Link
                  to="/profile"
                  className="flex items-center text-gray-600 hover:text-blue-600"
                >
                  <FaUser className="mr-2" />
                  {auth.user?.name}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-gray-600 hover:text-blue-600"
                >
                  <FaSignOutAlt className="mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-blue-600">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
