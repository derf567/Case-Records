// CreateCase.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase/firebase-config';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import './css/CreateCase.css';
import logo_sq from './assets/LogoSquare.png'

const CreateCase = () => {
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState({
    casenumber: '',
    title: '',
    nature: '',
    raffled: '',
    pretrial: '',
    initialtrial: '',
    lastrial: '',
    datesubmitted: '',
    judge: '',
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
      alert('Case created successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating case: ', error);
      alert('Error creating case');
    }
  };

  return (
    <div>
      <ul className="side">
        <div className="logo-sq"><img src={logo_sq} alt="logo" /></div>
      </ul>
      <div className="create-case-container">
        <h2>Create New Case</h2>
        <form onSubmit={handleSubmit} className="case-form">
          <div className="form-field">
            <label>CIVIL CASE NO.</label>
            <InputText
              value={caseData.casenumber}
              onChange={(e) => handleInputChange(e, 'CIVIL CASE NO.')}
              required
            />
          </div>

          <div className="form-field">
            <label>TITLE</label>
            <InputText
              value={caseData.title}
              onChange={(e) => handleInputChange(e, 'TITLE')}
              required
            />
          </div>

          <div className="form-field">
            <label>NATURE</label>
            <InputText
              value={caseData.nature}
              onChange={(e) => handleInputChange(e, 'NATURE')}
              required
            />
          </div>

          <div className="form-field">
            <label>Date Filed/Raffled</label>
            <InputText
              value={caseData.raffled}
              onChange={(e) => handleInputChange(e, 'Date Filed/Raffled')}
              required
            />
          </div>

          <div className="form-field">
            <label>Pre-Trial/Preliminary</label>
            <Calendar
              value={caseData.pretrial}
              onChange={(e) => handleInputChange(e, 'Pre-Trial/Preliminary')}
              dateFormat="yy-mm-dd"
              required
            />
          </div>

          <div className="form-field">
            <label>Date of Initial Trial</label>
            <InputText
              value={caseData.initialtrial}
              onChange={(e) => handleInputChange(e, 'Date of Initial Trial')}
              required
            />
          </div>

          <div className="form-field">
            <label>Last Trial/ Court Action Taken and Date Thereof**</label>
            <InputText
              value={caseData.lastrial}
              onChange={(e) => handleInputChange(e, 'Last Trial/ Court Action Taken and Date Thereof**')}
              required
            />
          </div>

          
          <div className="form-field">
            <label>Date Submitted for Decision</label>
            <InputText
              value={caseData.datesubmitted}
              onChange={(e) => handleInputChange(e, 'Date Submitted for Decision')}
              required
            />
          </div>

          <div className="form-field">
            <label>Judge to Whom Case is Assigned***</label>
            <InputText
              value={caseData.judge}
              onChange={(e) => handleInputChange(e, 'Judge to Whom Case is Assigned***')}
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