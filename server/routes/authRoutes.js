import express from 'express';
import { register, login, activateAccount } from '../controllers/authController.js';
import verifyToken from '../middlewares/authMiddleware.js';

const router = express.Router();

// 🔐 Route pour l'inscription d'un nouvel utilisateur
router.post('/register', register);

// 🔑 Route pour la connexion d'un utilisateur
router.post('/login', login);

// ✅ Route pour l'activation du compte utilisateur par lien email
router.get('/activate/:token', activateAccount); // token comme paramètre dans l'URL

// 🔒 Exemple de route protégée par token JWT
router.get('/protected', verifyToken, (req, res) => {
  res.status(200).json({
    message: "Accès autorisé !",
    user: req.user, // req.user est injecté par le middleware verifyToken
  });
});

export default router;
