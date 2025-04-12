const express = require('express');
const router = express.Router();
const Candidate = require('../models/Candidate');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = './uploads/resumes';
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

router.post('/', upload.single('resume'), async (req, res) => {
  try {
    const data = req.body;
    if (req.file) {
      data.resume = req.file.path;
    }

    const candidate = new Candidate(data);
    await candidate.save();
    res.status(201).json(candidate);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ createdAt: -1 });
    res.json(candidates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', upload.single('resume'), async (req, res) => {
  try {
    const updateData = req.body;

    if (req.file) {
      const candidate = await Candidate.findById(req.params.id);
      if (candidate && candidate.resume) {
        fs.unlinkSync(candidate.resume); // Remove old file from storage
      }
      updateData.resume = req.file.path;
    }

    const updatedCandidate = await Candidate.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    if (!updatedCandidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }
    res.json(updatedCandidate);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndDelete(req.params.id);
    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    if (candidate.resume) {
      fs.unlinkSync(candidate.resume);
    }

    res.json({ message: 'Candidate deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
