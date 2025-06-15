import React from "react";
import { Link } from "react-router-dom";

const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">
          403 - Unauthorized
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          You don't have permission to access this page
        </p>
        <Link
          to="/"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Go back to Home
        </Link>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
