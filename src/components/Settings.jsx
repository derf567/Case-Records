import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../firebase/authService";
import { Avatar } from 'primereact/avatar';
import { getAuth, reauthenticateWithCredential, EmailAuthProvider, updatePassword } from 'firebase/auth';
import { Toast } from 'primereact/toast';
import './css/Settings.css';

const Settings = () => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [userName, setUserName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const toast = React.useRef(null);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (user) {
      const displayName = user.displayName || (user.email ? user.email.split('@')[0] : 'User');
      setUserName(displayName);
    }
  }, []);

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

  const verifyCurrentPassword = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!currentPassword) {
      showToast('Please enter your current password.', 'warn');
      return;
    }

    const credential = EmailAuthProvider.credential(user.email, currentPassword);

    try {
      setLoading(true);
      await reauthenticateWithCredential(user, credential);
      setIsVerified(true);
      showToast('Password verified successfully!', 'success');
    } catch (error) {
      console.error('Error verifying password:', error);
      showToast('Incorrect current password.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!newPassword || newPassword.length < 6) {
      showToast('New password must be at least 6 characters.', 'warn');
      return;
    }

    try {
      setLoading(true);
      await updatePassword(user, newPassword);
      showToast('Password updated successfully!', 'success');
      setNewPassword('');
      setCurrentPassword('');
      setIsVerified(false); // Reset after change
    } catch (error) {
      console.error('Error updating password:', error);
      showToast('Failed to update password. Please re-login and try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, severity = "info") => {
    toast.current.show({ severity, summary: severity.toUpperCase(), detail: message, life: 3000 });
  };

  return (
    <div className="dashboard-container">
      <Toast ref={toast} position="top-center" />

      <div className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
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
            {/* Settings-related actions if needed */}
          </div>
        </div>

        <div className="card">
          <h3>Change Password</h3>

          {/* Current Password Verification */}
          {!isVerified && (
            <div className="input-group">
              <input
                type="password"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="password-input"
              />
              <Button
                label={loading ? "Verifying..." : "Verify Password"}
                icon={loading ? "pi pi-spin pi-spinner" : "pi pi-check"}
                onClick={verifyCurrentPassword}
                className="verify-password-button"
                disabled={loading}
              />
            </div>
          )}

          {/* New Password Input */}
          {isVerified && (
            <>
              <div className="input-group">
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="password-input"
                />
              </div>
              <Button
                label={loading ? "Updating..." : "Update Password"}
                icon={loading ? "pi pi-spin pi-spinner" : "pi pi-key"}
                onClick={handleChangePassword}
                className="update-password-button"
                disabled={loading}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
