const mongoose = require('mongoose');

const LeaveSchema = new mongoose.Schema({
  name: String,
  reason: String,
  date: String,
  status: { type: String, default: 'Pending' },
  docs: String 
}, { timestamps: true });


module.exports = mongoose.model('Leave', LeaveSchema);
