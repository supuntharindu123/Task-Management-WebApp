import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./utils/AuthContext";
import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/DashboardPage";
import TasksPage from "./pages/TaskPage";
import TaskDetailPage from "./pages/TaskDetailPage";
import UsersPage from "./pages/UsersPage";
import ProfilePage from "./pages/ProfilePage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import NotFoundPage from "./pages/NotFoundPage";
import PrivateRoute from "./components/ui/PrivateRoute";
import AdminRoute from "./components/ui/AdminRoute";
import OtpVerificationPage from "./pages/OtpVerificationPage";
import TaskForm from "./components/tasks/TaskForm";
import EditTaskForm from "./components/tasks/EditTaskForm";
import UserEdit from "./components/users/UserEdit";
// import ForgotPasswordPage from "./pages/ForgotPasswordPage";
// import ResetPasswordPage from "./pages/ResetPasswordPage";

const App = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <div className="flex">
        {/* {auth.token && <Sidebar user={auth.user} />} */}

        <main className="flex-1 p-4">
          <Routes>
            <Route path="/login" element={<LoginPage onLogin={auth.login} />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/verify-otp" element={<OtpVerificationPage />} />
            {/* <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} /> */}

            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Dashboard user={auth.user} />
                </PrivateRoute>
              }
            />

            <Route
              path="/tasks"
              element={
                <PrivateRoute>
                  <TasksPage />
                </PrivateRoute>
              }
            />

            <Route
              path="/tasks/new"
              element={
                <PrivateRoute>
                  <TaskForm />
                </PrivateRoute>
              }
            />

            <Route
              path="/tasks/:id"
              element={
                <PrivateRoute>
                  <TaskDetailPage />
                </PrivateRoute>
              }
            />

            <Route
              path="/tasks/:id/edit"
              element={
                <PrivateRoute>
                  <EditTaskForm />
                </PrivateRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <ProfilePage user={auth.user} />
                </PrivateRoute>
              }
            />

            <Route
              path="/admin/users"
              element={
                <AdminRoute>
                  <UsersPage />
                </AdminRoute>
              }
            />

            <Route
              path="/admin/users/:id/edit"
              element={
                <AdminRoute>
                  <UserEdit />
                </AdminRoute>
              }
            />

            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>

      <Toaster position="top-right" />
    </div>
  );
};

export default App;
