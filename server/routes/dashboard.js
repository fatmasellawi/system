// routes/dashboardRoutes.js
import express from 'express';
import { verifyToken, checkRoles } from '../middleware/auth.js';
import DashboardController from '../controllers/dashboardController.js';

const router = express.Router();

// Accessible uniquement aux rôles HSE
router.get('/', verifyToken, checkRoles(['HSE_AGENT', 'HSE_MANAGER']), DashboardController.getDashboardData);
router.get('/export/pdf', verifyToken, checkRoles(['HSE_AGENT', 'HSE_MANAGER']), DashboardController.exportPDF);
router.get('/stats', async (req, res) => {
  try {
    // Simulation des données : à remplacer avec MongoDB ou autre
    const stats = [
      { label: 'Zone 1', value: 85 },
      { label: 'Zone 2', value: 72 },
      { label: 'Zone 3', value: 94 },
    ];
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});
export default router;
