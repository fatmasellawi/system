import express from 'express';
import multer from 'multer';
import Patrol from '../models/patrolModel.js';
import { sendPatrolEmail, getAllPatrols, updatePatrol, deletePatrol, getPatrolCount,getCountByStatus ,sendDeadlineChangeRequestEmail,getNotifications, getUpcomingDeadlines, updatePatrolValidator} from '../controllers/patrolController.js';
import requireAuth from '../middlewares/requireAuth.js'
const router = express.Router();

// Configuration de multer pour utiliser la mémoire (buffer)
const storage = multer.memoryStorage(); // Utiliser .buffer pour les fichiers
const upload = multer({ storage });

// Route pour envoyer un e-mail avec les images
router.post(
  '/send-email',
  upload.fields([
    { name: 'Picture', maxCount: 1 },
    { name: 'PictureAfter', maxCount: 1 },
  ]),
  sendPatrolEmail
);

// Route pour mettre à jour une patrouille avec des images
router.patch(
  '/patrol/:id',  // Correcte : pas besoin de `/api` ici, il s'agit de la route relative
  upload.fields([
    { name: 'beforeImage', maxCount: 1 },
    { name: 'afterImage', maxCount: 1 },
  ]),
  updatePatrol
);

// Route pour supprimer une patrouille
router.delete('/:id', async (req, res) => {
  try {
    const patrol = await Patrol.findByIdAndDelete(req.params.id); // Suppression de la patrouille
    if (!patrol) {
      return res.status(404).send({ message: 'Patrouille non trouvée' });
    }
    res.status(200).send({ message: 'Patrouille supprimée', patrol });
  } catch (error) {
    console.error('Erreur lors de la suppression de la patrouille:', error);
    res.status(500).send({ message: 'Erreur interne du serveur' });
  }
});

// Route pour récupérer toutes les patrouilles
router.get('/', getAllPatrols);
router.get('/count', getPatrolCount);


router.get('/count-by-status', getCountByStatus);

// routes/patrols.js
router.get("/upcoming-deadlines", getUpcomingDeadlines);
router.get('/notifications', getNotifications);





// Middleware d'authentification

router.patch('/:id', updatePatrolValidator);



export default router;
