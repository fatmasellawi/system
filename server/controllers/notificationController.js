import Notification from '../models/notificationModel.js';

export const getLateNotifications = async (req, res) => {
  try {
    const now = new Date();
    // Assurez-vous que `deadline` existe dans le modèle Notification et est bien de type Date
    const lateNotifications = await Notification.find({ deadline: { $lt: now } }).select('message user deadline'); // Sélectionner des champs spécifiques si nécessaire

    // Si aucune notification n'est trouvée
    if (!lateNotifications || lateNotifications.length === 0) {
      return res.status(404).json({ message: 'Aucune notification en retard trouvée' });
    }

    res.status(200).json(lateNotifications);
  } catch (error) {
    console.error('Erreur récupération des notifications en retard :', error.message);
    res.status(500).json({ error: "Erreur serveur, veuillez réessayer plus tard." });
  }
};
