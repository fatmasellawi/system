import React from 'react';
import HseDashboardChart from './HseDashboardChart';
import ComplianceChart from './ComplianceChart';
import ManagementPatrolChart from './ManagementPatrolChart';

const HseDashboard = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Tableau de bord HSE</h2>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center' }}>
        <HseDashboardChart />
        <ComplianceChart />
        <ManagementPatrolChart />
      </div>
    </div>
  );
};

export default HseDashboard;
