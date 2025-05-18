// DashboardContainer.jsx
import React from 'react';
import HseDashboardChart from './HseDashboardChart';
import DailyPatrolChart from './DailyPatrolChart';
import ComplianceChart from './ComplianceChart';
import ManagementPatrolChart from './ManagementPatrolChart';

const DashboardContainer = () => (
  <div style={{ padding: '2rem' }}>
    <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Tableau de bord HSE</h2>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
      <HseDashboardChart />
      <DailyPatrolChart />
      <ComplianceChart />
      <ManagementPatrolChart />
    </div>
  </div>
);

export default DashboardContainer;
