import mongoose from 'mongoose';

const equipmentRequestSchema = new mongoose.Schema({
  requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [{
    equipment: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipment' },
    quantity: Number
  }],
  status: { type: String, enum: ['pending', 'approved', 'cancelled'], default: 'pending' }
}, { timestamps: true });

export default mongoose.model('EquipmentRequest', equipmentRequestSchema);
