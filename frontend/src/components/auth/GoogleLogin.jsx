import React from "react";
import { GoogleLogin as GoogleLoginButton } from "@react-oauth/google";
import { useAuth } from "../../utils/AuthContext";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const GoogleLogin = () => {
  const { googleLogin } = useAuth();
  const navigate = useNavigate();

  const onSuccess = async (credentialResponse) => {
    try {
      const result = await googleLogin(credentialResponse.credential);
      if (result.success) {
        navigate("/");
      } else {
        toast.error(result.error || "Google login failed");
      }
    } catch (error) {
      toast.error("Google login failed");
      console.error("Google login error:", error);
    }
  };

  const onError = () => {
    toast.error("Google login failed");
  };

  return (
    <div className=" w-full mb-4">
      <GoogleLoginButton
        onSuccess={onSuccess}
        onError={onError}
        useOneTap
        text="continue_with"
        shape="rectangular"
        size="large"
      />
    </div>
  );
};

export default GoogleLogin;
