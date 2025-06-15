// PrivateRoute.js
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../utils/AuthContext";

const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const auth = useAuth();

  if (!auth.token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;
