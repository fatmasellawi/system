import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  message: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  seen: { type: Boolean, default: false },
});

export default mongoose.model('Notification', notificationSchema);
