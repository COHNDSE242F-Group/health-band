// PatientDetails/index.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ref, onValue } from 'firebase/database';
import { database } from './firebase';
import PersonalDetails from './PersonalDetails';
import HealthMonitoring from './HealthMonitoring';
import MedicalHistory from './MedicalHistory';
import VoiceConnect from './VoiceConnect';
import Treatments from './Treatments';
import '../Patient.css';

const PatientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('personal');
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const patientRef = ref(database, `patients/${id}`);
    
    const unsubscribe = onValue(patientRef, (snapshot) => {
      const data = snapshot.val();
      setPatientData(data || {});
      setLoading(false);
    });

    return () => unsubscribe();
  }, [id]);

  if (loading) return <div className="loading">Loading patient data...</div>;
  if (!patientData) return <div className="error">Patient not found</div>;

  const renderActiveTab = () => {
    const tabProps = { patientData };
    
    switch(activeTab) {
      case 'personal':
        return <PersonalDetails {...tabProps} />;
      case 'medical':
        return <MedicalHistory {...tabProps} />;
      case 'monitoring':
        return <HealthMonitoring {...tabProps} />;
      case 'voice':
        return <VoiceConnect {...tabProps} />;
      case 'treatments':
        return <Treatments {...tabProps} />;
      default:
        return <PersonalDetails {...tabProps} />;
    }
  };

  return (
    <div className="patient-details-container">
      <div className="sidebar">
        <div className="patient-details-header">
          <div className="patient-image">
            <img
              src={
                patientData.personal_info?.imageUrl ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  patientData.personal_info?.name || "Patient"
                )}&background=4f46e5&color=fff&size=128`
              }
              alt={patientData.personal_info?.name}
            />
          </div>
          <div className="patient-info">
            <h2>{patientData.personal_info?.name || "Patient"}</h2>
            <p>Patient ID: {id}</p>
          </div>
        </div>
        
        <nav className="side-nav">
          <button 
            className={`nav-item ${activeTab === 'personal' ? 'active' : ''}`}
            onClick={() => setActiveTab('personal')}
          >
            Personal Details
          </button>
          <button 
            className={`nav-item ${activeTab === 'medical' ? 'active' : ''}`}
            onClick={() => setActiveTab('medical')}
          >
            Medical History
          </button>
          <button 
            className={`nav-item ${activeTab === 'monitoring' ? 'active' : ''}`}
            onClick={() => setActiveTab('monitoring')}
          >
            Health Monitoring
          </button>
          <button 
            className={`nav-item ${activeTab === 'voice' ? 'active' : ''}`}
            onClick={() => setActiveTab('voice')}
          >
            Voice Connect
          </button>
          <button 
            className={`nav-item ${activeTab === 'treatments' ? 'active' : ''}`}
            onClick={() => setActiveTab('treatments')}
          >
            Treatments
          </button>
        </nav>
      </div>
      
      <div className="main-content">
        {renderActiveTab()}
      </div>
    </div>
  );
};

export default PatientDetails;