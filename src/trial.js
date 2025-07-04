import { useState } from 'react';
import { auth, storage } from './firebase'; // make sure storage is exported from firebase.js
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

function AuthComponent() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [fullname, setFullname] = useState('');
  const [dob, setDob] = useState('');
  const [phone, setPhone] = useState('');
  const [degree, setDegree] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [license, setLicense] = useState('');
  const [experience, setExperience] = useState('');
  const [cvFile, setCvFile] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      alert('Logged in as: ' + userCred.user.email);
    } catch (error) {
      alert('Login failed: ' + error.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCred.user.uid;
      const db = getDatabase();

      let cvURL = 'N/A';
      if (cvFile) {
        const fileRef = storageRef(storage, `cvs/${uid}/${cvFile.name}`);
        await uploadBytes(fileRef, cvFile);
        cvURL = await getDownloadURL(fileRef);
      }

      await set(ref(db, 'doctors/' + uid), {
        fullname,
        email,
        dob,
        phone,
        degree,
        specialty,
        license,
        experience: `${experience} yrs`,
        cvURL,
        createdAt: new Date().toISOString()
      });

      alert('Registration successful!');
      setIsRegistering(false);
    } catch (error) {
      alert('Registration failed: ' + error.message);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc' }}>
      <h2>{isRegistering ? 'Doctor Registration' : 'Doctor Login'}</h2>
      <form onSubmit={isRegistering ? handleRegister : handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={inputStyle}
        />

        {isRegistering && (
          <>
            <input
              placeholder="Full Name"
              value={fullname}
              onChange={e => setFullname(e.target.value)}
              required
              style={inputStyle}
            />
            <input
              type="date"
              value={dob}
              onChange={e => setDob(e.target.value)}
              required
              style={inputStyle}
            />
            <input
              placeholder="Phone"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              required
              style={inputStyle}
            />
            <input
              placeholder="Degree"
              value={degree}
              onChange={e => setDegree(e.target.value)}
              required
              style={inputStyle}
            />
            <input
              placeholder="Specialty"
              value={specialty}
              onChange={e => setSpecialty(e.target.value)}
              required
              style={inputStyle}
            />
            <input
              placeholder="License Number"
              value={license}
              onChange={e => setLicense(e.target.value)}
              required
              style={inputStyle}
            />
            <input
              type="number"
              placeholder="Experience (Years)"
              value={experience}
              onChange={e => setExperience(e.target.value)}
              required
              style={inputStyle}
            />
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={e => setCvFile(e.target.files[0])}
              style={{ margin: '10px 0' }}
            />
          </>
        )}

        <button type="submit" style={buttonStylePrimary}>
          {isRegistering ? 'Register' : 'Login'}
        </button>

        <button type="button" onClick={() => setIsRegistering(!isRegistering)} style={buttonStyleSecondary}>
          {isRegistering ? 'Already have an account? Login' : 'Need an account? Register'}
        </button>
      </form>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '10px',
  margin: '10px 0'
};

const buttonStylePrimary = {
  width: '100%',
  padding: '10px',
  background: '#007bff',
  color: 'white',
  border: 'none'
};

const buttonStyleSecondary = {
  width: '100%',
  padding: '10px',
  marginTop: '10px',
  background: '#6c757d',
  color: 'white',
  border: 'none'
};

export default AuthComponent;
