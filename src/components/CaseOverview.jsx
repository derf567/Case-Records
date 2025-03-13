import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../firebase/authService";
import './css/CaseOverview.css';
import logo_sq from './assets/LogoSquare.png';
import { Divider } from 'primereact/divider';


const CaseOverview = () => {
  const navigate = useNavigate();
  const [isSidebarCollapsed] = useState(false);

  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
  };

  return (
    <div className="dashboard-container">
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

      <div className="main-content">
        <div className="documents-header">
          <div className="header-left">
            <Button
              label="Back"
              onClick={() => navigate('/caserecords')}
            />
          </div>
        </div>

        <div className="card">
          <div className='toprow'>
            <p className='civil'>Civil Case No.</p>
            <Divider layout="vertical" />
            <p className='title'>Title</p>
            <Divider layout="vertical" />
            <p className='date-filed'>Date Filed/Raffled</p>
          </div>
          <Divider />
          <div className='secondrow'>
            <p className='judge'>JUDGE ASSIGNED</p>
          <Divider layout="vertical" />
            <p className='nature'>Nature</p>
            <Divider layout="vertical" />
            <div className='secondrow-date'>
              <p className='pre'>PRE-TRIAL/PRELIMINARY</p>
              <p>INITIAL TRIAL DATE</p>
            </div>
          </div>
          <Divider />
            <div className='last-trial'>
              <p>LAST TRIAL/COURT ACTION:</p>
            </div>
        </div>

      </div>
    </div>
  );
};

export default CaseOverview;