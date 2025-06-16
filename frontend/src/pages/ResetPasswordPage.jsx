import React from 'react';
import { Link } from 'react-router-dom';
import ResetPasswordForm from '../components/auth/ResetPasswordForm';
import { FaArrowLeft } from 'react-icons/fa';

const ResetPasswordPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="mb-6">
          <Link 
            to="/login" 
            className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
          >
            <FaArrowLeft className="mr-2" />
            Back to Login
          </Link>
          <h2 className="text-3xl font-bold text-center text-gray-900">
            Reset Password
          </h2>
          <p className="mt-2 text-center text-gray-600">
            Please enter your new password below.
          </p>
        </div>
        <ResetPasswordForm />
      </div>
    </div>
  );
};

export default ResetPasswordPage;
