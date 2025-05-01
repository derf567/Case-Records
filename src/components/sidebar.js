import React from 'react';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../firebase/AdminContext';

const Sidebar = ({ isSidebarCollapsed, toggleSidebar, userName, handleLogout }) => {
  const navigate = useNavigate();
  const { isAdmin } = useAdmin();

  const getUserInitials = () => {
    if (!userName) return 'U';

    const names = userName.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return userName.substring(0, 2).toUpperCase();
  };

  return (
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
          icon={isSidebarCollapsed ? 'pi pi-bars' : 'pi pi-times'}
          className="p-button-rounded p-button-text hamburger-button"
          onClick={toggleSidebar}
          aria-label="Toggle Menu"
        />
      </div>

      <div className="sidebar-divider"></div>

      <div className="sidebar-content">
        <Button
          label={isSidebarCollapsed ? '' : 'Dashboard'}
          icon="pi pi-home"
          onClick={() => navigate('/dashboard')}
          className="sidebar-button"
          tooltip={isSidebarCollapsed ? 'Dashboard' : null}
          tooltipOptions={isSidebarCollapsed ? { position: 'right' } : null}
        />
        <Button
          label={isSidebarCollapsed ? '' : 'Case Records'}
          icon="pi pi-folder"
          onClick={() => navigate('/caserecords')}
          className="sidebar-button"
          tooltip={isSidebarCollapsed ? 'Case Records' : null}
          tooltipOptions={isSidebarCollapsed ? { position: 'right' } : null}
        />

        {isAdmin && (
          <Button
            label={isSidebarCollapsed ? '' : 'User Approvals'}
            icon="pi pi-users"
            onClick={() => navigate('/user-approvals')}
            className="sidebar-button"
            tooltip={isSidebarCollapsed ? 'User Approvals' : null}
            tooltipOptions={isSidebarCollapsed ? { position: 'right' } : null}
          />
        )}

        <Button
          label={isSidebarCollapsed ? '' : 'Settings'}
          icon="pi pi-cog"
          onClick={() => navigate('/settings')}
          className="sidebar-button"
          tooltip={isSidebarCollapsed ? 'Settings' : null}
          tooltipOptions={isSidebarCollapsed ? { position: 'right' } : null}
        />
        <Button
          label={isSidebarCollapsed ? '' : 'Resolved Cases'}
          icon="pi pi-check-square"
          onClick={() => navigate('/resolved-cases')}
          className="sidebar-button"
          tooltip={isSidebarCollapsed ? 'Resolved Cases' : null}
          tooltipOptions={isSidebarCollapsed ? { position: 'right' } : null}
        />
      </div>

      <Button
        label={isSidebarCollapsed ? '' : 'Logout'}
        icon="pi pi-sign-out"
        onClick={handleLogout}
        className="sidebar-button logout-button"
        tooltip={isSidebarCollapsed ? 'Logout' : null}
        tooltipOptions={isSidebarCollapsed ? { position: 'right' } : null}
      />
    </div>
  );
};

export default Sidebar;