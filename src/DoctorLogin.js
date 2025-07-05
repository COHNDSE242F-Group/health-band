import React, { useState } from 'react';
import { database } from './firebase';
import { ref, get, child } from 'firebase/database';
import { useNavigate } from 'react-router-dom'; // For redirecting after login

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const doctorsRef = ref(database, 'doctors');
    try {
      const snapshot = await get(doctorsRef);
      if (snapshot.exists()) {
        const doctorsData = snapshot.val();

        // Loop through all doctor records to find matching email
        const doctorEntries = Object.entries(doctorsData);
        const found = doctorEntries.find(([key, doc]) => doc.email === email);

        if (!found) {
          alert('No account found with this email.');
          return;
        }

        const [doctorId, doctor] = found;

        if (doctor.password === password) {
          alert('Login successful!');
          // Optional: Store session info in localStorage or context
          localStorage.setItem('doctorId', doctorId);
          navigate('/patientlist'); // 🔁 Redirect
        } else {
          alert('Incorrect password. Try again.');
        }
      } else {
        alert('No doctors registered yet.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Something went wrong during login.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Login</h2>
        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label htmlFor="email" style={styles.label}>Email</label>
            <input
              type="email"
              id="email"
              style={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="password" style={styles.label}>Password</label>
            <input
              type="password"
              id="password"
              style={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" style={styles.button}>Sign In</button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: '100vh',
    backgroundColor: '#f4f6f8',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px',
  },
  heading: {
    marginBottom: '30px',
    textAlign: 'center',
    color: '#333',
  },
  inputGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '6px',
    color: '#555',
    fontSize: '14px',
    fontWeight: '500',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '15px',
  },
  button: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '10px',
  },
};
