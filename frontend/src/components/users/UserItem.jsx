import React from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { deleteUser } from "../../store/actions/userActions";

const UserItem = ({ user }) => {
  const dispatch = useDispatch();

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to deactivate this user?")) {
      dispatch(deleteUser(user._id));
    }
  };

  const statusClasses = user.isActive
    ? "bg-green-100 text-green-800"
    : "bg-red-100 text-red-800";

  const roleClasses =
    user.role === "admin"
      ? "bg-blue-100 text-blue-800"
      : "bg-gray-100 text-gray-800";

  return (
    <div className="grid grid-cols-12 gap-4 p-4 items-center">
      <div className="col-span-3">{user.name}</div>
      <div className="col-span-4">{user.email}</div>
      <div className="col-span-2">
        <span className={`px-2 py-1 text-xs rounded-full ${roleClasses}`}>
          {user.role}
        </span>
      </div>
      <div className="col-span-2">
        <span className={`px-2 py-1 text-xs rounded-full ${statusClasses}`}>
          {user.isActive ? "Active" : "Inactive"}
        </span>
      </div>
      <div className="col-span-1 flex space-x-2">
        <Link
          to={`/admin/users/${user._id}/edit`}
          className="text-gray-500 hover:text-blue-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </Link>
        <button
          onClick={handleDelete}
          className="text-gray-500 hover:text-red-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default UserItem;
