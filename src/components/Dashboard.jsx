// Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { logoutUser } from "../firebase/authService";
import { useNavigate } from "react-router-dom";
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase-config';
import './css/Dashboard.css';
import logo_sq from './assets/LogoSquare.png'

const Dashboard = () => {
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'CaseFile'));
        const casesList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCases(casesList);
      } catch (error) {
        console.error("Error fetching cases: ", error);
      }
    };

    fetchCases();
  }, []);

  
  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
  };

  const handleCreateCase = () => {
    navigate("/create-case");
  };

  const getStatusColor = (dueDate) => {
    if (!dueDate) return 'green'; // Default status
    
    const today = new Date();
    const due = new Date(dueDate);
    const daysRemaining = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

    if (daysRemaining < 0) return 'red';
    if (daysRemaining <= 7) return 'yellow';
    return 'green';
  };

  const statusBodyTemplate = (rowData) => {
    const statusColor = getStatusColor(rowData.dueDate);
    let statusText = '';
    
    switch(statusColor) {
      case 'red':
        statusText = 'Overdue';
        break;
      case 'yellow':
        statusText = 'Due Soon';
        break;
      case 'green':
        statusText = 'On Track';
        break;
      default:
        statusText = 'Unknown';
    }

    return (
      <div 
        className="status-indicator" 
        data-status={statusText}
        title={statusText}
      >
        <span className={`status-dot ${statusColor}`}></span>
      </div>
    );
  };

  return (
    <div className="dashboard-container">
      <div className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <img src={logo_sq} alt="logo" className="logo-image" />
        </div>
        <div className="sidebar-content">
          {/* Main Navigation Buttons */}
          <Button
            label="Dashboard"
            icon="pi pi-home"
            onClick={() => navigate('/dashboard')}
            className="sidebar-button"
          />
          <Button
            label="Case Records"
            icon="pi pi-folder"
            onClick={() => navigate('/case-records')}
            className="sidebar-button"
          />
          <Button
            label="Settings"
            icon="pi pi-cog"
            onClick={() => navigate('/settings')}
            className="sidebar-button"
          />
          
          {/* Logout Button - Remains at bottom */}
          <Button
            label="Logout"
            icon="pi pi-sign-out"
            onClick={handleLogout}
            className="sidebar-button logout-button"
          />
        </div>
      </div>

      <div className="main-content">
          {/* Add this toolbar section */}
        <div className="documents-header">
          <div className="header-left">
            <h2>Documents</h2>
          </div>
          <div className="header-actions">
            <Button 
              icon="pi pi-pencil" 
              className="p-button-text"
              tooltip="Edit"
            />
            <Button 
              icon="pi pi-trash" 
              className="p-button-text"
              tooltip="Delete"
            />
            <Button 
              icon="pi pi-filter" 
              className="p-button-text"
              tooltip="Filters"
            />
            <Button 
              icon="pi pi-download" 
              className="p-button-text"
              tooltip="Export"
            />
            <Button 
              label="Add new case"
              icon="pi pi-plus"
              className="p-button-primary add-case-btn"
              onClick={handleCreateCase}
            />
          </div>
        </div>
        <div className="card">
          <DataTable
            value={cases}
            paginator
            rows={15}
            rowsPerPageOptions={[5, 10, 15, 50]}
            className="custom-data-table"
            responsiveLayout="scroll"
          >
              <Column 
                header="Status" 
                body={statusBodyTemplate} 
                style={{ width: '5%', textAlign: 'center' }}
              />
            <Column field="title" header="Case Title" style={{ width: '20%' }}></Column>
            <Column field="caseNumber" header="Case Number" style={{ width: '15%' }}></Column>
            <Column field="assignedJudge" header="Judge" style={{ width: '15%' }}></Column>
            <Column field="dataField" header="Type" style={{ width: '15%' }}></Column>
            <Column field="hearing" header="Hearing Status" style={{ width: '15%' }}></Column>
            <Column field="nature" header="Nature" style={{ width: '20%' }}></Column>
          </DataTable>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;