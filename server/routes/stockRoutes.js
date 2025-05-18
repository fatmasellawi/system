// routes/stockRoutes.js
import express from 'express';
import { getAllEquipment } from '../controllers/equipmentController.js';

const router = express.Router();

router.get('/', getAllEquipment); // correspond à GET /stock

export default router;
