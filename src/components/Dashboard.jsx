import React from 'react';
import { logoutUser } from "../firebase/authService";
import { useNavigate } from "react-router-dom";
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column'; 
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase/firebase-config';
import './css/Dashboard.css'; // Import your CSS file

const Dashboard = () => {
  const navigate = useNavigate();

  // Dummy data to be submitted
  const dummyData = {
    assignedJudge: 'Fred',
    caseNumber: '123',
    dataField: 'Criminal',
    trialDate: '2025-02-11',
    hearing: 'Pending',
    nature: 'Theft',
    title: 'State vs John Doe'
  };

  // Handle Logout
  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
  };

  // Submit dummy data to Firestore
  const handleSubmit = async () => {
    try {
      // Add dummy data to the Firestore "CaseFile" collection
      await addDoc(collection(db, 'CaseFile'), dummyData);

      alert('Case data has been submitted successfully!');
    } catch (error) {
      console.error('Error adding document: ', error);
      alert('Error submitting data');
    }
  };

  // Static data for demonstration
  const customers = [
    { id: 1, name: 'John Doe', country: { name: 'USA' }, company: 'Company A', representative: { name: 'Rep A' } },
    { id: 2, name: 'Jane Smith', country: { name: 'Canada' }, company: 'Company B', representative: { name: 'Rep B' } },
    { id: 3, name: 'Michael Johnson', country: { name: 'UK' }, company: 'Company C', representative: { name: 'Rep C' } },
    { id: 4, name: 'Emily Davis', country: { name: 'Australia' }, company: 'Company D', representative: { name: 'Rep D' } },
    { id: 5, name: 'Chris Brown', country: { name: 'Germany' }, company: 'Company E', representative: { name: 'Rep E' } },
    { id: 6, name: 'Chris Brown', country: { name: 'Germany' }, company: 'Company E', representative: { name: 'Rep E' } },
    { id: 7, name: 'Chris Brown', country: { name: 'Germany' }, company: 'Company E', representative: { name: 'Rep E' } },
    { id: 8, name: 'Chris Brown', country: { name: 'Germany' }, company: 'Company E', representative: { name: 'Rep E' } },
    { id: 9, name: 'Chris Brown', country: { name: 'Germany' }, company: 'Company E', representative: { name: 'Rep E' } },
    { id: 10, name: 'Chris Brown', country: { name: 'Germany' }, company: 'Company E', representative: { name: 'Rep E' } },
    { id: 11, name: 'Chris Brown', country: { name: 'Germany' }, company: 'Company E', representative: { name: 'Rep E' } },
    { id: 12, name: 'Chris Brown', country: { name: 'Germany' }, company: 'Company E', representative: { name: 'Rep E' } },
    { id: 13, name: 'Chris Brown', country: { name: 'Germany' }, company: 'Company E', representative: { name: 'Rep E' } },
    { id: 14, name: 'Chris Brown', country: { name: 'Germany' }, company: 'Company E', representative: { name: 'Rep E' } },
    { id: 15, name: 'Chris Brown', country: { name: 'Germany' }, company: 'Company E', representative: { name: 'Rep E' } },
  ];

  return (
    <div>
      <h2>Dashboard</h2>

      <div className="card" style={{ marginTop: '20px' }}>
        <DataTable 
          value={customers} 
          paginator 
          rows={15} 
          rowsPerPageOptions={[5, 10, 15, 50]} 
          tableStyle={{ minWidth: '50rem' }} 
          className="custom-data-table" // Custom class for styling
        >
          <Column field="name" header="Name" style={{ width: '25%' }}></Column>
          <Column field="country.name" header="Country" style={{ width: '25%' }}></Column>
          <Column field="company" header="Company" style={{ width: '25%' }}></Column>
          <Column field="representative.name" header="Representative" style={{ width: '25%' }}></Column>
        </DataTable>
      </div>

      <div style={{ marginTop: '20px' }}>
        {/* Button to submit the dummy case data */}
        <Button
          label="Submit Case Data"
          onClick={handleSubmit}
          className="p-button p-button-success"
          style={{ marginRight: '10px' }} // Optional margin for spacing
        />

        {/* Button to log out */}
        <Button
          label="Logout"
          onClick={handleLogout}
          className="custom-logout-button" // Use your custom class
        />
      </div>
    </div>
  );
};

export default Dashboard;
