import React, { useState, useEffect } from 'react';
import { database } from './firebase';
import { ref, onValue } from 'firebase/database';

const thStyle = {
  padding: '10px',
  border: '1px solid #ddd',
  textAlign: 'left'
};

const tdStyle = {
  padding: '8px',
  border: '1px solid #ddd'
};

function AdminViewData() {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const doctorsRef = ref(database, 'doctors');

    onValue(doctorsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const doctorArray = Object.values(data);
        setDoctors(doctorArray);
      }
    });
  }, []);

  return (
    <div style={{ padding: '30px' }}>
      <h2>Registered Doctors</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ background: '#f2f2f2' }}>
            <th style={thStyle}>Full Name</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Phone</th>
            <th style={thStyle}>Degree</th>
            <th style={thStyle}>Specialty</th>
            <th style={thStyle}>License</th>
            <th style={thStyle}>Experience</th>
            <th style={thStyle}>DOB</th>
            <th style={thStyle}>CV</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((doc, idx) => (
            <tr key={idx}>
              <td style={tdStyle}>{doc.fullname}</td>
              <td style={tdStyle}>{doc.email}</td>
              <td style={tdStyle}>{doc.phone}</td>
              <td style={tdStyle}>{doc.degree}</td>
              <td style={tdStyle}>{doc.specialty}</td>
              <td style={tdStyle}>{doc.license}</td>
              <td style={tdStyle}>{doc.experience} yrs</td>
              <td style={tdStyle}>{doc.dob}</td>
              <td style={tdStyle}>{doc.cvFilename || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminViewData;
