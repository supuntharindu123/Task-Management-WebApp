import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    user: null,
    email: null,
    token: localStorage.getItem("token") || null,
  });

  const navigate = useNavigate();

  // Load user data
  const loadUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const id = localStorage.getItem("id");
      if (!token) return;

      const response = await fetch(`http://localhost:5000/api/auth/me/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to load user");

      const data = await response.json();
      setAuthState({
        user: data.data.name,
        id: data.data._id,      // Make sure ID is set
        email: data.data.email,
        isactive: data.data.isactive,
        role: data.data.role,   // Make sure role is set
        token,
      });
    } catch (error) {
      console.error("Auth error:", error);
      logout();
    }
  };

  // Verify OTP function
  const verifyOTP = async (email, otp) => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, otp }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "OTP verification failed");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      setAuthState({
        user: data.user,
        email: data.user?.email,
        token: data.token,
      });
      navigate("/");
      return { success: true };
    } catch (error) {
      console.error("OTP verification error:", error);
      return { success: false, error: error.message };
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("id", data.id);
        setAuthState({
          user: data.id,
          name: data.name,
          email: email,
          role: data.role, // Make sure role is included
          token: data.token,
        });
        navigate("/");
        return { success: true };
      } else {
        return { success: false, error: data.message };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "Login failed" };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    setAuthState({
      user: null,
      email: null,
      token: null,
    });
    navigate("/login");
  };

  // Add Google Login function
  const googleLogin = async (credential) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ credential }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("id", data.id);
        setAuthState({
          user: data.id,
          name: data.name,
          email: data.email,
          role: data.role,
          token: data.token,
        });
        return { success: true };
      } else {
        return { success: false, error: data.message };
      }
    } catch (error) {
      console.error("Google login error:", error);
      return { success: false, error: "Google login failed" };
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login, // Add login to context value
        loadUser,
        verifyOTP,
        logout,
        googleLogin, // Add googleLogin to context
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
