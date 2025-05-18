import express from 'express';
import { getLateNotifications } from '../controllers/notificationController.js';

const router = express.Router();

// GET /notification => toutes les notifications en retard
router.get('/', getLateNotifications);

export default router;
