const mongoose = require('mongoose');

const CandidateSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  position: String,
  experience: String,
  status: {
    type: String,
    default: 'New'
  },
  resume: String 
}, { timestamps: true });

module.exports = mongoose.model('Candidate', CandidateSchema);
