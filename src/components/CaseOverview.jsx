import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase-config';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { getAuth } from 'firebase/auth';
import { logoutUser } from '../firebase/authService';
import './css/CaseOverview.css';

const CaseOverview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [caseDetails, setCaseDetails] = useState(null);
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

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

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

  if (!caseDetails) {
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
          <div className="loading-container">
            <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i>
            <p>Loading case details...</p>
          </div>
        </div>
      </div>
    );
  }

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
            className="sidebar-button active"
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
            <h2>Case Overview</h2>
          </div>
          <div className="header-actions">
            <Button 
              icon="pi pi-pencil" 
              label="Edit Case"
              className="p-button-outlined p-button-primary"
              onClick={() => navigate(`/edit-case/${id}`)}
            />
          </div>
        </div>

        <div className="card case-overview-card">
          <div className="case-title-section">
            <h3>{caseDetails.title}</h3>
            <span className="case-number">{caseDetails.civilCaseNo}</span>
          </div>

          <div className="case-details-grid">
            <div className="case-detail-item">
              <div className="detail-label">Nature</div>
              <div className="detail-value">{caseDetails.nature || 'Not specified'}</div>
            </div>

            <div className="case-detail-item">
              <div className="detail-label">Date Filed/Raffled</div>
              <div className="detail-value">{formatDate(caseDetails.dateFiledRaffled)}</div>
            </div>

            <div className="case-detail-item">
              <div className="detail-label">Pre-Trial/Preliminary</div>
              <div className="detail-value">{formatDate(caseDetails.preTrialPreliminary)}</div>
            </div>

            <div className="case-detail-item">
              <div className="detail-label">Initial Trial Date</div>
              <div className="detail-value">{formatDate(caseDetails.dateOfInitialTrial)}</div>
            </div>

            <div className="case-detail-item">
              <div className="detail-label">Last Court Action</div>
              <div className="detail-value">{caseDetails.lastTrialCourtAction || 'None recorded'}</div>
            </div>

            <div className="case-detail-item">
              <div className="detail-label">Submitted for Decision</div>
              <div className="detail-value">{formatDate(caseDetails.dateSubmittedForDecision)}</div>
            </div>

            <div className="case-detail-item">
              <div className="detail-label">Judge Assigned</div>
              <div className="detail-value">{caseDetails.judgeAssigned || 'Not assigned'}</div>
            </div>

            {caseDetails.createdAt && (
              <div className="case-detail-item">
                <div className="detail-label">Created</div>
                <div className="detail-value">{caseDetails.createdAt}</div>
              </div>
            )}
          </div>

          <div className="case-actions">
            <Button 
              label="Back to Case Records" 
              icon="pi pi-arrow-left"
              className="p-button-text" 
              onClick={() => navigate('/caserecords')} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseOverview;