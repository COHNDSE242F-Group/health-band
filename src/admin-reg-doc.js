import React, { useState } from 'react';
import { database } from './firebase';
import { ref, push } from 'firebase/database';

function DoctorForm() {
  const [isRegistering, setIsRegistering] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    dob: '',
    phone: '',
    degree: '',
    specialty: '',
    license: '',
    experience: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (isRegistering) {
      const doctorRef = ref(database, 'doctors');
      push(doctorRef, formData)
        .then(() => alert('Doctor registered successfully'))
        .catch(err => alert('Error: ' + err.message));
    } else {
      // For now, just alert login (implement auth later)
      alert(`Logging in as ${formData.email}`);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc' }}>
      <h2>{isRegistering ? "Doctor's Registration" : 'Doctor Login'}</h2>

      <input
        type="email"
        placeholder="Email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        style={{ width: '100%', padding: '10px', margin: '10px 0' }}
      />

      <input
        type="password"
        placeholder="Password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        style={{ width: '100%', padding: '10px', margin: '10px 0' }}
      />

      {isRegistering && (
        <>
          <input placeholder="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} style={inputStyle} />
          <input type="date" name="dob" value={formData.dob} onChange={handleChange} style={inputStyle} />
          <input placeholder="Phone" name="phone" value={formData.phone} onChange={handleChange} style={inputStyle} />
          <input placeholder="Degree" name="degree" value={formData.degree} onChange={handleChange} style={inputStyle} />
          <input placeholder="Specialty" name="specialty" value={formData.specialty} onChange={handleChange} style={inputStyle} />
          <input placeholder="License Number" name="license" value={formData.license} onChange={handleChange} style={inputStyle} />
          <input type="number" placeholder="Experience (Years)" name="experience" value={formData.experience} onChange={handleChange} style={inputStyle} />
          {/* File uploads should be handled with Firebase Storage (not covered here) */}
        </>
      )}

      <button
        onClick={handleSubmit}
        style={{ width: '100%', padding: '10px', background: '#007bff', color: 'white', border: 'none' }}
      >
        {isRegistering ? 'Register' : 'Login'}
      </button>

      <button
        onClick={() => setIsRegistering(!isRegistering)}
        style={{ width: '100%', padding: '10px', marginTop: '10px', background: '#6c757d', color: 'white', border: 'none' }}
      >
        {isRegistering ? 'Already have an account? Login' : 'Need an account? Register'}
      </button>
    </div>
  );
}

const inputStyle = { width: '100%', padding: '10px', margin: '10px 0' };

export default DoctorForm;
