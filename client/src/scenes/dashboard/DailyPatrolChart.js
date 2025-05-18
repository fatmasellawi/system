import React, { useEffect, useState } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import axios from 'axios';

const DailyPatrolChart = () => {
  const [data, setData] = useState({
    actionsRaised: 0,
    actionsOpen: 0,
    actionsClosed: 0,
  });

  useEffect(() => {
    axios.get('http://localhost:5000/api/patrols/daily')
      .then((res) => setData(res.data))
      .catch(console.error);
  }, []);

  const barData = {
    labels: ['Actions Raised', 'Open Actions', 'Closed Actions'],
    datasets: [{
      label: 'Daily Patrol',
      data: [data.actionsRaised, data.actionsOpen, data.actionsClosed],
      backgroundColor: ['#007bff', '#ffc107', '#28a745']
    }]
  };

  const doughnutData = {
    labels: ['Open', 'Closed'],
    datasets: [{
      data: [data.actionsOpen, data.actionsClosed],
      backgroundColor: ['#ffc107', '#28a745'],
    }]
  };

  return (
    <div style={{
      background: '#fff',
      padding: '1rem',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
      border: '1px solid #e0e0e0',
    }}>
      <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>Daily Patrol</h3>
      <Bar data={barData} />
      <Doughnut data={doughnutData} style={{ marginTop: '1rem' }} />
    </div>
  );
};

export default DailyPatrolChart;
