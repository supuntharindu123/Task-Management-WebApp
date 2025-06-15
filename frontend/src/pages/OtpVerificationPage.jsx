import React from "react";
import OTPForm from "../components/auth/OTPForm";

const OtpVerificationPage = () => {
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Verify OTP</h2>
      <OTPForm />
    </div>
  );
};

export default OtpVerificationPage;
