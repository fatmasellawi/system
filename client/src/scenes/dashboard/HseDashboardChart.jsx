import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
import { ClipLoader } from 'react-spinners';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const HseDashboardChart = () => {
  const [statusCounts, setStatusCounts] = useState({
    Pending: 0,
    InProgress: 0,
    Completed: 0,
  });
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('week'); // <-- Filtre par période

  const fetchStatusCounts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/patrols/count-by-status?period=${period}`);
      setStatusCounts(response.data);
      setLoading(false);
    } catch (error) {
      setError(`Erreur lors du chargement des données HSE: ${error.message}`);
      setLoading(false);
    }
  };

  const fetchUpcomingDeadlines = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/patrols/upcoming-deadlines');
      setUpcomingDeadlines(response.data);
    } catch (error) {
      console.error("Erreur lors de la vérification des deadlines proches:", error.message);
    }
  };

  useEffect(() => {
    fetchStatusCounts();
    fetchUpcomingDeadlines();

    const intervalId = setInterval(() => {
      fetchStatusCounts();
      fetchUpcomingDeadlines();
    }, 30000);

    return () => clearInterval(intervalId);
  }, [period]); // <-- Mettre à jour les données en fonction de la période

  const hasData = Object.values(statusCounts).some(count => count > 0);

  const doughnutData = {
    labels: ['Pending', 'InProgress', 'Completed'],
    datasets: [
      {
        label: 'Patrol Status',
        data: [
          statusCounts.Pending,
          statusCounts.InProgress,
          statusCounts.Completed,
        ],
        backgroundColor: ['#ffc107', '#17a2b8', '#28a745'],
        borderColor: ['#ffffff', '#ffffff', '#ffffff'],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Progression des Patrouilles',
        font: {
          size: 18,
        },
      },
    },
  };

  return (
    <div style={{
      maxWidth: '500px',
      margin: '0 auto',
      padding: '1rem',
      border: '1px solid #e0e0e0',
      borderRadius: '10px',
      background: '#fff',
      boxShadow: '0 4px 8px rgba(0,0,0,0.05)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3>📊 Statut Patrouilles</h3>
        <select value={period} onChange={(e) => setPeriod(e.target.value)} style={{
          padding: '0.3rem 0.5rem',
          borderRadius: '5px',
          border: '1px solid #ccc'
        }}>
          <option value="week">Cette semaine</option>
          <option value="month">Ce mois</option>
          <option value="all">Toutes</option>
        </select>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0' }}>
          <ClipLoader size={50} color="#007bff" />
        </div>
      ) : error ? (
        <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>
      ) : hasData ? (
        <>
          {upcomingDeadlines.length > 0 && (
            <div style={{
              backgroundColor: '#ffe6e6',
              color: '#b20000',
              fontWeight: 'bold',
              padding: '10px',
              borderRadius: '8px',
              textAlign: 'center',
              marginBottom: '1rem'
            }}>
              🔔 {upcomingDeadlines.length} patrouille(s) avec une deadline &lt; 3 jours !
            </div>
          )}

          <Doughnut data={doughnutData} options={chartOptions} />

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
            <div style={{
              backgroundColor: '#ffc107',
              padding: '0.5rem 1rem',
              borderRadius: '5px',
              fontWeight: 'bold',
              color: '#212529'
            }}>
              🟡 Pending: {statusCounts.Pending}
            </div>
            <div style={{
              backgroundColor: '#17a2b8',
              padding: '0.5rem 1rem',
              borderRadius: '5px',
              fontWeight: 'bold',
              color: '#fff'
            }}>
              🔵 In Progress: {statusCounts.InProgress}
            </div>
            <div style={{
              backgroundColor: '#28a745',
              padding: '0.5rem 1rem',
              borderRadius: '5px',
              fontWeight: 'bold',
              color: '#fff'
            }}>
              ✅ Completed: {statusCounts.Completed}
            </div>
          </div>
        </>
      ) : (
        <p style={{ textAlign: 'center', marginTop: '2rem', color: 'gray' }}>
          Aucune donnée de patrouille disponible pour l’instant.
        </p>
      )}
    </div>
  );
};

export default HseDashboardChart;
