// CreateCase.jsx
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase/firebase-config';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Toast } from 'primereact/toast';
import './css/CreateCase.css';
import logo_sq from './assets/LogoSquare.png';

const CreateCase = () => {
  const navigate = useNavigate();
  const toast = useRef(null);
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

  const handleInputChange = (e, field) => {
    setCaseData({
      ...caseData,
      [field]: e.target.value
    });
  };

  const handleDateChange = (value, field) => {
    setCaseData({
      ...caseData,
      [field]: value
    });
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
      createdAt: new Date().toISOString() // Add creation timestamp
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
    <div>
      <Toast ref={toast} position="top-center" />
      
      <ul className="side">
        <div className="logo-sq"><img src={logo_sq} alt="logo" /></div>
      </ul>
      <div className="create-case-container">
        <h2>Create New Civil Case</h2>
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
            <InputText
              value={caseData.nature}
              onChange={(e) => handleInputChange(e, 'nature')}
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
              required
            />
          </div>

          <div className="form-field">
            <label>DATE OF INITIAL TRIAL</label>
            <Calendar
              value={caseData.dateOfInitialTrial}
              onChange={(e) => handleDateChange(e.value, 'dateOfInitialTrial')}
              dateFormat="yy-mm-dd"
              showIcon
              required
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
              required
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
  );
};

export default CreateCase;