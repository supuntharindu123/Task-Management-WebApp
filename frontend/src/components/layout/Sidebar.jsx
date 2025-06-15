import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaTasks, FaUsers } from "react-icons/fa";
import { useAuth } from "../../utils/AuthContext";

const Sidebar = () => {
  const { user } = useAuth();

  return (
    <div className="w-64 bg-white shadow-md h-screen">
      <div className="p-4">
        <ul className="space-y-2">
          <li>
            <Link
              to="/"
              className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded"
            >
              <FaHome className="mr-3" />
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/tasks"
              className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded"
            >
              <FaTasks className="mr-3" />
              Tasks
            </Link>
          </li>
          {/* Show Users link only for admin */}
          {user?.role === "admin" && (
            <li>
              <Link
                to="/admin/users"
                className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded"
              >
                <FaUsers className="mr-3" />
                Users
              </Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
