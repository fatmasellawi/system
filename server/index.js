import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import  moment from'moment';
import { fileURLToPath } from 'url';
import connectToDatabase from './db/db.js';

// IMPORT DES ROUTES
import generalRoutes from './routes/general.js';
import patrolRoutes from './routes/patrolRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import visitorRoutes from './routes/visitorRoutes.js';
import stockRoutes from './routes/stockRoutes.js';
import workPermitRoutes from "./routes/workPermitRoutes.js";
import notificationRoutes from './routes/notificationRoutes.js';

import Patrol from './models/patrolModel.js';
import multer from 'multer';
import { updatePatrol } from './controllers/patrolController.js'; // Assurez-vous d'importer la fonction
import breakdownRoutes from './routes/breakdownRoutes.js';

// CONFIGURATION .env
dotenv.config();

// CONNEXION À LA BASE DE DONNÉES
connectToDatabase();

// INITIALISATION DE L'APPLICATION EXPRESS
const app = express();

// CONFIGURATION __dirname EN MODULE ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CONFIGURATION CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
  })
);

// MIDDLEWARES
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(morgan('common'));

// SERVIR LES FICHIERS STATIQUES
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/pdfs', express.static(path.join(__dirname, 'pdfs')));

// ENREGISTREMENT DES ROUTES
app.use('/visit', visitorRoutes);
app.use('/general', generalRoutes);
app.use('/patrol', patrolRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/stock', stockRoutes);
app.use("/api/work-permit", workPermitRoutes);
// ROUTE TEST
app.patch('/patrol/:id/validate', (req, res) => {
  res.status(200).json({ message: 'Patrol validated successfully' });
});

// GESTION DES ERREURS
app.use((err, req, res, next) => {
  console.error('💥 ERREUR SERVEUR:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Erreur interne du serveur'
  });
});


app.use('/api/patrol', patrolRoutes); 
app.delete('/api/patrol/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const patrol = await Patrol.findByIdAndDelete(id);
    
    if (!patrol) {
      return res.status(404).json({ message: 'Patrouille non trouvée' });
    }

    res.status(200).json({ message: 'Patrouille supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la patrouille:', error);
    res.status(500).json({ message: 'Erreur interne du serveur', error: error.message });
  }
});

const storage = multer.memoryStorage();  // Stockage en mémoire des fichiers téléchargés
const upload = multer({ storage: storage });
app.put('/api/patrol/:id', upload.fields([{ name: 'beforeImage' }, { name: 'afterImage' }]), updatePatrol);


app.post('/api/patrols/request-deadline-change', async (req, res) => {
  const { patrolId, newDeadline, reason } = req.body;

  // Trouve la patrouille par son ID
  const patrol = await Patrol.findById(patrolId);

  if (!patrol) {
    return res.status(404).json({ message: 'Patrouille non trouvée' });
  }

  // Envoie l'email
  await sendDeadlineChangeRequestEmail(patrol, newDeadline, reason);

  res.status(200).json({ message: 'Demande de changement de deadline envoyée avec succès' });
});


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// DÉMARRAGE DU SERVEUR

app.use('/api/patrols', patrolRoutes);

app.get('/api/patrols/count', async (req, res) => {
  try {
    const count = await Patrol.countDocuments(); // Or any logic to get count
    res.json({ count });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

app.get('/api/patrols/notifications', async (req, res) => {
  try {
      const now = moment();
      const threeDaysBeforeDeadline = moment().add(3, 'days');  // Date limite moins de 3 jours
      const patrols = await Patrol.find({
          deadline: { $gte: now, $lte: threeDaysBeforeDeadline }  // Cherche les patrouilles dont la deadline est dans 3 jours
      });

      res.json(patrols); // Renvoie les patrouilles avec la deadline proche
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erreur lors de la récupération des patrouilles' });
  }
});


app.use('/api/breakdowns', breakdownRoutes);
// Example for an Express route
app.get('/api/deadlines', async (req, res) => {
  try {
    const deadlines = await getDeadlines();
    res.json(deadlines);
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});








const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n✅ Serveur démarré sur http://localhost:${PORT}`);
  console.log(`📁 Répertoire statique: ${__dirname}\n`);
});