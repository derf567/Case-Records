import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase-config';
import { logoutUser } from '../firebase/authService';
import './css/Dashboard.css';
import logo_sq from './assets/LogoSquare.png';

const Dashboard = () => {
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [isSidebarCollapsed] = useState(false);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'CaseFile'));
        const casesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCases(casesList);
      } catch (error) {
        console.error('Error fetching cases: ', error);
      }
    };

    fetchCases();
  }, []);

  const getDaysRemaining = (preTrialDate) => {
    if (!preTrialDate) return null;
    const today = new Date();
    const preTrial = new Date(preTrialDate);
    const timeDifference = preTrial.getTime() - today.getTime();
    return Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
  };

  const handleLogout = async () => {
    await logoutUser();
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      <div className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <img src={logo_sq} alt="logo" className="logo-image" />
        </div>
        <div className="sidebar-content">
          <Button label="Dashboard" icon="pi pi-home" onClick={() => navigate('/dashboard')} className="sidebar-button" />
          <Button label="Case Records" icon="pi pi-folder" onClick={() => navigate('/caserecords')} className="sidebar-button" />
          <Button label="Settings" icon="pi pi-cog" onClick={() => navigate('/settings')} className="sidebar-button" />
          <Button label="Logout" icon="pi pi-sign-out" onClick={handleLogout} className="sidebar-button logout-button" />
        </div>
      </div>

      <div className="main-content">
        <div className="documents-header">
          <h2>Dashboard</h2>
        </div>

        <div className="reminders-container">
          {cases.length > 0 ? (
            cases.map((caseItem, index) => {
              const daysRemaining = getDaysRemaining(caseItem.preTrialPreliminary);
              if (daysRemaining !== null) {
                return (
                  <div key={index} className={`reminder-card ${daysRemaining <= 3 ? 'urgent' : ''}`}>
                    <p><strong>{caseItem.title}</strong></p>
                    <p>{daysRemaining} days remaining</p>
                  </div>
                );
              }
              return null;
            })
          ) : (
            <p>No upcoming deadlines</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
