// AdminViewData.jsx
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';

export default function AdminViewData() {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setDoctors(data);
      } catch (error) {
        console.error("Error fetching doctor data:", error.message);
      }
    };

    fetchDoctors();
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

const thStyle = {
  padding: '10px',
  border: '1px solid #ddd',
  textAlign: 'left'
};

const tdStyle = {
  padding: '8px',
  border: '1px solid #ddd'
};
