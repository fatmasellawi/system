import React, { useEffect, useState } from 'react';
import HseDashboardChart from './HseDashboardChart';
import axios from 'axios';

const HseDashboard = () => {
  const [patrolCount, setPatrolCount] = useState(0);
  const [nonConformityCount, setNonConformityCount] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const patrolsRes = await axios.get('/api/patrols/count');
        const nonConfRes = await axios.get('/api/nonConformities/count');
        setPatrolCount(patrolsRes.data.count);
        setNonConformityCount(nonConfRes.data.count);
      } catch (err) {
        console.error('Error fetching HSE data:', err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <h2>HSE Dashboard</h2>
      <HseDashboardChart
        patrolCount={patrolCount}
        nonConformityCount={nonConformityCount}
      />
    </div>
  );
};

export default HseDashboard;
