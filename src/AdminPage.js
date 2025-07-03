import React from 'react';
import { useNavigate } from 'react-router-dom'; // import useNavigate
import './AdminPage.css';

export default function AdminPage()  {
  const navigate = useNavigate(); // create navigate function

  return (
    <div className="app-container">
      <section className="card">
        <h1 className="title">Welcome to Fit-Band</h1>
        <div className="button-group">
          <button className="btn btn-add" onClick={() => navigate('/admin-reg-doc')}>Add</button>
          <button className="btn btn-view" onClick={() => navigate('/view-doctors')}>View Registered Doctors</button>
          </div>
      </section>
    </div>
  );
}
