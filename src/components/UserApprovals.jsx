// components/UserApprovals.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { collection, getDocs, doc, query, where, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/firebase-config';
import { logoutUser } from '../firebase/authService';
import { useAdmin } from '../firebase/AdminContext';
import './css/UserApprovals.css';

const UserApprovals = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { isAdmin } = useAdmin();
  const toast = useRef(null);
  const [loading, setLoading] = useState(true);

  // Check if user is admin
  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  // Toggle sidebar function
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Fetch pending users
  useEffect(() => {
    const fetchPendingUsers = async () => {
      try {
        setLoading(true);
        // Query users where approved is false
        const q = query(collection(db, 'User'), where('approved', '==', false));
        const querySnapshot = await getDocs(q);
        
        const pendingUsers = [];
        querySnapshot.forEach((doc) => {
          pendingUsers.push({
            id: doc.id,
            ...doc.data()
          });
        });
        
        setUsers(pendingUsers);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users: ', error);
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load pending users',
          life: 3000
        });
        setLoading(false);
      }
    };

    fetchPendingUsers();
  }, []);

  const handleApproveUsers = () => {
    if (selectedUsers.length === 0) {
      toast.current.show({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please select users to approve',
        life: 3000
      });
      return;
    }

    confirmDialog({
      message: `Are you sure you want to approve ${selectedUsers.length} selected user(s)?`,
      header: 'Confirm Approval',
      icon: 'pi pi-check-circle',
      accept: () => approveSelectedUsers()
    });
  };

  const approveSelectedUsers = async () => {
    try {
      await Promise.all(
        selectedUsers.map(user => 
          setDoc(doc(db, 'User', user.id), {
            approved: true,
            approvedAt: serverTimestamp()
          }, { merge: true })
        )
      );

      // Update local state
      const updatedUsers = users.filter(
        user => !selectedUsers.some(selected => selected.id === user.id)
      );
      
      setUsers(updatedUsers);
      setSelectedUsers([]);

      toast.current.show({
        severity: 'success',
        summary: 'Success',
        detail: `${selectedUsers.length} user(s) approved successfully`,
        life: 3000
      });
    } catch (error) {
      console.error('Error approving users: ', error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to approve users',
        life: 3000
      });
    }
  };

  const handleRejectUsers = () => {
    if (selectedUsers.length === 0) {
      toast.current.show({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please select users to reject',
        life: 3000
      });
      return;
    }

    confirmDialog({
      message: `Are you sure you want to reject ${selectedUsers.length} selected user(s)?`,
      header: 'Confirm Rejection',
      icon: 'pi pi-exclamation-triangle',
      accept: () => rejectSelectedUsers()
    });
  };

  const rejectSelectedUsers = async () => {
    try {
      await Promise.all(
        selectedUsers.map(user => 
          setDoc(doc(db, 'User', user.id), {
            rejected: true,
            rejectedAt: serverTimestamp()
          }, { merge: true })
        )
      );

      // Update local state
      const updatedUsers = users.filter(
        user => !selectedUsers.some(selected => selected.id === user.id)
      );
      
      setUsers(updatedUsers);
      setSelectedUsers([]);

      toast.current.show({
        severity: 'success',
        summary: 'Success',
        detail: `${selectedUsers.length} user(s) rejected successfully`,
        life: 3000
      });
    } catch (error) {
      console.error('Error rejecting users: ', error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to reject users',
        life: 3000
      });
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      sessionStorage.removeItem('isAdmin');
      navigate('/');
    } catch (error) {
      console.error('Error during logout:', error);
      toast.current.show({
        severity: 'error',
        summary: 'Logout Failed',
        detail: 'An error occurred while logging out. Please try again.',
        life: 3000
      });
    }
  };

  // Format date for display
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  // Template for date columns
  const dateTemplate = (rowData, field) => {
    return formatDate(rowData[field]);
  };

  return (
    <div className={`dashboard-container ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Toast ref={toast} />
      <ConfirmDialog />
      
      {/* Sidebar */}
      <div className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="user-welcome">
          <div className="welcome-text">
            <span>Admin Panel</span>
          </div>
          
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
            label={isSidebarCollapsed ? "" : "User Approvals"}
            icon="pi pi-users"
            onClick={() => navigate('/user-approvals')}
            className="sidebar-button active"
            tooltip={isSidebarCollapsed ? "User Approvals" : null}
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
            <h2>User Approvals</h2>
          </div>
          <div className="header-actions">
            <Button 
              label="Approve Selected" 
              icon="pi pi-check" 
              className="p-button-success"
              onClick={handleApproveUsers}
              disabled={selectedUsers.length === 0}
            />
            <Button 
              label="Reject Selected" 
              icon="pi pi-times" 
              className="p-button-danger"
              onClick={handleRejectUsers}
              disabled={selectedUsers.length === 0}
            />
          </div>
        </div>
        
        <div className="card">
          <DataTable 
            value={users} 
            selection={selectedUsers} 
            onSelectionChange={(e) => setSelectedUsers(e.value)}
            dataKey="id"
            paginator 
            rows={10} 
            rowsPerPageOptions={[5, 10, 25]}
            className="custom-data-table"
            responsiveLayout="scroll"
            selectionMode="multiple"
            emptyMessage="No pending user approvals"
            loading={loading}
          >
            <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
            <Column field="email" header="Email" style={{ width: '25%' }} />
            <Column field="role" header="Role" style={{ width: '15%' }} />
            <Column 
              field="createdAt" 
              header="Registration Date" 
              body={(rowData) => dateTemplate(rowData, 'createdAt')}
              style={{ width: '20%' }}
            />
            <Column 
              field="approved" 
              header="Status" 
              body={() => <span className="user-status pending">Pending Approval</span>}
              style={{ width: '20%' }}
            />
          </DataTable>
        </div>
      </div>
    </div>
  );
};

export default UserApprovals;