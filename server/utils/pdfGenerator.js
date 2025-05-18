/*import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ✅ pour gérer __dirname en mode ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Fonction pour générer le PDF
const generatePDF = (visit) => {
  return new Promise((resolve, reject) => {
    // Chemin du fichier PDF
    const pdfDir = path.join(__dirname, '../pdfs');
    const filePath = path.join(pdfDir, `visit_${visit._id}.pdf`);

    // Créer le dossier 'pdfs' si il n'existe pas déjà
    if (!fs.existsSync(pdfDir)) {
      fs.mkdirSync(pdfDir, { recursive: true });
    }

    // Création du document PDF
    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(filePath));

    // Contenu du PDF
    doc.fontSize(20).text('Demande de Visite', { align: 'center' });
    doc.moveDown();
    doc.text(`Nom du Visiteur : ${visit.visitorName}`);
    doc.text(`Département : ${visit.department}`);
    doc.text(`Objet : ${visit.purpose}`);
    doc.text(`Date de Visite : ${new Date(visit.visitDate).toLocaleDateString()}`);
    doc.text(`Autorisation de travail : ${visit.workPermit ? 'Oui' : 'Non'}`);
    doc.text(`Permis de feu : ${visit.firePermit ? 'Oui' : 'Non'}`);
    doc.text(`Validation HSE : Oui`);

    doc.end();

    // Résolution ou rejet de la promesse après la fin de l'écriture du PDF
    doc.on('finish', () => resolve(filePath));  // Retourner le chemin du fichier PDF généré
    doc.on('error', reject);  // Rejeter en cas d'erreur
  });
};

export { generatePDF };*/
