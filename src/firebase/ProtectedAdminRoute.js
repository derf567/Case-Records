import { Navigate } from "react-router-dom"
import { useAdmin } from "./AdminContext"

const ProtectedAdminRoute = ({ children }) => {
  const { isAdmin, isLoading } = useAdmin()

  // Show loading state while checking authentication
  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!isAdmin) {
    return <Navigate to="/login" />
  }

  return children
}

export default ProtectedAdminRoute
