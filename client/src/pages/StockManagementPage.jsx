import React from 'react';
import EquipmentList from '../components/EquipmentList';

const StockManagementPage = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h2>Gestion du Stock</h2>
      <EquipmentList />
    </div>
  );
};

export default StockManagementPage;
