import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicRoute = ({ children }) => {
  const { isAuthenticated, currentUser } = useAuth();

  if (isAuthenticated) {
    if (currentUser?.role === "admin" || currentUser?.role === "technician") {
      return <Navigate to="/admin/dashboard" replace />;
    }
  }

  return children;
};

export default PublicRoute;