import React from "react";
import PatientsList from "./components/PatientsList";
import Topbar from './Topbar';
import './App.css';

function App() {
  return (
    <div>
     <div className="app-container">
      <Topbar />
      <div className="main-content">
        <div className="hero-section">
          {/* Dark overlay for darkening */}
          <div className="overlay"></div>
          <div className="hero-text">
            <h1>Health Band</h1>
            <p>Future of health</p>
          </div>
        </div>
    </div>
  );
}

export default App;