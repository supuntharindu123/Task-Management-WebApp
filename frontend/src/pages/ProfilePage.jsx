import React from "react";
import { useAuth } from "../utils/AuthContext";

const ProfilePage = () => {
  const { user, email, isactive } = useAuth();

  if (!user) {
    return <div className="text-center p-4">Loading user data...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Profile</h1>

      <div className="bg-white p-6 rounded-lg shadow max-w-2xl">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Name
          </label>
          <p className="text-gray-900">{user || "Not available"}</p>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Email
          </label>
          <p className="text-gray-900">{email || "Not available"}</p>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Account Status
          </label>
          <p className="text-gray-900">
            {isactive ? "Active" : "Inactive"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
