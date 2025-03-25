import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase-config';
import { logoutUser } from '../firebase/authService';
import { Avatar } from 'primereact/avatar';
import { getAuth } from 'firebase/auth';
import { Card } from 'primereact/card';
import { ProgressBar } from 'primereact/progressbar';
import { Toast } from 'primereact/toast';
import './css/Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [userName, setUserName] = useState('');
  const [caseStats, setCaseStats] = useState({
    total: 0,
    upcoming: 0,
    urgent: 0,
    resolved: 0
  });
  const toast = useRef(null);

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

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'CaseFile'));
        const casesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCases(casesList);
        
        // Calculate statistics
        calculateCaseStats(casesList);
        
      } catch (error) {
        console.error('Error fetching cases: ', error);
        if (toast.current) {
          toast.current.show({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to fetch case data',
            life: 3000
          });
        }
      }
    };

    fetchCases();
  }, []);

  const calculateCaseStats = (casesList) => {
    const stats = {
      total: casesList.length,
      upcoming: 0,
      urgent: 0,
      resolved: 0
    };

    casesList.forEach(caseItem => {
      const daysRemaining = getDaysRemaining(caseItem.preTrialPreliminary);
      if (daysRemaining !== null) {
        if (daysRemaining <= 3 && daysRemaining > 0) {
          stats.urgent++;
        } else if (daysRemaining > 3) {
          stats.upcoming++;
        }
      }
      
      // Consider cases as resolved if they have a submission date for decision
      if (caseItem.dateSubmittedForDecision) {
        stats.resolved++;
      }
    });

    setCaseStats(stats);
  };

  const getDaysRemaining = (preTrialDate) => {
    if (!preTrialDate) return null;
    const today = new Date();
    const preTrial = new Date(preTrialDate);
    const timeDifference = preTrial.getTime() - today.getTime();
    return Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/');
    } catch (error) {
      console.error('Error during logout:', error);
      if (toast.current) {
        toast.current.show({
          severity: 'error',
          summary: 'Logout Failed',
          detail: 'An error occurred during logout. Please try again.',
          life: 3000
        });
      }
    }
  };

  const viewAllCases = () => {
    navigate('/caserecords');
  };

  return (
    <div className="dashboard-container">
      <Toast ref={toast} />
      
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
            className="sidebar-button active"
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
        </div>
        
        {/* Fixed position logout button */}
        <Button
          label={isSidebarCollapsed ? "" : "Logout"}
          icon="pi pi-sign-out"
          onClick={handleLogout}
          className="sidebar-button logout-button"
          tooltip={isSidebarCollapsed ? "Logout" : null}
          tooltipOptions={isSidebarCollapsed ? { position: 'right' } : null}
        />
      </div>

      <div className={`main-content ${isSidebarCollapsed ? 'expanded' : ''}`}>
        <div className="documents-header">
          <h2>Dashboard</h2>
          <div className="last-update">
            Last updated: {new Date().toLocaleString()}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-container">
          <Card className="stats-card">
            <div className="stats-icon total">
              <i className="pi pi-folder"></i>
            </div>
            <div className="stats-info">
              <h3>{caseStats.total}</h3>
              <p>Total Cases</p>
            </div>
          </Card>
          
          <Card className="stats-card">
            <div className="stats-icon upcoming">
              <i className="pi pi-calendar"></i>
            </div>
            <div className="stats-info">
              <h3>{caseStats.upcoming}</h3>
              <p>Upcoming Hearings</p>
            </div>
          </Card>
          
          <Card className="stats-card">
            <div className="stats-icon urgent">
              <i className="pi pi-exclamation-circle"></i>
            </div>
            <div className="stats-info">
              <h3>{caseStats.urgent}</h3>
              <p>Urgent (≤ 3 days)</p>
            </div>
          </Card>
          
          <Card className="stats-card">
            <div className="stats-icon resolved">
              <i className="pi pi-check-circle"></i>
            </div>
            <div className="stats-info">
              <h3>{caseStats.resolved}</h3>
              <p>Resolved Cases</p>
            </div>
          </Card>
        </div>

        <div className="dashboard-grid">
          {/* Upcoming Deadlines Section */}
          <Card className="deadlines-card">
            <div className="card-header">
              <h3>Upcoming Deadlines</h3>
              <Button 
                label="View All Cases" 
                icon="pi pi-arrow-right" 
                className="p-button-text p-button-sm" 
                onClick={viewAllCases} 
              />
            </div>
            
            <div className="reminders-container">
              {cases.length > 0 ? (
                cases
                  .filter(caseItem => {
                    const daysRemaining = getDaysRemaining(caseItem.preTrialPreliminary);
                    return daysRemaining !== null && daysRemaining > 0;
                  })
                  .sort((a, b) => getDaysRemaining(a.preTrialPreliminary) - getDaysRemaining(b.preTrialPreliminary))
                  .slice(0, 5) // Show only the 5 most urgent cases
                  .map((caseItem, index) => {
                    const daysRemaining = getDaysRemaining(caseItem.preTrialPreliminary);
                    const urgencyClass = daysRemaining <= 3 ? 'urgent' : daysRemaining <= 7 ? 'moderate' : 'normal';
                    
                    return (
                      <div key={index} className={`reminder-card ${urgencyClass}`}>
                        <div className="reminder-header">
                          <h4>{caseItem.title}</h4>
                          <span className="days-remaining">{daysRemaining} days</span>
                        </div>
                        <p className="case-nature">{caseItem.nature}</p>
                        <p className="case-number">{caseItem.civilCaseNo}</p>
                        <ProgressBar 
                          value={Math.min(100, 100 - (daysRemaining / 30 * 100))} 
                          showValue={false} 
                          className={`urgency-progress ${urgencyClass}`}
                        />
                      </div>
                    );
                  })
              ) : (
                <div className="no-data">
                  <i className="pi pi-calendar-times" style={{ fontSize: '2rem', color: '#ccc' }}></i>
                  <p>No upcoming deadlines</p>
                </div>
              )}
              
              {cases.length > 0 && 
               !cases.some(caseItem => {
                 const daysRemaining = getDaysRemaining(caseItem.preTrialPreliminary);
                 return daysRemaining !== null && daysRemaining > 0;
               }) && (
                <div className="no-data">
                  <i className="pi pi-check-circle" style={{ fontSize: '2rem', color: '#4caf50' }}></i>
                  <p>No upcoming deadlines at this time</p>
                </div>
              )}
            </div>
          </Card>
          
          {/* Recent Activity Card */}
          <Card className="activity-card">
            <div className="card-header">
              <h3>Recent Activity</h3>
            </div>
            <div className="activity-container">
              {cases.length > 0 ? (
                cases
                  .sort((a, b) => {
                    // Sort by creation date if available, otherwise by ID
                    const dateA = a.createdAt ? new Date(a.createdAt) : null;
                    const dateB = b.createdAt ? new Date(b.createdAt) : null;
                    
                    if (dateA && dateB) return dateB - dateA;
                    if (dateA) return -1;
                    if (dateB) return 1;
                    return 0;
                  })
                  .slice(0, 5)
                  .map((caseItem, index) => (
                    <div key={index} className="activity-item">
                      <div className="activity-icon">
                        <i className="pi pi-file"></i>
                      </div>
                      <div className="activity-content">
                        <h4>{caseItem.title}</h4>
                        <p>{caseItem.civilCaseNo}</p>
                        <span className="activity-date">
                          {caseItem.createdAt ? caseItem.createdAt : 'Date not available'}
                        </span>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="no-data">
                  <i className="pi pi-folder-open" style={{ fontSize: '2rem', color: '#ccc' }}></i>
                  <p>No case records found</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;