import mongoose from 'mongoose';

const equipmentSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  minThreshold: Number, // seuil d'alerte
});

export default mongoose.model('Equipment', equipmentSchema);
