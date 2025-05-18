// src/scenes/breakdown/BreakdownDashboard.js
import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { useData } from '../../context/DataContext';
import { exportToPDF } from './pdfExporter';
import { jsPDF } from 'jspdf';
import { jsPDF as jsPDFAutoTable } from 'jspdf-autotable';


Chart.register(...registerables);

export default function BreakdownDashboard() {
  const { patrolData, visitorData, stockData } = useData();

  const conformityData = {
    labels: ['Conformes', 'Non-conformes'],
    datasets: [{
      data: [
        patrolData.filter(p => p.status === 'closed').length,
        patrolData.filter(p => p.status !== 'closed').length
      ],
      backgroundColor: ['#4CAF50', '#F44336']
    }]
  };

  const departmentComparison = {
    labels: ['Production', 'Maintenance', 'Logistique'],
    datasets: [{
      label: 'Non-conformités par département',
      data: [12, 8, 15],
      backgroundColor: '#2196F3'
    }]
  };

  return (
    <div className="dashboard">
      <h1>Tableau de Bord Détaillé HSE</h1>

      <div className="dashboard-controls">
        <button onClick={() => exportToPDF(patrolData, visitorData, stockData)}>
          Exporter en PDF
        </button>
      </div>

      <div className="chart-container">
        <div className="chart-item">
          <h3>Statut des Non-Conformités</h3>
          <Pie data={conformityData} />
        </div>

        <div className="chart-item">
          <h3>Répartition par Département</h3>
          <Bar data={departmentComparison} />
        </div>
      </div>

      <div className="data-grid">
        <h3>Détails des Patrouilles</h3>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Département</th>
              <th>Type</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {patrolData.map((item, index) => (
              <tr key={index}>
                <td>{new Date(item.date).toLocaleDateString()}</td>
                <td>{item.department}</td>
                <td>{item.type}</td>
                <td className={`status-${item.status}`}>{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
