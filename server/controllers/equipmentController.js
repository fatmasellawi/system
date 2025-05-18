import Equipment from '../models/Equipment.js';
import Notification from '../models/Notification.js';

// ✅ Ajouter un équipement
export const addEquipment = async (req, res) => {
  try {
    const { name, quantity, minThreshold } = req.body;
    if (!name || quantity == null || minThreshold == null) {
      return res.status(400).json({ message: 'Champs requis manquants' });
    }

    const equipment = new Equipment({ name, quantity, minThreshold });
    await equipment.save();
    res.status(201).json(equipment);
  } catch (error) {
    console.error('Erreur lors de l’ajout d’un équipement:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ✅ Mettre à jour le stock
export const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, quantity } = req.body;

    if (!['entry', 'exit'].includes(action) || typeof quantity !== 'number') {
      return res.status(400).json({ message: 'Action invalide ou quantité incorrecte' });
    }

    const equipment = await Equipment.findById(id);
    if (!equipment) {
      return res.status(404).json({ message: 'Équipement non trouvé' });
    }

    if (action === 'entry') {
      equipment.quantity += quantity;
    } else {
      equipment.quantity -= quantity;
      if (equipment.quantity < 0) equipment.quantity = 0;
    }

    if (equipment.quantity <= equipment.minThreshold && req.user?.id) {
      await Notification.create({
        message: `Stock bas pour ${equipment.name}`,
        user: req.user.id,
      });
    }

    await equipment.save();
    res.json(equipment);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du stock:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ✅ Récupérer tous les équipements (appelé par GET /stock)
export const getAllEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.find();
    res.json(equipment);
  } catch (error) {
    console.error('Erreur lors de la récupération des équipements:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
