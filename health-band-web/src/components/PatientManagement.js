import React from 'react';
import AddPatientForm from './AddPatientForm';   
import './AddPatientForm.css'; 

const PatientManagement = () => {
  return (
    <div className="patient-management-container">
      <h1>Patient Management</h1>

           <AddPatientForm />
         

      
    </div>
  );
};

export default PatientManagement;