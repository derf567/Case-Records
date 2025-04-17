import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase/firebase-config';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import { Avatar } from 'primereact/avatar';
import { getAuth } from 'firebase/auth';
import { logoutUser } from '../firebase/authService';
import './css/CreateCase.css';

const EditCase = () => {
  const navigate = useNavigate();
  const toast = useRef(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [userName, setUserName] = useState('');

  //Handles the fetching for the input text
  const [caseDetails, setCaseDetails] = useState(null);

  useEffect(() => {
    const fetchCaseDetails = async () => {
      try {
        const caseRef = doc(db, 'CaseFile', id);
        const caseSnap = await getDoc(caseRef);
        if (caseSnap.exists()) {
          setCaseDetails(caseSnap.data());
        } else {
          console.error('No such case found!');
        }
      } catch (error) {
        console.error('Error fetching case details:', error);
      }
    };

    fetchCaseDetails();
  }, [id]);

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

  // for dropdown NATURE
  const [selectedNature, setSelectedNature] = useState(null);
  const natures = [
    { name: 'Accion Publiciana/Ejectment'},
    { name: 'Quieting of Title/Reconveyance of Property'},
    { name: "Recovery of Possession, Damages and Attorney's Fees"}
  ];


  const handleLogout = async () => {
    await logoutUser();
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
  };

  return (
    <div className="dashboard-container">
      <Toast ref={toast} position="top-center" />
      
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
            className="sidebar-button"
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
            <h2>Edit Civil Case</h2>
          </div>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="case-form">
            <div className="form-field">
              <label>CIVIL CASE NO.</label>
              <InputText
            {caseDetails.nature}
              />
            </div>

            <div className="form-field">
              <label>TITLE</label>
              <InputText

              />
            </div>

            <div className="form-field">
              <label>NATURE</label>
              <Dropdown 
                value={selectedNature} 
                onChange={(e) => {
                  setSelectedNature(e.value);  
                }} 
                options={natures} 
                optionLabel="name" 
                placeholder="Select a Nature" 
                className="natureofcase" 
                required
              />               
            </div>

            <div className="form-field">
              <label>DATE FILED/RAFFLED</label>
              <Calendar
                dateFormat="yy-mm-dd"
                showIcon
                required
              />
            </div>

            <div className="form-field">
              <label>PRE-TRIAL/PRELIMINARY</label>
              <Calendar
                dateFormat="yy-mm-dd"
                showIcon
              />
            </div>

            <div className="form-field">
              <label>DATE OF INITIAL TRIAL</label>
              <Calendar
                dateFormat="yy-mm-dd"
                showIcon
              />
            </div>

            <div className="form-field">
              <label>LAST TRIAL/COURT ACTION TAKEN AND DATE THEREOF</label>
              <InputText
                required
              />
            </div>
            
            <div className="form-field">
              <label>DATE SUBMITTED FOR DECISION</label>
              <Calendar
                dateFormat="yy-mm-dd"
                showIcon
              />
            </div>

            <div className="form-field">
              <label>JUDGE TO WHOM CASE IS ASSIGNED</label>
              <InputText
                required
              />
            </div>

            <div className="button-container">
              <Button label="Submit" type="submit" className="p-button-success" />
              <Button
                label="Cancel"
                onClick={() => navigate('/caserecords')}
                className="p-button-secondary"
                type="button"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditCase;