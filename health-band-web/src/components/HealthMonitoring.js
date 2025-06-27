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
  const [patientInfo, setPatientInfo] = useState({});
  const heartRateChartRef = useRef(null);
  const oxygenChartRef = useRef(null);
  const tempChartRef = useRef(null);
  
  // Chart configuration
  const createChartConfig = (label, color) => ({
    type: 'line',
    data: {
      datasets: [{
        label,
        borderColor: color,
        backgroundColor: `${color}20`,
        borderWidth: 2,
        pointRadius: 2,
        pointHoverRadius: 5,
        tension: 0.3,
        fill: true,
        data: []
      }]
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
          display: false
        },
        tooltip: {
          mode: 'index',
          intersect: false
        }
      }
    }
  });

  // Fetch patient data (same as Patient.js)
  useEffect(() => {
    const patientRef = ref(database, `patients/${id}`);
    
    const unsubscribe = onValue(patientRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) return;

      setPatientInfo(data.personal_info || {});

      // Process sensor data same way as in Patient.js
      const sensors = data.sensordata || {};
      const formattedData = Object.entries(sensors)
        .sort(([a], [b]) => Number(b) - Number(a))
        .map(([timestamp, values]) => ({
          x: new Date(Number(timestamp)),
          y: values.heart_rate,
          o2: values.oxygenLevel,
          temp: values.temperature
        }));
      
      setSensorData(formattedData);
      
      // Update charts
      updateCharts(formattedData);
    });

    return () => unsubscribe();
  }, [id]);

  // Initialize charts
  useEffect(() => {
    if (!heartRateChartRef.current) return;
    
    const heartRateCtx = heartRateChartRef.current.getContext('2d');
    const oxygenCtx = oxygenChartRef.current.getContext('2d');
    const tempCtx = tempChartRef.current.getContext('2d');
    
    const heartRateChart = new Chart(heartRateCtx, createChartConfig('Heart Rate', '#ef4444'));
    const oxygenChart = new Chart(oxygenCtx, createChartConfig('Oxygen Level', '#3b82f6'));
    const tempChart = new Chart(tempCtx, createChartConfig('Temperature', '#f97316'));
    
    return () => {
      heartRateChart.destroy();
      oxygenChart.destroy();
      tempChart.destroy();
    };
  }, []);

  // Update charts with new data
  const updateCharts = (data) => {
    if (!heartRateChartRef.current?.chart) return;
    
    heartRateChartRef.current.chart.data.datasets[0].data = data.map(d => ({ x: d.x, y: d.y }));
    oxygenChartRef.current.chart.data.datasets[0].data = data.map(d => ({ x: d.x, y: d.o2 }));
    tempChartRef.current.chart.data.datasets[0].data = data.map(d => ({ x: d.x, y: d.temp }));
    
    heartRateChartRef.current.chart.update();
    oxygenChartRef.current.chart.update();
    tempChartRef.current.chart.update();
  };

  // Get latest readings for display
  const latestReading = sensorData.length > 0 ? sensorData[0] : null;

  return (
    <div className="health-monitoring-tab">

      <div className="chart-container">
        <div className="chart-header">
          <h3>Heart Rate</h3>
          <span className="current-value">
            {latestReading ? `${latestReading.y} bpm` : 'Loading...'}
          </span>
        </div>
        <div className="chart-wrapper">
          <canvas ref={heartRateChartRef} />
        </div>
      </div>
      
      <div className="chart-container">
        <div className="chart-header">
          <h3>Oxygen Level</h3>
          <span className="current-value">
            {latestReading ? `${latestReading.o2}%` : 'Loading...'}
          </span>
        </div>
        <div className="chart-wrapper">
          <canvas ref={oxygenChartRef} />
        </div>
      </div>
      
      <div className="chart-container">
        <div className="chart-header">
          <h3>Temperature</h3>
          <span className="current-value">
            {latestReading ? `${latestReading.temp}°C` : 'Loading...'}
          </span>
        </div>
        <div className="chart-wrapper">
          <canvas ref={tempChartRef} />
        </div>
      </div>
    </div>
  );
};

export default HealthMonitoring;