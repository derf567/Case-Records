import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../firebase/authService";
import './css/Settings.css';
import logo_sq from './assets/LogoSquare.png';

const Settings = () => {
    const navigate = useNavigate();
      const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const handleLogout = async () => {
      await logoutUser();
      navigate("/");
    };

  return (
    <div>
        <ul className="side">
          <div className="logo-sq"><img src={logo_sq} alt="logo" /></div>
        </ul>
       <div className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
              <div className="sidebar-header">
                <img src={logo_sq} alt="logo" className="logo-image" />
              </div>
              <div className="sidebar-content">
                <Button
                  label="Dashboard"
                  icon="pi pi-home"
                  onClick={() => navigate('/dashboard')}
                  className="sidebar-button"
                />
                <Button
                  label="Case Records"
                  icon="pi pi-folder"
                  onClick={() => navigate('/caserecords')}
                  className="sidebar-button"
                />
                <Button
                  label="Settings"
                  icon="pi pi-cog"
                  onClick={() => navigate('/settings')}
                  className="sidebar-button"
                />
                <Button
                  label="Logout"
                  icon="pi pi-sign-out"
                  onClick={handleLogout}
                  className="sidebar-button logout-button"
                />
              </div>
            </div>
      </div>
    );
};

export default Settings;