const express = require('express');
const router = express.Router();
const Leave = require('../models/Leave'); 

router.post('/', async (req, res) => {
  try {
    const leave = new Leave(req.body);
    const saved = await leave.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Error saving leave:', err);
    res.status(500).json({ message: 'Failed to save leave request' });
  }
});

module.exports = router;
