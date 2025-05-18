// server/models/breakdownModel.js
import mongoose from 'mongoose';

const breakdownSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  }
});

const Breakdown = mongoose.model('Breakdown', breakdownSchema);

export default Breakdown;
