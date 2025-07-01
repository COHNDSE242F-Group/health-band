// PersonalDetails.js
import React from 'react';

const PersonalDetails = ({ patientData }) => {
  const personalInfo = patientData.personal_info || {};
  
  return (
    <div className="tab-content">
      <h3 className="text-xl font-semibold mb-4">Personal Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DetailItem label="Name" value={personalInfo.name} />
        <DetailItem label="Age" value={personalInfo.age} />
        <DetailItem label="Gender" value={personalInfo.gender} />
        <DetailItem label="Condition" value={personalInfo.medical_condition} />
        <DetailItem label="Contact" value={personalInfo.contact} />
        <DetailItem label="Address" value={personalInfo.address} />
      </div>
    </div>
  );
};

const DetailItem = ({ label, value }) => (
  <div className="detail-item">
    <span className="detail-label">{label}:</span>
    <span className="detail-value">{value || '-'}</span>
  </div>
);

export default PersonalDetails;