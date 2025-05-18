import winston from 'winston';
import path from 'path';
import fs from 'fs';

// Création du dossier logs s’il n'existe pas
const logDir = 'logs';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Format personnalisé des logs
const customFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
});

const logger = winston.createLogger({
  level: 'info', // niveau minimum à logger
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    customFormat
  ),
  transports: [
    // Console
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(), // Ajout de couleur
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        customFormat
      ),
    }),
    // Fichier des erreurs
    new winston.transports.File({ filename: path.join(logDir, 'error.log'), level: 'error' }),
    // Fichier général
    new winston.transports.File({ filename: path.join(logDir, 'combined.log') }),
  ],
});


export default logger;
