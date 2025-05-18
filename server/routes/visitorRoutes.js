import express from 'express';
import multer from 'multer';
import { createVisit } from '../controllers/visitorController.js';

const router = express.Router();

// 📁 Configuration de multer pour le stockage temporaire des fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // dossier où les fichiers seront enregistrés
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // nom de fichier unique
  }
});

const upload = multer({ storage });

// ✅ Route de création avec fichier
router.post('/', upload.single('document'), createVisit);

export default router;
