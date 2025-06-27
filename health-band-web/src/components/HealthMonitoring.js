// HealthMonitoring.js
import React, { useEffect, useRef, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from './firebase';
import { Chart, registerables } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import 'chartjs-adapter-date-fns';
import { useParams } from 'react-router-dom';
import '../Patient.css';

// Register Chart.js components
Chart.register(...registerables, zoomPlugin);

const HealthMonitoring = () => {
  const { id } = useParams();
  const [sensorData, setSensorData] = useState([]);
  const heartRateChartRef = useRef(null);
  const bpChartRef = useRef(null);
  const tempChartRef = useRef(null);

  const heartRateChartInstance = useRef(null);
  const bpChartInstance = useRef(null);
  const tempChartInstance = useRef(null);

  // Chart configuration
  const createChartConfig = (label, color, isDualAxis = false) => ({
    type: 'line',
    data: {
      datasets: isDualAxis
        ? [
            {
              label: 'Systolic',
              borderColor: '#10b981',
              backgroundColor: '#10b98120',
              borderWidth: 2,
              pointRadius: 2,
              fill: true,
              data: []
            },
            {
              label: 'Diastolic',
              borderColor: '#6366f1',
              backgroundColor: '#6366f120',
              borderWidth: 2,
              pointRadius: 2,
              fill: true,
              data: []
            }
          ]
        : [
            {
              label,
              borderColor: color,
              backgroundColor: `${color}20`,
              borderWidth: 2,
              pointRadius: 2,
              fill: true,
              data: []
            }
          ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'minute',
            tooltipFormat: 'PPpp'
          },
          grid: {
            display: false
          }
        },
        y: {
          beginAtZero: false,
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          }
        }
      },
      plugins: {
        zoom: {
          pan: {
            enabled: true,
            mode: 'x'
          },
          zoom: {
            wheel: {
              enabled: true
            },
            pinch: {
              enabled: true
            },
            mode: 'x'
          }
        },
        legend: {
          display: true,
          labels: {
            color: 'white'
          }
        },
        tooltip: {
          mode: 'index',
          intersect: false
        }
      }
    }
  });

  // Fetch data
  useEffect(() => {
    const patientRef = ref(database, `patients/${id}`);
    const unsubscribe = onValue(patientRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) return;

      const sensors = data.sensordata || {};
      const formatted = Object.entries(sensors)
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(([timestamp, values]) => ({
          x: new Date(Number(timestamp)),
          y: values.heart_rate,
          systolic: values.blood_pressure_systolic,
          diastolic: values.blood_pressure_diastolic,
          temp: values.temperature
        }));

      setSensorData(formatted);
    });

    return () => unsubscribe();
  }, [id]);

  // Initialize Charts Once
  useEffect(() => {
    if (!heartRateChartRef.current || !bpChartRef.current || !tempChartRef.current) return;

    const hrCtx = heartRateChartRef.current.getContext('2d');
    const bpCtx = bpChartRef.current.getContext('2d');
    const tempCtx = tempChartRef.current.getContext('2d');

    heartRateChartInstance.current = new Chart(hrCtx, createChartConfig('Heart Rate', '#ef4444'));
    bpChartInstance.current = new Chart(bpCtx, createChartConfig('Blood Pressure', '', true));
    tempChartInstance.current = new Chart(tempCtx, createChartConfig('Temperature', '#f97316'));

    return () => {
      heartRateChartInstance.current?.destroy();
      bpChartInstance.current?.destroy();
      tempChartInstance.current?.destroy();
    };
  }, []);

  // Update Charts when Data is Ready
  useEffect(() => {
    if (
      !heartRateChartInstance.current ||
      !bpChartInstance.current ||
      !tempChartInstance.current
    ) return;

    heartRateChartInstance.current.data.datasets[0].data = sensorData.map(d => ({
      x: d.x,
      y: d.y
    }));

    bpChartInstance.current.data.datasets[0].data = sensorData.map(d => ({
      x: d.x,
      y: d.systolic
    }));

    bpChartInstance.current.data.datasets[1].data = sensorData.map(d => ({
      x: d.x,
      y: d.diastolic
    }));

    tempChartInstance.current.data.datasets[0].data = sensorData.map(d => ({
      x: d.x,
      y: d.temp
    }));

    heartRateChartInstance.current.update();
    bpChartInstance.current.update();
    tempChartInstance.current.update();
  }, [sensorData]);

  const latest = sensorData.length > 0 ? sensorData[sensorData.length - 1] : null;

  return (
    <div className="health-monitoring-tab">
      <div className="chart-container">
        <div className="chart-header">
          <h3>Heart Rate</h3>
          <span className="current-value">
            {latest?.y ? `${latest.y} bpm` : 'Loading...'}
          </span>
        </div>
        <div className="chart-wrapper">
          <canvas ref={heartRateChartRef}></canvas>
        </div>
      </div>

      <div className="chart-container">
        <div className="chart-header">
          <h3>Blood Pressure</h3>
          <span className="current-value">
            {latest?.systolic && latest?.diastolic
              ? `${latest.systolic}/${latest.diastolic} mmHg`
              : 'Loading...'}
          </span>
        </div>
        <div className="chart-wrapper">
          <canvas ref={bpChartRef}></canvas>
        </div>
      </div>

      <div className="chart-container">
        <div className="chart-header">
          <h3>Temperature</h3>
          <span className="current-value">
            {latest?.temp ? `${latest.temp} °C` : 'Loading...'}
          </span>
        </div>
        <div className="chart-wrapper">
          <canvas ref={tempChartRef}></canvas>
        </div>
      </div>
    </div>
  );
};

export default HealthMonitoring;