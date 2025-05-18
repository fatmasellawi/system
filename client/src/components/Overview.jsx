import { useState, useEffect } from 'react';
import { PointOfSaleOutlined } from "@mui/icons-material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import axios from 'axios';

export default function Overview() {
  const [patrols, setPatrols] = useState([]);
  const [openNonConformities, setOpenNonConformities] = useState(0);
  const [ongoingCorrectiveActions, setOngoingCorrectiveActions] = useState(0);
  const [overduePatrols, setOverduePatrols] = useState(0);

  useEffect(() => {
    axios.get('http://localhost:5000/api/patrols')
      .then(response => {
        const data = response.data;
        setPatrols(data);
        calculateStats(data);
      })
      .catch(error => console.error("Error fetching patrol data:", error));
  }, []);

  const calculateStats = (data) => {
    const today = new Date();
    let openNC = 0;
    let ongoingCA = 0;
    let overdue = 0;

    data.forEach(patrol => {
      if (patrol.nonConformityStatus === 'open') openNC++;
      if (patrol.correctiveActionStatus === 'ongoing') ongoingCA++;
      const deadline = new Date(patrol.deadline);
      if (deadline < today && patrol.status !== 'completed') overdue++; // optional status check
    });

    setOpenNonConformities(openNC);
    setOngoingCorrectiveActions(ongoingCA);
    setOverduePatrols(overdue);
  };

  const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Août", "Sep", "Oct", "Nov", "Dec"];

  const monthlyData = monthLabels.map((label, index) => ({
    mois: label,
    patrouilles: patrols.filter(p => new Date(p.date).getMonth() === index).length
  }));

  const todayDate = new Date().toDateString();

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen" style={{ color: '#36A2EB' }}>
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="bg-blue-100 p-3 rounded-full">
          <PointOfSaleOutlined className="text-4xl text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
          Vue d'ensemble
        </h1>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        <StatCard title="Patrouilles Aujourd'hui" value={patrols.filter(p => new Date(p.date).toDateString() === todayDate).length} color="blue" />
        <StatCard title="Non-Conformités Ouvertes" value={openNonConformities} color="green" />
        <StatCard title="Actions Correctives en Cours" value={ongoingCorrectiveActions} color="yellow" />
        <StatCard title="Délais Dépassés" value={overduePatrols} color="red" />
      </div>

      {/* Bar Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Évolution des Patrouilles</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData}>
            <XAxis dataKey="mois" stroke="#6366f1" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="patrouilles" fill="#6366f1" radius={[12, 12, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function StatCard({ title, value, color }) {
  const bg = {
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-green-50 text-green-700',
    yellow: 'bg-yellow-50 text-yellow-700',
    red: 'bg-red-50 text-red-700'
  }[color];

  return (
    <div className={`p-6 ${bg} rounded-2xl shadow hover:shadow-xl transition-all duration-300`}>
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className={`text-2xl font-bold mt-2`}>{value}</h2>
    </div>
  );
}
