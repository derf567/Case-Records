import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase-config';
import { Button } from 'primereact/button';
import './css/CaseOverview.css';

const CaseOverview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [caseDetails, setCaseDetails] = useState(null);

  useEffect(() => {
    const fetchCaseDetails = async () => {
      try {
        const caseRef = doc(db, 'CaseFile', id);
        const caseSnap = await getDoc(caseRef);
        if (caseSnap.exists()) {
          setCaseDetails(caseSnap.data());
        } else {
          console.error('No such case found!');
        }
      } catch (error) {
        console.error('Error fetching case details:', error);
      }
    };

    fetchCaseDetails();
  }, [id]);

  if (!caseDetails) {
    return <p>Loading case details...</p>;
  }

  return (
    <div className="case-overview">
      <h2>Case Overview</h2>
      <p><strong>Civil Case No:</strong> {caseDetails.civilCaseNo}</p>
      <p><strong>Title:</strong> {caseDetails.title}</p>
      <p><strong>Nature:</strong> {caseDetails.nature}</p>
      <p><strong>Date Filed/Raffled:</strong> {caseDetails.dateFiledRaffled}</p>
      <p><strong>Pre-Trial/PRELIMINARY:</strong> {caseDetails.preTrialPreliminary}</p>
      <p><strong>Initial Trial Date:</strong> {caseDetails.dateOfInitialTrial}</p>
      <p><strong>Last Court Action:</strong> {caseDetails.lastTrialCourtAction}</p>
      <p><strong>Submitted for Decision:</strong> {caseDetails.dateSubmittedForDecision}</p>
      <p><strong>Judge Assigned:</strong> {caseDetails.judgeAssigned}</p>

      <Button label="Back to Case Records" onClick={() => navigate('/caserecords')} />
    </div>
  );
};

export default CaseOverview;
