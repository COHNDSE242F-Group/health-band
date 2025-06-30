import React from 'react';
import './AddPatientForm.css';

const AddPatientForm = () => {
  return (
    <div className="add-patient-container">
      <h2>Add Patient</h2>
      <form className="add-patient-form">
  <input type="text" name="name" placeholder="Full Name" className="add-patient-input" />
  <input type="number" name="age" placeholder="Age" className="add-patient-input" />
  <select name="gender" className="add-patient-input">
    <option value="">Select Gender</option>
    <option value="Male">Male</option>
    <option value="Female">Female</option>
    
  </select>
  <input type="text" name="condition" placeholder="Condition" className="add-patient-input" />
  <input type="text" name="contact" placeholder="Contact Number" className="add-patient-input" />
  <input type="text" name="address" placeholder="Address" className="add-patient-input" />
  <textarea name="healthInfo" placeholder="Additional Health Info (optional)" className="add-patient-textarea"></textarea>
  <button type="submit" className="add-patient-button">Add Patient</button>
</form>

    </div>
  );
};

export default AddPatientForm;
