import React, { useState } from 'react';
import './AddPatientForm.css';
import { database } from './firebase';
import { ref, get, child, set } from 'firebase/database';

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

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setPatient({ ...patient, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!patient.name.trim()) {
      setErrorMessage('Please enter full name.');
      return false;
    }
    const ageNum = Number(patient.age);
    if (!patient.age || isNaN(ageNum) || ageNum <= 0) {
      setErrorMessage('Please enter a valid positive age.');
      return false;
    }
    if (!patient.gender) {
      setErrorMessage('Please select a gender.');
      return false;
    }
    if (!patient.condition.trim()) {
      setErrorMessage('Please enter the condition.');
      return false;
    }
    if (!patient.contact.trim()) {
      setErrorMessage('Please enter contact number.');
      return false;
    }
    const phonePattern = /^\d{10}$/;
    if (!phonePattern.test(patient.contact.trim())) {
      setErrorMessage('Please enter a valid contact number.');
      return false;
    }
    if (!patient.address.trim()) {
      setErrorMessage('Please enter address.');
      return false;
    }
    setErrorMessage('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      
      const patientsRef = ref(database, 'patients');
      const snapshot = await get(patientsRef);
      const patientsData = snapshot.val() || {};

      // Calculate max  ID
      const patientIDs = Object.keys(patientsData);
      let maxNum = 0;
      patientIDs.forEach(id => {
        const num = parseInt(id.replace('P', ''), 10);
        if (!isNaN(num) && num > maxNum) maxNum = num;
      });

    
      const newID = `P${String(maxNum + 1).padStart(3, '0')}`;

      
      const newPatientData = {
        personal_info: {
          name: patient.name,
          age: patient.age,
          gender: patient.gender,
          medical_condition: patient.condition,
          contact: patient.contact,
          address: patient.address,
          healthInfo: patient.healthInfo || ''
        },
        sensordata: {}
      };

      
      await set(child(patientsRef, newID), newPatientData);

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

      setErrorMessage('');
  } catch (error) {
    alert('Failed to add patient: ' + error.message);
  }
};

  return (
    <div className="add-patient-container">
      <h2>Add Patient</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      <form className="add-patient-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={patient.name}
          onChange={handleChange}
          className="add-patient-input"
          required
        />
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={patient.age}
          onChange={handleChange}
          className="add-patient-input"
          required
        />
        <select
          name="gender"
          value={patient.gender}
          onChange={handleChange}
          className="add-patient-input add-patient-select"
          required
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <input
          type="text"
          name="condition"
          placeholder="Condition"
          value={patient.condition}
          onChange={handleChange}
          className="add-patient-input"
          required
        />
        <input
          type="text"
          name="contact"
          placeholder="Contact Number"
          value={patient.contact}
          onChange={handleChange}
          className="add-patient-input"
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={patient.address}
          onChange={handleChange}
          className="add-patient-input"
          required
        />
        <textarea
          name="healthInfo"
          placeholder="Additional Health Info (optional)"
          value={patient.healthInfo}
          onChange={handleChange}
          className="add-patient-textarea"
        />
        <button type="submit" className="add-patient-button">
          Add Patient
        </button>
      </form>
    </div>
  );
};

export default AddPatientForm;
