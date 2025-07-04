import React, { useState } from 'react';
import './AddPatientForm.css';
import { database } from './firebase';
import { ref, push } from 'firebase/database';

const AddPatientForm = () => {
  const [patient, setPatient] = useState({
    name: '',
    age: '',
    gender: '',
    condition: '',
    contact: '',
    address: '',
    healthInfo: ''
  });

  const handleChange = (e) => {
    setPatient({ ...patient, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

  
    push(ref(database, 'patients/'), patient)
      .then(() => {
        alert('Patient added successfully!');
      
        setPatient({
          name: '',
          age: '',
          gender: '',
          condition: '',
          contact: '',
          address: '',
          healthInfo: ''
        });
      })
      .catch((error) => {
        console.error('Error adding patient: ', error);
        alert('Failed to add patient. Please try again.');
      });
  };

  return (
    <div className="add-patient-container">
      <h2>Add Patient</h2>
      <form className="add-patient-form" onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Full Name" value={patient.name} onChange={handleChange} className="add-patient-input" required />
        <input type="number" name="age" placeholder="Age" value={patient.age} onChange={handleChange} className="add-patient-input" required />
        <select name="gender" value={patient.gender} onChange={handleChange}  className="add-patient-input add-patient-select" required>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          
        </select>
        <input type="text" name="condition" placeholder="Condition" value={patient.condition} onChange={handleChange} className="add-patient-input" required />
        <input type="text" name="contact" placeholder="Contact Number" value={patient.contact} onChange={handleChange} className="add-patient-input" required />
        <input type="text" name="address" placeholder="Address" value={patient.address} onChange={handleChange} className="add-patient-input" required />
        <textarea name="healthInfo" placeholder="Additional Health Info (optional)" value={patient.healthInfo} onChange={handleChange} className="add-patient-textarea"></textarea>
        <button type="submit" className="add-patient-button">Add Patient</button>
      </form>
    </div>
  );
};

export default AddPatientForm;
