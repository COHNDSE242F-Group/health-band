import React, { useState } from 'react';
import './MedicalHistory.css';

export default function MedicalHistory() {
  const [records, setRecords] = useState([]);
  const [formData, setFormData] = useState({
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
          <label>Disease:</label>
          <input
            type="text"
            name="disease"
            value={formData.disease}
            onChange={handleChange}
            placeholder="e.g. Diabetes, Cholesterol"
            required
          />
        </div>

        <div className="form-group">
          <label>Situation Description:</label>
          <textarea
            name="situation"
            value={formData.situation}
            onChange={handleChange}
            placeholder="Describe the health event or symptoms"
            required
          />
        </div>

        <div className="form-group">
          <label>Date:</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">Add to History</button>
      </form>

      <h3>Past Health Situations</h3>
      <table className="history-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Disease</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record, index) => (
            <tr key={index}>
              <td>{record.date}</td>
              <td>{record.disease}</td>
              <td>{record.situation}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
