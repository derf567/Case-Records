// firebase/ProtectedUserRoute.js
import { Navigate } from "react-router-dom";
import { useAdmin } from "./AdminContext";

const ProtectedUserRoute = ({ children }) => {
  const { currentUser, userApproved, isAdmin, isLoading } = useAdmin();

  // Show loading state while checking authentication
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Allow access if user is admin or an approved regular user
  if (!currentUser || (!isAdmin && !userApproved)) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedUserRoute;