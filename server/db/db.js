import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectToDatabase = async () => {
  const url = process.env.MONGODB_URL;

  // Vérifier que l'URI est bien défini
  if (!url) {
    console.error("MONGODB_URI is undefined. Check your .env file.");
    process.exit(1);
  }

  try {
    // Connexion à MongoDB avec les options recommandées pour éviter des dépréciations
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to the database");

    // Ajouter une gestion de la déconnexion (optionnel)
    mongoose.connection.on('disconnected', () => {
      console.error('MongoDB connection lost. Retrying...');
      setTimeout(() => connectToDatabase(), 5000); // Reconnecte après 5 secondes
    });

  } catch (error) {
    console.error("Error connecting to the database:", error.message);
    process.exit(1);  // Arrête l'application si la connexion échoue
  }
};

export default connectToDatabase;
