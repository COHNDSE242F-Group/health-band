// MedicalHistory.js
import React, { useState } from 'react';
import '../MedicalHistory.css';

export default function MedicalHistory() {
  const [records, setRecords] = useState([]);
  const [formData, setFormData] = useState({
    heartRate: 78, // fake default value
    bloodPressure: '120/80', // fake default value
    temperature: 36.7, // fake default value
    disease: '',
    situation: '',
    date: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setRecords([...records, formData]);
    setFormData({
      heartRate: 78,
      bloodPressure: '120/80',
      temperature: 36.7,
      disease: '',
      situation: '',
      date: ''
    });
  };

  return (
    <div className="medical-history-container">
      <h2>Medical History Entry</h2>
      <form className="medical-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Heart Rate (BPM):</label>
          <input type="number" name="heartRate" value={formData.heartRate} readOnly />
        </div>

        <div className="form-group">
          <label>Blood Pressure (mmHg):</label>
          <input type="text" name="bloodPressure" value={formData.bloodPressure} readOnly />
        </div>

        <div className="form-group">
          <label>Body Temperature (°C):</label>
          <input type="number" name="temperature" value={formData.temperature} readOnly />
        </div>

        <div className="form-group">
          <label>Disease:</label>
          <input type="text" name="disease" value={formData.disease} onChange={handleChange} placeholder="e.g. Diabetes, Cholesterol" required />
        </div>

        <div className="form-group">
          <label>Situation Description:</label>
          <textarea name="situation" value={formData.situation} onChange={handleChange} placeholder="Describe the health event or symptoms" required></textarea>
        </div>

        <div className="form-group">
          <label>Date:</label>
          <input type="date" name="date" value={formData.date} onChange={handleChange} required />
        </div>

        <button type="submit">Add to History</button>
      </form>

      <h3>Past Health Situations</h3>
      <table className="history-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Heart Rate</th>
            <th>Blood Pressure</th>
            <th>Temperature</th>
            <th>Disease</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record, index) => (
            <tr key={index}>
              <td>{record.date}</td>
              <td>{record.heartRate} bpm</td>
              <td>{record.bloodPressure}</td>
              <td>{record.temperature} °C</td>
              <td>{record.disease}</td>
              <td>{record.situation}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
