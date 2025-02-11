import React from 'react'; 
import { logoutUser } from "../firebase/authService";
import { useNavigate } from "react-router-dom";
import { Button } from 'primereact/button';
import './css/Dashboard.css'; // Import your CSS file

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <Button 
        label="Logout" 
        onClick={handleLogout} 
        className="custom-logout-button" // Use your custom class
      />
    </div>
  );
};

export default Dashboard;
