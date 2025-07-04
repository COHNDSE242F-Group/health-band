import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "./firebase";
import Patient from "./Patient";
import "../Patient.css";

export default function PatientsList() {
  const [patients, setPatients] = useState({});

  useEffect(() => {
    const patientsRef = ref(database, "patients");

    onValue(patientsRef, (snapshot) => {
      const data = snapshot.val();
      console.log("Firebase data:", data);
      setPatients(data || {});
    });
  }, []);

  return (
    <div className="patients-list-container bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-900 pt-8">
        Patient Health Monitor
      </h1>
      <div className="patients-grid-container">
        {Object.keys(patients).map((id) => (
          <Patient key={id} id={id} />
        ))}
      </div>
    </div>
  );
}