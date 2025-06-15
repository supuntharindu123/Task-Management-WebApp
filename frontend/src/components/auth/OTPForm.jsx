import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/AuthContext";
import { toast } from "react-hot-toast";

const OTPForm = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { verifyOTP, email } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    if (!email) {
      toast.error("No email found for verification");
      return;
    }

    setLoading(true);

    try {
      const result = await verifyOTP(email, otp);
      if (!result.success) {
        setError(result.error || "OTP verification failed");
        toast.error(result.error || "OTP verification failed");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred");
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Verify OTP</h2>
      <p className="text-center mb-6">
        We've sent a 6-digit verification code to {email}
      </p>

      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="otp"
          >
            Verification Code
          </label>
          <input
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            type="text"
            id="otp"
            name="otp"
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            maxLength="6"
            inputMode="numeric"
            pattern="\d{6}"
            required
            autoFocus
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            className={`w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            type="submit"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OTPForm;
