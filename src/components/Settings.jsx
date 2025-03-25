import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../firebase/authService";
import { Avatar } from 'primereact/avatar';
import { getAuth } from 'firebase/auth';
import './css/Settings.css';

const Settings = () => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [userName, setUserName] = useState('');

  // Toggle sidebar function
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Get current user's information
  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (user) {
      // Use displayName if available, otherwise use email or 'User'
      const displayName = user.displayName || (user.email ? user.email.split('@')[0] : 'User');
      setUserName(displayName);
    }
  }, []);

  // Function to get user initials for avatar
  const getUserInitials = () => {
    if (!userName) return 'U';
    
    const names = userName.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return userName.substring(0, 2).toUpperCase();
  };

  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar with welcome message and toggle button */}
      <div className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        {/* User Welcome Section with Toggle Button */}
        <div className="user-welcome">
          <Avatar 
            label={getUserInitials()} 
            shape="circle" 
            className="user-avatar"
            style={{ backgroundColor: '#2196F3', color: '#ffffff' }}
          />
          
          {!isSidebarCollapsed && (
            <div className="welcome-text">
              <span>Welcome,</span>
              <h3>{userName}</h3>
            </div>
          )}
          
          <Button 
            icon={isSidebarCollapsed ? "pi pi-bars" : "pi pi-times"} 
            className="p-button-rounded p-button-text hamburger-button"
            onClick={toggleSidebar}
            aria-label="Toggle Menu"
          />
        </div>
        
        <div className="sidebar-divider"></div>
        
        <div className="sidebar-content">
          <Button
            label={isSidebarCollapsed ? "" : "Dashboard"}
            icon="pi pi-home"
            onClick={() => navigate('/dashboard')}
            className="sidebar-button"
            tooltip={isSidebarCollapsed ? "Dashboard" : null}
            tooltipOptions={isSidebarCollapsed ? { position: 'right' } : null}
          />
          <Button
            label={isSidebarCollapsed ? "" : "Case Records"}
            icon="pi pi-folder"
            onClick={() => navigate('/caserecords')}
            className="sidebar-button"
            tooltip={isSidebarCollapsed ? "Case Records" : null}
            tooltipOptions={isSidebarCollapsed ? { position: 'right' } : null}
          />
          <Button
            label={isSidebarCollapsed ? "" : "Settings"}
            icon="pi pi-cog"
            onClick={() => navigate('/settings')}
            className="sidebar-button active"
            tooltip={isSidebarCollapsed ? "Settings" : null}
            tooltipOptions={isSidebarCollapsed ? { position: 'right' } : null}
          />
          <Button
            label={isSidebarCollapsed ? "" : "Logout"}
            icon="pi pi-sign-out"
            onClick={handleLogout}
            className="sidebar-button logout-button"
            tooltip={isSidebarCollapsed ? "Logout" : null}
            tooltipOptions={isSidebarCollapsed ? { position: 'right' } : null}
          />
        </div>
      </div>

      <div className={`main-content ${isSidebarCollapsed ? 'expanded' : ''}`}>
        <div className="documents-header">
          <div className="header-left">
            <h2>Settings</h2>
          </div>
          <div className="header-actions">
            {/* Add any settings-related actions here */}
          </div>
        </div>

        <div className="card">
          {/* Add settings content here */}
          <p>Settings content will go here.</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;