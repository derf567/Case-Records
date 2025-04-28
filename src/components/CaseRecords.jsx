import React, { useState, useEffect, useRef } from 'react';
import { logoutUser } from "../firebase/authService";
import { useNavigate } from "react-router-dom";
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { collection, getDocs, doc, deleteDoc} from 'firebase/firestore';
import { db } from '../firebase/firebase-config';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Avatar } from 'primereact/avatar';
import { getAuth } from 'firebase/auth';
import { writeBatch, serverTimestamp } from "firebase/firestore";
import './css/CaseRecords.css';

const CaseRecords = () => {
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [selectedCases, setSelectedCases] = useState([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [reminders, setReminders] = useState([]);
  const [userName, setUserName] = useState('');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'
  const toast = useRef(null);
  const op = useRef(null);

  // Toggle sidebar function
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const sortCasesByDeadline = (order) => {
    const sortedCases = [...cases].sort((a, b) => {
      const dateA = a.preTrialPreliminary ? new Date(a.preTrialPreliminary) : new Date(8640000000000000); // Distant future if no date
      const dateB = b.preTrialPreliminary ? new Date(b.preTrialPreliminary) : new Date(8640000000000000);
      
      if (order === 'asc') {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    });
  
    setCases(sortedCases);
    setSortOrder(order);
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
        const allCases = querySnapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        }));
        
        // Filter out resolved cases
        const activeCases = allCases.filter(caseItem => caseItem.status !== 'Resolved');
        setCases(activeCases);
        
        // Check for due dates and show reminders
        checkDueDates(activeCases);
      } catch (error) {
        console.error('Error fetching cases: ', error);
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
    setReminders(remindersList);
  };

  // Calculate the number of days remaining from the pre-trial date
  const getDaysRemaining = (preTrialDate) => {
    if (!preTrialDate) return null;
    const today = new Date();
    const preTrial = new Date(preTrialDate);
    const timeDifference = preTrial.getTime() - today.getTime();
    return Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
  };

  // Determine the status color based on days remaining
  const getStatusColor = (preTrialDate) => {
    const daysRemaining = getDaysRemaining(preTrialDate);
    if (daysRemaining === null) return 'gray';
    if (daysRemaining > 7) return 'green';
    if (daysRemaining > 3) return 'yellow';
    if (daysRemaining >= 0) return 'red';
    return 'gray';
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

  const handleMarkAsDone = () => {
    if (selectedCases.length === 0) {
      toast.current.show({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please select cases to mark as done',
        life: 3000
      });
      return;
    }
  
    confirmDialog({
      message: `Are you sure you want to mark ${selectedCases.length} selected case(s) as done?`,
      header: 'Confirm Action',
      icon: 'pi pi-check-circle',
      accept: () => markCasesAsDone()
    });
  };  
  
  const markCasesAsDone = async () => {
    try {
      const batch = writeBatch(db);
      const today = serverTimestamp(); // Using server timestamp for consistency
  
      selectedCases.forEach(caseItem => {
        const caseRef = doc(db, 'CaseFile', caseItem.id);
        batch.update(caseRef, {
          status: 'Resolved',
          dateSubmittedForDecision: today,
          lastUpdated: today
        });
      });
  
      await batch.commit();
  
      // Update local state
      setCases(prevCases => 
        prevCases.filter(c => !selectedCases.some(s => s.id === c.id))
      );
      setSelectedCases([]);
  
      toast.current.show({
        severity: 'success',
        summary: 'Success',
        detail: `${selectedCases.length} case(s) marked as resolved`,
        life: 5000
      });
    } catch (error) {
      console.error('Case resolution error:', {
        error: error.message,
        stack: error.stack,
        cases: selectedCases.map(c => c.id)
      });
  
      toast.current.show({
        severity: 'error',
        summary: 'Operation Failed',
        detail: `Error: ${error.message}`,
        life: 7000
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

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
      toast.current.show({
        severity: 'error',
        summary: 'Logout Failed',
        detail: 'An error occurred while logging out. Please try again.',
        life: 3000
      });
    }
  };

  useEffect(() => {
    if (reminders.length > 0) {
      reminders.forEach(caseItem => {
        toast.current.show({
          severity: 'warn',
          summary: 'Upcoming Case Deadline',
          detail: `${caseItem.title} - ${getDaysRemaining(caseItem.preTrialPreliminary)} days remaining`,
          life: 5000
        });
      });
    }
  }, [reminders]);

  return (
    <div className={`dashboard-container ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Toast ref={toast} />
      <ConfirmDialog />

      {/* Fixed Sidebar */}
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
            label={isSidebarCollapsed ? "" : "Resolved Cases"}
            icon="pi pi-check-square"
            onClick={() => navigate('/resolved-cases')}
            className="sidebar-button"
            tooltip={isSidebarCollapsed ? "Resolved Cases" : null}
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

      {/* Main Content */}
      <div className={`main-content ${isSidebarCollapsed ? 'expanded' : ''}`}>
        <div className="documents-header">
          <div className="header-left">
            <h2>Civil Case Records</h2>
          </div>
          <div className="header-actions">
            <Button 
              icon="pi pi-eye" 
              className="p-button-text"
              tooltip="View Overview"
              onClick={() => selectedCases.length === 1 && navigate(`/case-overview/${selectedCases[0].id}`)}
              disabled={selectedCases.length !== 1}
            />

            <Button 
              icon="pi pi-bell" 
              className="p-button-text"
              tooltip="Reminders"
              onClick={toggleReminders}
              badge={reminders.length > 0 ? reminders.length.toString() : null}
              badgeClassName="p-badge-danger"
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
              //disabled={selectedCases.length === 0}  // This line needs to be removed
            />

            <Button 
              icon="pi pi-sort-amount-up-alt" 
              className="p-button-text"
              tooltip="Sort: Soonest First"
              onClick={() => sortCasesByDeadline('asc')}
            />
            <Button 
              icon="pi pi-sort-amount-down" 
              className="p-button-text"
              tooltip="Sort: Latest First"
              onClick={() => sortCasesByDeadline('desc')}
            />

            <Button 
              icon="pi pi-check-circle" 
              className="p-button-text"
              tooltip="Mark as Done"
              onClick={handleMarkAsDone}
              disabled={selectedCases.length === 0}
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
          <ul className="reminder-list">
            {reminders.map((reminder, index) => (
              <li key={index} className="reminder-item">
                <i className="pi pi-calendar reminder-icon"></i>
                <div className="reminder-content">
                  <strong>{reminder.title}</strong>
                  <span className="reminder-days">{getDaysRemaining(reminder.preTrialPreliminary)} days remaining</span>
                </div>
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