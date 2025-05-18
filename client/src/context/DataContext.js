// DataContext.js
import React, { createContext, useState, useContext } from 'react';

const DataContext = createContext();

export function DataProvider({ children }) {
  // État pour les patrouilles
  const [patrolData, setPatrolData] = useState([
    {
      id: 1,
      date: '2023-10-01',
      department: 'Production',
      type: 'Équipement',
      description: 'Gants de protection déchirés',
      status: 'open',
      correctiveAction: 'Remplacer les gants',
      deadline: '2023-10-05'
    },
    {
      id: 2,
      date: '2023-10-02',
      department: 'Maintenance',
      type: 'Procédure',
      description: 'Absence de cadenassage',
      status: 'in_progress',
      correctiveAction: 'Former le personnel',
      deadline: '2023-10-10'
    }
  ]);

  // État pour les visiteurs
  const [visitorData, setVisitorData] = useState([
    {
      id: 1,
      name: 'Société ABC',
      visitDate: '2023-10-03',
      purpose: 'Maintenance électrique',
      status: 'validated',
      documents: ['Autorisation travail.pdf', 'Permis feu.docx']
    }
  ]);

  // État pour le stock
  const [stockData, setStockData] = useState([
    {
      id: 1,
      equipment: 'Casques de sécurité',
      quantity: 45,
      threshold: 30,
      lastRestock: '2023-09-28'
    },
    {
      id: 2,
      equipment: 'Gants anti-coupure',
      quantity: 22,
      threshold: 50,
      lastRestock: '2023-09-30'
    }
  ]);

  return (
    <DataContext.Provider value={{ 
      patrolData, 
      setPatrolData,
      visitorData, 
      setVisitorData,
      stockData, 
      setStockData 
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}