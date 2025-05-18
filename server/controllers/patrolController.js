import Patrol from '../models/patrolModel.js';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import logger from '../utils/logger.js'; // Assure-toi que logger est bien importé

import fs from 'fs';
dotenv.config();

// Récupérer toutes les patrouilles et formater les images en base64
export const getAllPatrols = async (req, res) => {
  try {
    const patrols = await Patrol.find();

    // Formater les patrouilles pour inclure les images en base64
    const formattedPatrols = patrols.map(p => {
      const patrolObj = p.toObject();

      // Convertir les images en base64 si elles existent
      patrolObj.Picture = p.Picture?.data
        ? `data:${p.Picture.contentType};base64,${p.Picture.data.toString('base64')}`
        : null;

      patrolObj.PictureAfter = p.PictureAfter?.data
        ? `data:${p.PictureAfter.contentType};base64,${p.PictureAfter.data.toString('base64')}`
        : null;

      return patrolObj;
    });

    res.status(200).json(formattedPatrols);
  } catch (err) {
    console.error('Erreur lors de la récupération des patrouilles :', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Envoyer un e-mail lors de la création d'une patrouille et enregistrer les informations dans la DB
export const sendPatrolEmail = async (req, res) => {
  try {
    const {
      No,
      Area,
      Where,
      Item,
      Solution,
      PersoneAction,
      Progress,
      Deadline,
    } = req.body;

    const pictureFile = req.files['Picture']?.[0];
    const pictureAfterFile = req.files['PictureAfter']?.[0];

    if (!pictureFile || !pictureAfterFile) {
      return res.status(400).json({ message: 'Les photos avant et après sont requises.' });
    }

    const newPatrol = new Patrol({
      No,
      Area,
      Where,
      Item,
      Solution,
      PersoneAction,
      Progress,
      Deadline: new Date(Deadline),
      Picture: {
        data: pictureFile.buffer,
        contentType: pictureFile.mimetype,
      },
      PictureAfter: {
        data: pictureAfterFile.buffer,
        contentType: pictureAfterFile.mimetype,
      },
    });

    await newPatrol.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const attachments = [];

    // Attacher les images avant et après si présentes
    if (pictureFile?.buffer && typeof pictureFile.mimetype === 'string') {
      attachments.push({
        filename: pictureFile.originalname || 'before.jpg',
        content: pictureFile.buffer,
        contentType: pictureFile.mimetype,
      });
    }

    if (pictureAfterFile?.buffer && typeof pictureAfterFile.mimetype === 'string') {
      attachments.push({
        filename: pictureAfterFile.originalname || 'after.jpg',
        content: pictureAfterFile.buffer,
        contentType: pictureAfterFile.mimetype,
      });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: determineEmailByArea(Area),
      subject: `🛡️ Non-Conformity detected - ${Area}`,
      html: `
        <h3>Non-Conformity detected</h3>
        <p><strong>N°:</strong> ${No}</p>
        <p><strong>Area:</strong> ${Area}</p>
        <p><strong>Where:</strong> ${Where}</p>
        <p><strong>item:</strong> ${Item}</p>
        <p><strong>Solution:</strong> ${Solution}</p>
        <p><strong>Person In Charge:</strong> ${PersoneAction}</p>
        <p><strong>Progression:</strong> ${Progress}</p>
        <p><strong>Deadline:</strong> ${new Date(Deadline).toLocaleDateString()}</p> <!-- Formater la date si nécessaire -->
      `,
      attachments,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'E-mail envoyé et patrouille enregistrée dans la base de données' });
  } catch (err) {
    console.error('Erreur lors de l\'envoi de l\'email ou de l\'enregistrement :', err.message, err.stack);
    res.status(500).json({ message: 'Erreur lors de l\'envoi de l\'email ou de l\'enregistrement de la patrouille' });
  }
};

// Déterminer l'adresse e-mail du destinataire en fonction de la zone
const determineEmailByArea = (area) => {
  switch (area) {
    case 'Zone A':
      return 'sellawifatma234@gmail.com';
    case 'Zone B':
      return 'zoneB@example.com';
    default:
      return 'default@example.com';
  }
};

// Supprimer une patrouille par ID
export const deletePatrol = async (req, res) => {
  const { id } = req.params;
  try {
    const patrol = await Patrol.findById(id);
    if (!patrol) {
      return res.status(404).json({ message: 'Patrouille non trouvée' });
    }

    await patrol.remove();
    res.status(200).json({ message: 'Patrouille supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la patrouille: ', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Configuration de multer pour gérer les fichiers téléchargés
const storage = multer.memoryStorage(); // Utiliser la mémoire pour obtenir file.buffer

const upload = multer({ storage: storage });

// Mettre à jour une patrouille
export const updatePatrol = async (req, res) => {
  try {
    const patrolId = req.params.id;

    if (!patrolId) {
      return res.status(400).json({ message: "ID de patrouille manquant." });
    }

    const { Area, Item, Solution ,Deadline} = req.body;

    // Validation minimale des champs requis
    if (!Area || !Item) {
      return res.status(400).json({ message: "Champs 'Area' et 'Item' requis." });
    }

    // Préparer les champs à mettre à jour
    const updateFields = {
      Area,
      Item,
      Solution: Solution || "", // valeur par défaut si non fourni
    };

    // Traitement des fichiers (images avant/après)
    if (req.files?.beforeImage?.[0]) {
      const file = req.files.beforeImage[0];
      updateFields.Picture = {
        data: file.buffer,
        contentType: file.mimetype,
      };
    }

    if (req.files?.afterImage?.[0]) {
      const file = req.files.afterImage[0];
      updateFields.PictureAfter = {
        data: file.buffer,
        contentType: file.mimetype,
      };
    }

    // Mise à jour dans MongoDB
    const updatedPatrol = await Patrol.findByIdAndUpdate(patrolId, updateFields, { new: true });

    if (!updatedPatrol) {
      return res.status(404).json({ message: "Patrouille non trouvée." });
    }

    res.status(200).json(updatedPatrol);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la patrouille:", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};


export const requestDeadlineChange = async (req, res) => {
  const { patrolId, requestedDate } = req.body;

  if (!patrolId || !requestedDate) {
    return res.status(400).json({ message: 'ID et date requise' });
  }

  try {
    const patrol = await Patrol.findById(patrolId);
    if (!patrol) return res.status(404).json({ message: 'Patrouille non trouvée' });

    // ici tu peux stocker une demande de changement de deadline ou envoyer un mail
    console.log(`Demande de changement : ${patrolId} -> ${requestedDate}`);

    res.status(200).json({ message: 'Demande envoyée avec succès' });
  } catch (err) {
    console.error('Erreur lors de la demande :', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
export const sendDeadlineChangeRequestEmail = async (patrol, newDeadline, reason) => {
  // Exemple basique, adapte à ta logique
  const emailContent = `
    <h3>Demande de changement de deadline</h3>
    <p>Zone : ${patrol.Area}</p>
    <p>Nouvelle deadline proposée : ${newDeadline}</p>
    <p>Raison : ${reason}</p>
  `;

  // Appelle ton service d'envoi d'e-mail ici
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER || 'sellawifatma234@gmail.com',
    subject: `Changement deadline pour patrouille - ${patrol.Area}`,
    html: emailContent,
  });
};


export const getPatrolCount = async (req, res) => {
  try {
    const count = await Patrol.countDocuments();
    res.json({ count });
  } catch (error) {
    console.error("Erreur lors du comptage des patrouilles", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};


export const getCountByStatus = async (req, res) => {
  try {
    const counts = await Patrol.aggregate([
      { $group: { _id: "$Progress", count: { $sum: 1 } } }
    ]);

    const result = {
      Pending: 0,
      InProgress: 0,
      Completed: 0,
    };

    counts.forEach(item => {
      const status = item._id;
      if (status === 'Pending') result.Pending = item.count;
      else if (status === 'InProgress') result.InProgress = item.count;
      else if (status === 'Completed') result.Completed = item.count;
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("Erreur d'agrégation :", error);
    res.status(500).json({ message: "Erreur serveur lors du comptage des statuts." });
  }
};





// Obtenir les patrouilles avec deadlines proches
export const getUpcomingDeadlines = async (req, res) => {
  try {
    const today = new Date();
    const upcoming = new Date();
    upcoming.setDate(today.getDate() + 7); // dans les 7 prochains jours

    const deadlines = await Patrol.find({
      Deadline: { $gte: today, $lte: upcoming }, // Assurez-vous d'utiliser "Deadline" ici
    }).select("Deadline Location  Area");

    const notifications = deadlines.map((patrol) => ({
      _id: patrol._id,
      message: `The patrol ${patrol.Item} in the area ${patrol.Area} is planned for soon.`,
      deadline: patrol.Deadline,
    }));

    res.status(200).json(notifications);
  } catch (error) {
    console.error("Erreur lors de la récupération des deadlines :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};


// GET /api/notifications/deadline-overdue
export const getNotifications = async (req, res) => {
  try {
    const now = new Date();
    const threeDaysLater = new Date();
    threeDaysLater.setDate(now.getDate() + 3);

    const [upcoming, overdue] = await Promise.all([
      Patrol.find({
        deadline: { $gte: now, $lte: threeDaysLater },
        status: { $ne: 'Completed' },
      }),
      Patrol.find({
        deadline: { $lt: now },
        status: { $ne: 'Completed' },
      }),
    ]);

    const format = (p, type) => ({
      _id: p._id,
      message:
        type === "overdue"
          ? `⛔ Patrouille en retard : ${p.title || p.name}`
          : `⚠️ Patrouille à venir : ${p.title || p.name}`,
      deadline: p.deadline,
    });

    const notifications = [
      ...overdue.map((p) => format(p, "overdue")),
      ...upcoming.map((p) => format(p, "upcoming")),
    ];

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Met à jour le champ validator d'une patrouille

export const updatePatrolValidator = async (req, res) => {
  try {
    const patrolId = req.params.id;

    // 🛠 Convertit toujours en booléen (au cas où)
    const isValidated = Boolean(req.body.isValidated); 

    const validatorName = req.user?.name || 'Utilisateur inconnu';

    if (typeof isValidated !== 'boolean') {
      return res.status(400).json({ error: 'Le champ isValidated doit être un booléen' });
    }

    // 🛠 Met à jour isValidated + Validator (et applique le schéma)
    const updated = await Patrol.findByIdAndUpdate(
      patrolId,
      {
        Validator: isValidated ? validatorName : null,
        isValidated: isValidated,
      },
      { new: true, runValidators: true } // 👈 Très important
    );

    if (!updated) {
      return res.status(404).json({ error: 'Patrouille non trouvée' });
    }

    // ✅ Envoi de l’e-mail seulement si validation
    if (isValidated) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'sellawifatma234@gmail.com',
        subject: `✅ Validation de patrouille - ${updated.Area}`,
        html: `
          <h3>Validation de la patrouille</h3>
          <p><strong>N°:</strong> ${updated.No}</p>
          <p><strong>Zone:</strong> ${updated.Area}</p>
          <p><strong>Lieu:</strong> ${updated.Where}</p>
          <p><strong>Item:</strong> ${updated.Item}</p>
          <p><strong>Validée par:</strong> ${updated.Validator}</p>
          <p><strong>Date de validation:</strong> ${new Date().toLocaleString()}</p>
        `,
      };

      await transporter.sendMail(mailOptions);
    }

    // ✅ Réponse avec la patrouille mise à jour
    res.status(200).json(updated);

  } catch (err) {
    console.error('❌ Erreur lors de la validation et de l’envoi d’e-mail :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};






