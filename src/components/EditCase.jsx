import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
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
  const { id } = useParams();
  const [formData, setFormData] = useState({
    civilCaseNo: '',
    title: '',
    nature: '',
    dateFiledRaffled: '',
    preTrialPreliminary: '',
    dateOfInitialTrial: '',
    lastTrialCourtAction: '',
    dateSubmittedForDecision: '',
    judgeAssigned: '',
    // Add other fields here
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };



  useEffect(() => {
    const fetchCaseDetails = async () => {
      try {
        const caseRef = doc(db, 'CaseFile', id);
        const caseSnap = await getDoc(caseRef);
        if (caseSnap.exists()) {
          const data = caseSnap.data();
          setFormData({
            civilCaseNo: data.civilCaseNo || '',
            title: data.title || '',
            nature: data.nature || '',
            dateFiledRaffled: data.dateFiledRaffled || '',
            preTrialPreliminary: data.preTrialPreliminary || '',
            dateOfInitialTrial: data.dateOfInitialTrial || '',
            lastTrialCourtAction: data.lastTrialCourtAction || '',
            dateSubmittedForDecision: data.dateSubmittedForDecision || '',
            judgeAssigned: data.judgeAssigned || '',
            // You can set other fields as needed
          });
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
    { name: 'Accion Publiciana/Ejectment' },
    { name: 'Quieting of Title/Reconveyance of Property' },
    { name: "Recovery of Possession, Damages and Attorney's Fees" }
  ];

  const handleNatureChange = (e, field) => {
    const selectedName = e.value.name; // cleaner!
    setSelectedNature(e.value); // Update selected dropdown value
    setFormData(prev => ({
      ...prev,
      [field]: selectedName
    }));
  };

  const handleLogout = async () => {
    await logoutUser();
    navigate('/');
  };

  const formatDate = (date) => {
    return date ? new Date(date).toISOString() : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const caseRef = doc(db, 'CaseFile', id);

      const formattedDateFiledRaffled = formatDate(formData.dateFiledRaffled);
      const formattedPreTrialPreliminary = formatDate(formData.preTrialPreliminary);
      const formattedDateOfInitialTrial = formatDate(formData.dateOfInitialTrial);
      const formattedDateSubmittedForDecision = formatDate(formData.dateSubmittedForDecision);

      await updateDoc(caseRef, {
        civilCaseNo: formData.civilCaseNo,  // Use formData.civilCaseNo
        title: formData.title,
        nature: formData.nature,
        dateFiledRaffled: formattedDateFiledRaffled,
        preTrialPreliminary: formattedPreTrialPreliminary,
        dateOfInitialTrial: formattedDateOfInitialTrial,
        lastTrialCourtAction: formData.lastTrialCourtAction,
        dateSubmittedForDecision: formattedDateSubmittedForDecision,
        judgeAssigned: formData.judgeAssigned,
        // Add other fields here if you're editing more than just civilCaseNo
      });

      toast.current.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Case updated successfully!'
      });

      setTimeout(() => navigate('/caserecords'), 1500); // Redirect after a short delay
    } catch (error) {
      console.error('Error updating case:', error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to update case.'
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
            <h2>Edit Civil Case</h2>
          </div>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="case-form">
            <div className="form-field">
              <label>CIVIL CASE NO.</label>
              <InputText
                name="civilCaseNo"
                value={formData.civilCaseNo}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label>TITLE</label>
              <InputText
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label>NATURE</label>
              <Dropdown
                name="nature"
                value={natures.find(option => option.name === formData.nature) || null}
                onChange={(e) => handleNatureChange(e, 'nature')}
                options={natures}
                optionLabel="name"
                placeholder="Select a Nature"
                className="natureofcase"

              />
            </div>

            <div className="form-field">
              <label>DATE FILED/RAFFLED</label>
              <Calendar
                name="dateFiledRaffled"
                value={formData.dateFiledRaffled}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  dateFiledRaffled: e.value // `e.value` is a Date object
                }))}
                dateFormat="yy-mm-dd"
                placeholder={formData.dateFiledRaffled}
                showIcon
              />
            </div>

            <div className="form-field">
              <label>PRE-TRIAL/PRELIMINARY</label>
              <Calendar
                name="preTrialPreliminary"
                value={formData.preTrialPreliminary}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  preTrialPreliminary: e.value // `e.value` is a Date object
                }))}
                dateFormat="yy-mm-dd"
                placeholder={formData.preTrialPreliminary}
                showIcon
              />
            </div>

            <div className="form-field">
              <label>DATE OF INITIAL TRIAL</label>
              <Calendar
                name="dateOfInitialTrial"
                value={formData.dateOfInitialTrial}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  dateOfInitialTrial: e.value // `e.value` is a Date object
                }))}
                dateFormat="yy-mm-dd"
                placeholder={formData.dateOfInitialTrial}
                showIcon
              />
            </div>

            <div className="form-field">
              <label>LAST TRIAL/COURT ACTION TAKEN AND DATE THEREOF</label>
              <InputText
                name="lastTrialCourtAction"
                value={formData.lastTrialCourtAction}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label>DATE SUBMITTED FOR DECISION</label>
              <Calendar
                name="dateSubmittedForDecision"
                value={formData.dateSubmittedForDecision}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  dateSubmittedForDecision: e.value // `e.value` is a Date object
                }))}
                dateFormat="yy-mm-dd"
                placeholder={formData.dateSubmittedForDecision}
                showIcon
              />
            </div>

            <div className="form-field">
              <label>JUDGE TO WHOM CASE IS ASSIGNED</label>
              <InputText
                name="judgeAssigned"
                value={formData.judgeAssigned}
                onChange={handleChange}
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