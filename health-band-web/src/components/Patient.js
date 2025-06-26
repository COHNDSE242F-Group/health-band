import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "./firebase";
import "../Patient.css";

export default function Patient({ id }) {
  const [patient, setPatient] = useState({});
  const [latestSensor, setLatestSensor] = useState({});
  const [updatedAt, setUpdatedAt] = useState("-");

  useEffect(() => {
    const patientRef = ref(database, `patients/${id}`);

    const unsubscribe = onValue(patientRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) return;

      setPatient(data.personal_info || {});

      const sensors = data.sensordata || {};
      const sensorEntries = Object.entries(sensors).sort(
        ([a], [b]) => Number(b) - Number(a)
      );

      const latestEntry = sensorEntries[0];
      if (latestEntry) {
        const [timestamp, sensorData] = latestEntry;
        setLatestSensor(sensorData);
        const date = new Date(Number(timestamp));
        setUpdatedAt(date.toLocaleString());
      }
    });

    return () => unsubscribe();
  }, [id]);

  return (
    <div className="patient-card">
      <div className="patient-header">
        <div className="patient-image">
          <img
            src={
              patient.imageUrl ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                patient.name || "Patient"
              )}&background=4f46e5&color=fff&size=128`
            }
            alt={patient.name}
          />
        </div>
        <div className="patient-info">
          <h2 className="patient-name">{patient.name}</h2>
          <p className="patient-age">Age: {patient.age}</p>
          <p className="patient-condition">{patient.medical_condition}</p>
        </div>
      </div>

      <div className="patient-stats">
        <div className="stat heart-rate">
          ❤️ Heart Rate: <span>{latestSensor.heart_rate ?? "-"}</span> bpm
        </div>
        <div className="stat oxygen-level">
          🩸 Oxygen Level: <span>{latestSensor.oxygenLevel ?? "-"}</span>%
        </div>
        <div className="stat temperature">
          🌡️ Temperature: <span>{latestSensor.temperature ?? "-"}</span> °C
        </div>
      </div>

      <div className="patient-updated">Last updated: {updatedAt}</div>
    </div>
  );
}