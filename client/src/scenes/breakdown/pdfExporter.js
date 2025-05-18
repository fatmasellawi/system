// src/scenes/breakdown/pdfExporter.js
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // ⚠️ obligatoire pour activer autoTable()

export const exportToPDF = (patrolData, visitorData, stockData) => {
  const doc = new jsPDF();

  // Titre principal
  doc.text("Rapport HSE - Détails", 14, 10);

  // Section Patrouilles
  doc.text("1. Patrouilles", 14, 20);
  
  const patrolRows = patrolData.map(item => [
    new Date(item.date).toLocaleDateString(),
    item.department,
    item.type,
    item.status
  ]);

  doc.autoTable({
    startY: 30,
    head: [['Date', 'Département', 'Type', 'Statut']],
    body: patrolRows,
    theme: 'grid',
  });

  // Section Visiteurs
  doc.text("2. Visiteurs", 14, doc.lastAutoTable.finalY + 10);
  
  const visitorRows = visitorData.map(item => [
    item.name,
    item.company,
    new Date(item.date).toLocaleDateString(),
    item.status
  ]);

  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 20,
    head: [['Nom', 'Entreprise', 'Date', 'Statut']],
    body: visitorRows,
    theme: 'grid',
  });

  // Section Stock
  doc.text("3. Stock", 14, doc.lastAutoTable.finalY + 10);

  const stockRows = stockData.map(item => [
    item.name,
    item.quantity,
    item.location,
    item.status
  ]);

  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 20,
    head: [['Nom', 'Quantité', 'Emplacement', 'Statut']],
    body: stockRows,
    theme: 'grid',
  });

  // Sauvegarde du PDF
  doc.save("rapport-hse-complet.pdf");
};
