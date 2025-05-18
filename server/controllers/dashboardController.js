import Patrol from '../models/patrolModel.js';
const NonConformity = require('../models/NonConformity');
const { generatePDF } = require('../utils/pdfExport');

exports.getDashboardData = async (req, res) => {
  try {
    const { timeRange, area, status, severity } = req.query;
    const filter = {};

    if (area) filter.Area = area;
    if (status) filter.Progress = status;
    if (severity) filter.severity = severity;

    const patrols = await Patrol.find(filter).sort({ createdAt: -1 });
    const nonConformities = await NonConformity.find(filter).sort({ dateReported: -1 });

    // Example stats (simplified)
    const stats = {
      totalPatrols: patrols.length,
      totalNonConformities: nonConformities.length,
      patrolsCompleted: patrols.filter(p => p.Progress === 'Completed').length,
      caPending: nonConformities.filter(nc => nc.status === 'Pending').length
    };

    res.status(200).json({ data: { patrols, nonConformities, stats } });
  } catch (err) {
    res.status(500).json({ message: 'Error loading dashboard data' });
  }
};

exports.exportPDF = async (req, res) => {
  try {
    const buffer = await generatePDF(); // Generate your PDF buffer
    res.setHeader('Content-Disposition', 'attachment; filename="dashboard.pdf"');
    res.setHeader('Content-Type', 'application/pdf');
    res.send(buffer);
  } catch (error) {
    res.status(500).send('Error exporting PDF');
  }
};


// Exemple d'extraction de la période dans le contrôleur
export const getCountByStatus = async (req, res) => {
  const { period } = req.query;

  const now = new Date();
  let startDate;

  if (period === 'week') {
    startDate = new Date();
    startDate.setDate(now.getDate() - 7);
  } else if (period === 'month') {
    startDate = new Date();
    startDate.setMonth(now.getMonth() - 1);
  }

  const matchStage = period !== 'all'
    ? { createdAt: { $gte: startDate } }
    : {};

  const result = await Patrol.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  const counts = { Pending: 0, InProgress: 0, Completed: 0 };
  result.forEach(item => {
    counts[item._id] = item.count;
  });

  res.json(counts);
};
