const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee'); // MongoDB model
const Candidate = require('../models/Candidate');


router.get('/attendance', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
