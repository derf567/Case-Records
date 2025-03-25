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

const CreateCase = () => {
  const navigate = useNavigate();
  const toast = useRef(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [userName, setUserName] = useState('');
  const [caseData, setCaseData] = useState({
    civilCaseNo: '',
    title: '',
    nature: '',
    dateFiledRaffled: null,
    preTrialPreliminary: null,
    dateOfInitialTrial: null,
    lastTrialCourtAction: '',
    dateSubmittedForDecision: null,
    judgeAssigned: ''
  });

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

  // Helper function to format timestamp in 12-hour format with AM/PM
  const getFormattedTimestamp = () => {
    const now = new Date();
    const hours = now.getHours() % 12 || 12; // Convert to 12-hour format
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
    const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const day = now.getDate().toString().padStart(2, '0');
    const year = now.getFullYear();

    return `${month}/${day}/${year} ${hours}:${minutes} ${ampm}`;
  };

  // for dropdown NATURE
  const [selectedNature, setSelectedNature] = useState(null);
  const natures = [
    { name: 'Accion Publiciana/Ejectment'},
    { name: 'Quieting of Title/Reconveyance of Property'},
    { name: "Recovery of Possession, Damages and Attorney's Fees"}
  ];

  const handleInputChange = (e, field) => {
    setCaseData({
      ...caseData,
      [field]: e.target.value
    });
  };

  const handleNatureChange = (e, field) => {
    const selectedIndex = natures.findIndex(item => item.name === e.value.name);
    const selectedName = natures[selectedIndex]?.name; // Get the name based on index

    setCaseData({
      ...caseData,
      [field]: selectedName // Store the name instead of index
    });
  };

  const handleDateChange = (value, field) => {
    setCaseData({
      ...caseData,
      [field]: value
    });
  };

  const handleLogout = async () => {
    await logoutUser();
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Format dates for Firestore
    const formattedData = {
      ...caseData,
      dateFiledRaffled: caseData.dateFiledRaffled ? caseData.dateFiledRaffled.toISOString() : null,
      preTrialPreliminary: caseData.preTrialPreliminary ? caseData.preTrialPreliminary.toISOString() : null,
      dateOfInitialTrial: caseData.dateOfInitialTrial ? caseData.dateOfInitialTrial.toISOString() : null,
      dateSubmittedForDecision: caseData.dateSubmittedForDecision ? caseData.dateSubmittedForDecision.toISOString() : null,
      createdAt: getFormattedTimestamp() // Add creation timestamp in 12-hour format
    };
    
    try {
      await addDoc(collection(db, 'CaseFile'), formattedData);
      
      toast.current.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Civil case has been successfully created.',
        life: 3000
      });
      
      setTimeout(() => {
        navigate('/caserecords');
      }, 2000);
      
    } catch (error) {
      console.error('Error creating case: ', error);
      
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to create case. Please try again.',
        life: 3000
      });
    }
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
            <h2>Create New Civil Case</h2>
          </div>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="case-form">
            <div className="form-field">
              <label>CIVIL CASE NO.</label>
              <InputText
                value={caseData.civilCaseNo}
                onChange={(e) => handleInputChange(e, 'civilCaseNo')}
                required
              />
            </div>

            <div className="form-field">
              <label>TITLE</label>
              <InputText
                value={caseData.title}
                onChange={(e) => handleInputChange(e, 'title')}
                required
              />
            </div>

            <div className="form-field">
              <label>NATURE</label>
              <Dropdown 
                value={selectedNature} 
                onChange={(e) => {
                  setSelectedNature(e.value);  
                  handleNatureChange(e, 'nature');
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
                value={caseData.dateFiledRaffled}
                onChange={(e) => handleDateChange(e.value, 'dateFiledRaffled')}
                dateFormat="yy-mm-dd"
                showIcon
                required
              />
            </div>

            <div className="form-field">
              <label>PRE-TRIAL/PRELIMINARY</label>
              <Calendar
                value={caseData.preTrialPreliminary}
                onChange={(e) => handleDateChange(e.value, 'preTrialPreliminary')}
                dateFormat="yy-mm-dd"
                showIcon
              />
            </div>

            <div className="form-field">
              <label>DATE OF INITIAL TRIAL</label>
              <Calendar
                value={caseData.dateOfInitialTrial}
                onChange={(e) => handleDateChange(e.value, 'dateOfInitialTrial')}
                dateFormat="yy-mm-dd"
                showIcon
              />
            </div>

            <div className="form-field">
              <label>LAST TRIAL/COURT ACTION TAKEN AND DATE THEREOF</label>
              <InputText
                value={caseData.lastTrialCourtAction}
                onChange={(e) => handleInputChange(e, 'lastTrialCourtAction')}
                required
              />
            </div>
            
            <div className="form-field">
              <label>DATE SUBMITTED FOR DECISION</label>
              <Calendar
                value={caseData.dateSubmittedForDecision}
                onChange={(e) => handleDateChange(e.value, 'dateSubmittedForDecision')}
                dateFormat="yy-mm-dd"
                showIcon
              />
            </div>

            <div className="form-field">
              <label>JUDGE TO WHOM CASE IS ASSIGNED</label>
              <InputText
                value={caseData.judgeAssigned}
                onChange={(e) => handleInputChange(e, 'judgeAssigned')}
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

export default CreateCase;