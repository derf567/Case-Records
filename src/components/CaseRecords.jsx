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
import { OverlayPanel } from 'primereact/overlaypanel';
import './css/CaseRecords.css';
import logo_sq from './assets/LogoSquare.png';

const CaseRecords = () => {
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [selectedCases, setSelectedCases] = useState([]);
  const [isSidebarCollapsed] = useState(false);
  const [reminders, setReminders] = useState([]); // State to hold reminders
  const toast = useRef(null);
  const op = useRef(null); // Reference for the overlay panel

  // Define the handleLogout function
  const handleLogout = async () => {
    try {
      await logoutUser(); // Call the logout function from authService
      navigate("/"); // Redirect to the home page or login page after logout
    } catch (error) {
      console.error("Error during logout:", error);
      toast.current.show({
        severity: 'error',
        summary: 'Logout Failed',
        detail: 'An error occurred while logging out. Please try again.',
        life: 3000,
      });
    }
  };

  // Fetch cases from Firestore
  useEffect(() => {
    const fetchCases = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'CaseFile'));
        const casesList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCases(casesList);
        console.log("Fetched cases:", casesList); // Debug log to see fetched data

        // Check for cases with due dates and show reminders
        checkDueDates(casesList);
      } catch (error) {
        console.error("Error fetching cases: ", error);
      }
    };

    fetchCases();
  }, []);

  // Function to check for cases with due dates and show reminders
  const checkDueDates = (casesList) => {
    const remindersList = casesList.filter(caseItem => {
      const daysRemaining = getDaysRemaining(caseItem.preTrialPreliminary);
      return daysRemaining !== null && daysRemaining <= 3;
    });
    setReminders(remindersList); // Store reminders in state
  };

  // Calculate the number of days remaining from the pre-trial date
  const getDaysRemaining = (preTrialDate) => {
    if (!preTrialDate) return null; // If no date is set, return null
    const today = new Date();
    const preTrial = new Date(preTrialDate);
    const timeDifference = preTrial.getTime() - today.getTime();
    const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    return daysRemaining;
  };

  // Determine the status color based on days remaining
  const getStatusColor = (preTrialDate) => {
    const daysRemaining = getDaysRemaining(preTrialDate);
    if (daysRemaining === null) return 'gray'; // If no date is set, return gray
    if (daysRemaining > 7) return 'green';
    if (daysRemaining > 3) return 'yellow';
    if (daysRemaining >= 0) return 'red';
    return 'gray'; // Default if daysRemaining is negative
  };

  // Status body template for the DataTable
  const statusBodyTemplate = (rowData) => {
    const statusColor = getStatusColor(rowData.preTrialPreliminary);
    const daysRemaining = getDaysRemaining(rowData.preTrialPreliminary);
    const statusText = daysRemaining !== null ? `${daysRemaining} days remaining` : 'No date set';

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

  // Date formatter function
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  // Template for date columns
  const dateTemplate = (rowData, field) => {
    return formatDate(rowData[field]);
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

  const handleCreateCase = () => {
    navigate("/create-case");
  };

  // Function to toggle the reminders overlay panel
  const toggleReminders = (event) => {
    op.current.toggle(event);
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
            <h2>Civil Case Records</h2>
          </div>
          <div className="header-actions">
            <Button 
              icon="pi pi-bell" 
              className="p-button-text"
              tooltip="Reminders"
              onClick={toggleReminders}
            />
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
            emptyMessage="No civil cases found"
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
            <Column field="civilCaseNo" header="CIVIL CASE NO." style={{ width: '12%' }} />
            <Column field="title" header="TITLE" style={{ width: '20%' }} />
            <Column field="nature" header="NATURE" style={{ width: '12%' }} />
            <Column 
              field="dateFiledRaffled" 
              header="DATE FILED/RAFFLED" 
              body={(rowData) => dateTemplate(rowData, 'dateFiledRaffled')} 
              style={{ width: '12%' }} 
            />
            <Column 
              field="preTrialPreliminary" 
              header="PRE-TRIAL/PRELIMINARY" 
              body={(rowData) => dateTemplate(rowData, 'preTrialPreliminary')} 
              style={{ width: '12%' }} 
            />
            <Column 
              field="dateOfInitialTrial" 
              header="INITIAL TRIAL DATE" 
              body={(rowData) => dateTemplate(rowData, 'dateOfInitialTrial')} 
              style={{ width: '12%' }} 
            />
            <Column 
              field="lastTrialCourtAction" 
              header="LAST TRIAL/COURT ACTION" 
              style={{ width: '15%' }} 
            />
            <Column 
              field="dateSubmittedForDecision" 
              header="SUBMITTED FOR DECISION" 
              body={(rowData) => dateTemplate(rowData, 'dateSubmittedForDecision')} 
              style={{ width: '12%' }} 
            />
            <Column 
              field="judgeAssigned" 
              header="JUDGE ASSIGNED" 
              style={{ width: '15%' }} 
            />
          </DataTable>
        </div>
      </div>

      {/* Reminders Overlay Panel */}
      <OverlayPanel ref={op} showCloseIcon>
        <h3>Reminders</h3>
        {reminders.length > 0 ? (
          <ul>
            {reminders.map((reminder, index) => (
              <li key={index}>
                <strong>{reminder.title}</strong>: {getDaysRemaining(reminder.preTrialPreliminary)} days remaining
              </li>
            ))}
          </ul>
        ) : (
          <p>No reminders found.</p>
        )}
      </OverlayPanel>
    </div>
  );
};

export default CaseRecords;