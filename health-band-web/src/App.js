import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PatientsList from "./components/PatientsList";
import Topbar from './components/Topbar';
import PatientManagement from './components/PatientManagement';
import Profile from './components/Profile';
import PatientDetails from './components/PatientDetails';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <Router>
      <div className="app-container">
        <Topbar activeTab={activeTab} setActiveTab={setActiveTab} />
        <Routes>
          <Route path="/" element={<PatientsList />} />
          <Route path="/patients" element={<PatientManagement />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/patients/:id" element={<PatientDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;