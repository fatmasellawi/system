import express from 'express';
import {
  getAllBreakdowns,
  createBreakdown,
  deleteBreakdown,
} from '../controllers/breakdownController.js';

const router = express.Router();

// Récupérer toutes les pannes
router.get('/', getAllBreakdowns);

// Créer une nouvelle panne
router.post('/', createBreakdown);

// Supprimer une panne par ID
router.delete('/:id', deleteBreakdown);

export default router;
