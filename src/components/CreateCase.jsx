// CreateCase.jsx
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase/firebase-config';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast'; // Import Toast component
import './css/CreateCase.css';
import logo_sq from './assets/LogoSquare.png'

const CreateCase = () => {
  const navigate = useNavigate();
  const toast = useRef(null); // Create a reference for the Toast component
  const [caseData, setCaseData] = useState({
    assignedJudge: '',
    caseNumber: '',
    dataField: '',
    trialDate: null,
    hearing: '',
    nature: '',
    title: ''
  });

  const hearingOptions = [
    { label: 'Overdue', value: 'Overdue' },
    { label: 'Due Soon', value: 'Due Soon' },
    { label: 'On Track', value: 'On Track' }
  ];

  const dataFieldOptions = [
    { label: 'Criminal', value: 'Criminal' },
    { label: 'Civil', value: 'Civil' },
    { label: 'Family', value: 'Family' }
  ];

  const handleInputChange = (e, field) => {
    setCaseData({
      ...caseData,
      [field]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'CaseFile'), {
        ...caseData,
        trialDate: caseData.trialDate?.toISOString() || null
      });
      
      // Show success toast message
      toast.current.show({
        severity: 'success',
        summary: 'Success',
        detail: 'The case has been submitted. Thank you.',
        life: 3000
      });
      
      // Navigate after a short delay to allow the user to see the message
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
      
    } catch (error) {
      console.error('Error creating case: ', error);
      
      // Show error toast message
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Error creating case. Please try again.',
        life: 3000
      });
    }
  };

  return (
    <div>
      {/* Toast component for displaying messages */}
      <Toast ref={toast} position="top-center" />
      
      <ul className="side">
        <div className="logo-sq"><img src={logo_sq} alt="logo" /></div>
      </ul>
      <div className="create-case-container">
        <h2>Create New Case</h2>
        <form onSubmit={handleSubmit} className="case-form">
          <div className="form-field">
            <label>Title</label>
            <InputText
              value={caseData.title}
              onChange={(e) => handleInputChange(e, 'title')}
              required
            />
          </div>

          <div className="form-field">
            <label>Case Number</label>
            <InputText
              value={caseData.caseNumber}
              onChange={(e) => handleInputChange(e, 'caseNumber')}
              required
            />
          </div>

          <div className="form-field">
            <label>Assigned Judge</label>
            <InputText
              value={caseData.assignedJudge}
              onChange={(e) => handleInputChange(e, 'assignedJudge')}
              required
            />
          </div>

          <div className="form-field">
            <label>Data Field</label>
            <Dropdown
              value={caseData.dataField}
              options={dataFieldOptions}
              onChange={(e) => handleInputChange(e, 'dataField')}
              placeholder="Select Data Field"
              required
            />
          </div>

          <div className="form-field">
            <label>Trial Date</label>
            <Calendar
              value={caseData.trialDate}
              onChange={(e) => handleInputChange(e, 'trialDate')}
              dateFormat="yy-mm-dd"
              required
            />
          </div>

          <div className="form-field">
            <label>Hearing Status</label>
            <Dropdown
              value={caseData.hearing}
              options={hearingOptions}
              onChange={(e) => handleInputChange(e, 'hearing')}
              placeholder="Select Hearing Status"
              required
            />
          </div>

          <div className="form-field">
            <label>Nature of Case</label>
            <InputText
              value={caseData.nature}
              onChange={(e) => handleInputChange(e, 'nature')}
              required
            />
          </div>

          <div className="button-container">
            <Button label="Submit" type="submit" className="p-button-success" />
            <Button
              label="Cancel"
              onClick={() => navigate('/dashboard')}
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