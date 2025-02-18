import React, { useState, useEffect } from 'react';
import { logoutUser } from "../firebase/authService";
import { useNavigate } from "react-router-dom";
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase-config';
import './css/Dashboard.css';
import logo_sq from './assets/LogoSquare.png'

const Dashboard = () => {
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);

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
      } catch (error) {
        console.error("Error fetching cases: ", error);
      }
    };

    fetchCases();
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
  };

  const handleCreateCase = () => {
    navigate("/create-case");
  };

  return (
    <div>
      <ul className="side">
        <div className="logo-sq"><img src={logo_sq} alt="logo" /></div>
      </ul>
      <div className="card" style={{ marginTop: '20px' }}>
        <DataTable
          value={cases}
          paginator
          rows={15}
          rowsPerPageOptions={[5, 10, 15, 50]}
          tableStyle={{ minWidth: '50rem' }}
          className="custom-data-table"
        >
          <Column field="title" header="Case Title" style={{ width: '20%' }}></Column>
          <Column field="caseNumber" header="Case Number" style={{ width: '15%' }}></Column>
          <Column field="assignedJudge" header="Judge" style={{ width: '15%' }}></Column>
          <Column field="dataField" header="Type" style={{ width: '15%' }}></Column>
          <Column field="hearing" header="Hearing Status" style={{ width: '15%' }}></Column>
          <Column field="nature" header="Nature" style={{ width: '20%' }}></Column>
        </DataTable>
      </div>

      <div style={{ marginTop: '20px' }}>
        <Button
          label="Create Case"
          onClick={handleCreateCase}
          className="p-button p-button-success"
          style={{ marginRight: '10px' }}
        />

        <Button
          label="Logout"
          onClick={handleLogout}
          className="custom-logout-button"
        />
      </div>
    </div>
  );
};

export default Dashboard;