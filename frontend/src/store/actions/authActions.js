// Auth Actions (without toast, constants, dispatch, or API)

// Load User
export const loadUser = async () => {
  const token = localStorage.getItem("token");
  if (token) {
    // Set auth token logic would go here if needed
  }

  try {
    const response = await fetch("http://localhost:5000/api/auth/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: "Failed to load user" };
  }
};

// Register User
export const register = async (formData) => {
  try {
    const response = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const data = await response.json();

    if (!response.ok) {
      throw data;
    }

    alert("Verification code sent to your email");
    return { success: true, data };
  } catch (error) {
    const errors = error.error || "Registration failed";
    alert(Array.isArray(errors) ? errors.join("\n") : errors);
    return { success: false, error: errors };
  }
};

// Verify OTP
export const verifyOTP = async (email, otp) => {
  try {
    const response = await fetch("http://localhost:5000/api/auth/verify-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp }),
    });
    const data = await response.json();

    if (!response.ok) {
      throw data;
    }

    localStorage.setItem("token", data.token);
    alert("Account verified successfully");
    return { success: true, data };
  } catch (error) {
    const errorMsg = error.error || "OTP verification failed";
    alert(errorMsg);
    return { success: false, error: errorMsg };
  }
};

// Login User
export const login = async (email, password) => {
  try {
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();

    if (!response.ok) {
      throw data;
    }

    localStorage.setItem("token", data.token);
    alert("Logged in successfully");
    return { success: true, data };
  } catch (error) {
    const errorMsg = error.error || "Login failed";
    alert(errorMsg);
    return { success: false, error: errorMsg };
  }
};

// Google Login
export const googleLogin = async (token) => {
  try {
    const response = await fetch("http://localhost:5000/api/auth/google", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();

    if (!response.ok) {
      throw data;
    }

    localStorage.setItem("token", data.token);
    alert("Logged in with Google successfully");
    return { success: true, data };
  } catch (error) {
    const errorMsg = error.error || "Google login failed";
    alert(errorMsg);
    return { success: false, error: errorMsg };
  }
};

// Forgot Password
export const forgotPassword = async (email) => {
  try {
    const response = await fetch(
      "http://localhost:5000/api/auth/forgotpassword",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }
    );
    const data = await response.json();

    if (!response.ok) {
      throw data;
    }

    alert("Password reset code sent to your email");
    return { success: true, data };
  } catch (error) {
    const errorMsg = error.error || "Password reset failed";
    alert(errorMsg);
    return { success: false, error: errorMsg };
  }
};

// Reset Password
export const resetPassword = async (email, otp, newPassword) => {
  try {
    const response = await fetch(
      "http://localhost:5000/api/auth/resetpassword",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp, newPassword }),
      }
    );
    const data = await response.json();

    if (!response.ok) {
      throw data;
    }

    alert("Password reset successfully");
    return { success: true, data };
  } catch (error) {
    const errorMsg = error.error || "Password reset failed";
    alert(errorMsg);
    return { success: false, error: errorMsg };
  }
};

// Logout User
export const logout = async () => {
  try {
    await fetch("http://localhost:5000/api/logout", {
      method: "GET",
    });
    localStorage.removeItem("token");
    alert("Logged out successfully");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Logout failed" };
  }
};
