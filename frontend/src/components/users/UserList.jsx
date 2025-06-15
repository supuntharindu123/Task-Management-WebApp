import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../utils/AuthContext";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/users", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Response:", errorText);
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data && data.data) {
          setUsers(data.data);
          setError(null);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setError(`Failed to load users: ${error.message}`);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUsers();
    } else {
      setError("No authentication token found");
      setLoading(false);
    }
  }, [token]);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Users</h1>
        <Link
          to="/admin/users/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Add User
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading users...</div>
      ) : users.length === 0 ? (
        <div className="text-center py-8">No users found</div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="grid grid-cols-12 gap-4 p-4 font-bold border-b">
            <div className="col-span-3">Name</div>
            <div className="col-span-4">Email</div>
            <div className="col-span-2">Role</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-1">Actions</div>
          </div>

          <div className="divide-y divide-gray-200">
            {users.map((user) => (
              <UserItem key={user._id} user={user} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const UserItem = ({ user }) => {
  return (
    <div className="grid grid-cols-12 gap-4 p-4 items-center">
      <div className="col-span-3">{user.name}</div>
      <div className="col-span-4">{user.email}</div>
      <div className="col-span-2 capitalize">{user.role}</div>
      <div className="col-span-2">
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            user.isactive
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {user.isactive ? "Active" : "Inactive"}
        </span>
      </div>
      <div className="col-span-1">
        <Link
          to={`/admin/users/${user._id}/edit`}
          className="text-blue-600 hover:text-blue-800"
        >
          Edit
        </Link>
      </div>
    </div>
  );
};

export default UserList;
