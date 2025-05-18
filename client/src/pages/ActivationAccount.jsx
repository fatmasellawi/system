import bcrypt from 'bcryptjs';
import { sendActivationEmail } from '../utils/emailService';  // Fonction d'envoi d'email
import crypto from 'crypto';

export const register = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Validation basique de l'email
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ message: 'Email invalide.' });
    }

    // Vérifier si l'email existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email déjà utilisé.' });

    // Validation du mot de passe (longueur minimale de 8 caractères)
    if (password.length < 8) {
      return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 8 caractères.' });
    }

    // Hacher le mot de passe avant de l'enregistrer
    const hashedPassword = await bcrypt.hash(password, 10);

    // Générer un code d'activation unique
    const activationCode = crypto.randomBytes(32).toString('hex');

    // Créer un nouvel utilisateur
    const newUser = new User({
      email,
      password: hashedPassword,  // Utiliser le mot de passe haché
      role,
      isActive: true,  // Le compte est par défaut non activé
      activationCode, // Ajouter le code d'activation
    });

    // Sauvegarder l'utilisateur dans la base de données
    await newUser.save();

    // Générer le lien d'activation
    const activationLink = `http://localhost:5000/api/auth/activate/${activationCode}`;

    // Envoyer l'email d'activation
    await sendActivationEmail(email, activationLink);

    // Répondre avec un message de succès
    res.status(201).json({ message: 'Inscription réussie, vérifiez vos emails.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Activation d'un compte
export const activateAccount = async (req, res) => {
  const { code } = req.params;

  try {
    const user = await User.findOne({ activationCode: code });
    if (!user) return res.status(400).json({ message: 'Code d\'activation invalide.' });

    // Activer le compte
    user.isActive= true;
    user.activationCode = undefined; // Supprimer le code d'activation
    await user.save();

    res.status(200).json({ message: 'Compte activé avec succès.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};
