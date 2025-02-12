// Create a new component: ProtectedAdminRoute.js
import { Navigate } from 'react-router-dom';

const ProtectedAdminRoute = ({ children }) => {
  // Add your admin authentication check logic here
  const isAdmin = true;
  
  if (!isAdmin) {
    return <Navigate to="/login" />;
  }

  return children;
};

// In your routing setup (App.js or similar):
import ProtectedAdminRoute from './components/ProtectedAdminRoute';

// ... in your routes configuration:
<Route 
  path="/admin-dashboard" 
  element={
    <ProtectedAdminRoute>
      <AdminDashboard />
    </ProtectedAdminRoute>
  } 
/>