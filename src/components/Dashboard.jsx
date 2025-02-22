// Dashboard.jsx
import React, { useState, useEffect, useRef } from 'react';
import { logoutUser } from "../firebase/authService";
import { useNavigate } from "react-router-dom";
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase-config';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import './css/Dashboard.css';
import logo_sq from './assets/LogoSquare.png';

const Dashboard = () => {
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [selectedCases, setSelectedCases] = useState([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const toast = useRef(null);

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
    if (!dueDate) return 'green';
    
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

  const handleEdit = () => {
    if (selectedCases.length === 1) {
      navigate(`/edit-case/${selectedCases[0].id}`);
    } else {
      toast.current.show({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please select one case to edit',
        life: 3000
      });
    }
  };

  const handleDelete = () => {
    if (selectedCases.length === 0) {
      toast.current.show({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please select cases to delete',
        life: 3000
      });
      return;
    }

    confirmDialog({
      message: `Are you sure you want to delete ${selectedCases.length} selected case(s)?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => deleteSelectedCases()
    });
  };

  const deleteSelectedCases = async () => {
    try {
      await Promise.all(
        selectedCases.map(caseItem => 
          deleteDoc(doc(db, 'CaseFile', caseItem.id))
        )
      );

      const updatedCases = cases.filter(
        caseItem => !selectedCases.some(selected => selected.id === caseItem.id)
      );
      setCases(updatedCases);
      setSelectedCases([]);

      toast.current.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Cases deleted successfully',
        life: 3000
      });
    } catch (error) {
      console.error("Error deleting cases: ", error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to delete cases',
        life: 3000
      });
    }
  };

  return (
    <div className="dashboard-container">
      <Toast ref={toast} />
      <ConfirmDialog />

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
            onClick={() => navigate('/case-records')}
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
            <h2>Documents</h2>
          </div>
          <div className="header-actions">
            <Button 
              icon="pi pi-pencil" 
              className="p-button-text"
              tooltip="Edit"
              onClick={handleEdit}
              disabled={selectedCases.length !== 1}
            />
            <Button 
              icon="pi pi-trash" 
              className="p-button-text"
              tooltip="Delete"
              onClick={handleDelete}
              disabled={selectedCases.length === 0}
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
            selection={selectedCases}
            onSelectionChange={e => setSelectedCases(e.value)}
            dataKey="id"
            paginator
            rows={15}
            rowsPerPageOptions={[5, 10, 15, 50]}
            className="custom-data-table"
            responsiveLayout="scroll"
            selectionMode="multiple"
          >
            <Column 
              selectionMode="multiple" 
              headerStyle={{ width: '3rem' }}
            />
            <Column 
              header="Status" 
              body={statusBodyTemplate} 
              style={{ width: '5%', textAlign: 'center' }}
            />
            <Column field="title" header="Case Title" style={{ width: '20%' }} />
            <Column field="caseNumber" header="Case Number" style={{ width: '15%' }} />
            <Column field="assignedJudge" header="Judge" style={{ width: '15%' }} />
            <Column field="dataField" header="Type" style={{ width: '15%' }} />
            <Column field="hearing" header="Hearing Status" style={{ width: '15%' }} />
            <Column field="nature" header="Nature" style={{ width: '15%' }} />
          </DataTable>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;