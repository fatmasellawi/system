import Breakdown from '../models/breakdownModel.js';

// GET all breakdowns
export const getAllBreakdowns = async (req, res) => {
  try {
    const breakdowns = await Breakdown.find().sort({ date: -1 });
    res.status(200).json(breakdowns);
  } catch (error) {
    console.error("Erreur lors de la récupération des pannes :", error);
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

// POST a new breakdown
export const createBreakdown = async (req, res) => {
  try {
    const { description, date } = req.body;

    if (!description || !date) {
      return res.status(400).json({ message: 'Champs obligatoires manquants' });
    }

    const newBreakdown = new Breakdown({ description, date });
    const saved = await newBreakdown.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error("Erreur lors de la création de la panne :", error);
    res.status(500).json({ message: 'Erreur lors de la création', error });
  }
};

// DELETE a breakdown
export const deleteBreakdown = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Breakdown.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Panne non trouvée' });
    res.status(200).json({ message: 'Panne supprimée', deleted });
  } catch (error) {
    console.error("Erreur lors de la suppression de la panne :", error);
    res.status(500).json({ message: 'Erreur lors de la suppression', error });
  }
};
