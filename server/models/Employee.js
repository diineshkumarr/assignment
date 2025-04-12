const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
  name: String,
  profile: String,
  position: String,
  department: String,
  task: String,
  status: { type: String, enum: ['Present', 'Absent'], default: 'Present' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Employee', EmployeeSchema);
