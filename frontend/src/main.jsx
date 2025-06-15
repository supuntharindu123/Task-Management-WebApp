import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./utils/AuthContext";
import App from "./App";

import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

const googleClientId =
  process.env.REACT_APP_GOOGLE_CLIENT_ID ||
  "487784687738-6thhm91fijqonhptu59rh0v1p5778jh2.apps.googleusercontent.com";
console.log("Google Client ID:", googleClientId);

if (!googleClientId) {
  console.error("Missing Google Client ID! Check your .env file");
  // You might want to render an error component here in production
}

root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
