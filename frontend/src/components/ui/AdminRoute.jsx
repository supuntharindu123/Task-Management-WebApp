// AdminRoute.js
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../utils/AuthContext";

const AdminRoute = ({ children }) => {
  const location = useLocation();
  const auth = useAuth();

  if (!auth.token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (auth.role !== "admin") {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default AdminRoute;
