import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase-config';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import './css/CaseRecords.css';

const ResolvedCases = () => {
  const navigate = useNavigate();
  const [resolvedCases, setResolvedCases] = useState([]);
  const [selectedCases, setSelectedCases] = useState([]);
  const toast = useRef(null);
  
  useEffect(() => {
    fetchResolvedCases();
  }, []);

  const fetchResolvedCases = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'CaseFile'));
      const casesList = querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      
      // Filter only resolved cases
      const resolved = casesList.filter(caseItem => caseItem.status === 'Resolved');
      setResolvedCases(resolved);
    } catch (error) {
      console.error('Error fetching resolved cases: ', error);
    }
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
  
  const handleReactivateCase = () => {
    if (selectedCases.length === 0) {
      toast.current.show({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please select cases to reactivate',
        life: 3000
      });
      return;
    }
  
    confirmDialog({
      message: `Are you sure you want to reactivate ${selectedCases.length} selected case(s)?`,
      header: 'Confirm Reactivation',
      icon: 'pi pi-question-circle',
      accept: () => reactivateCases()
    });
  };
  
  const reactivateCases = async () => {
    try {
      await Promise.all(
        selectedCases.map(caseItem => 
          updateDoc(doc(db, 'CaseFile', caseItem.id), {
            status: 'Active'
          })
        )
      );
  
      // Update local state
      const updatedCases = resolvedCases.filter(
        caseItem => !selectedCases.some(selected => selected.id === caseItem.id)
      );
  
      setResolvedCases(updatedCases);
      setSelectedCases([]);
  
      toast.current.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Cases reactivated successfully',
        life: 3000
      });
    } catch (error) {
      console.error("Error reactivating cases: ", error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: `Failed to reactivate cases: ${error.message}`,
        life: 3000
      });
    }
  };

  return (
    <div className="main-content expanded">
      <Toast ref={toast} />
      <ConfirmDialog />
      
      <div className="documents-header">
        <div className="header-left">
          <h2>Resolved Cases</h2>
        </div>
        <div className="header-actions">
          <Button 
            icon="pi pi-refresh" 
            className="p-button-text"
            tooltip="Reactivate Case"
            onClick={handleReactivateCase}
            disabled={selectedCases.length === 0}
          />
          <Button 
            label="Back to Active Cases"
            icon="pi pi-arrow-left"
            className="p-button-secondary"
            onClick={() => navigate('/caserecords')}
          />
        </div>
      </div>

      <div className="card">
        <DataTable
          value={resolvedCases}
          selection={selectedCases}
          onSelectionChange={e => setSelectedCases(e.value)}
          dataKey="id"
          paginator
          rows={15}
          rowsPerPageOptions={[5, 10, 15, 50]}
          className="custom-data-table"
          responsiveLayout="scroll"
          selectionMode="multiple"
          emptyMessage="No resolved cases found"
        >
          <Column 
            selectionMode="multiple" 
            headerStyle={{ width: '3rem' }}
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
  );
};

export default ResolvedCases;