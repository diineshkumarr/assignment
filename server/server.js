const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const multer = require('multer');
const fs = require('fs');
const Candidate = require('./models/Candidate');
const leaveRoutes = require('./routes/leaves');
const attendanceRoute = require('./routes/attendance');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once('open', () => {
  console.log('✅ Connected to MongoDB');
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = './uploads/resumes';
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });


app.use('/api/auth', require('./routes/auth'));
app.use('/api/candidates', require('./routes/candidates'));
app.use('/api', attendanceRoute);
app.use('/api/leaves', leaveRoutes);

app.put('/api/candidates/:id', upload.single('resume'), async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, position, experience, department, createdAt, status, task } = req.body;

  const updateData = {
    name,
    email,
    phone,
    position: department ? `${department} ${position}` : position,
    experience,
    createdAt: createdAt ? new Date(createdAt) : undefined,
    status,
    task,
  };

  Object.keys(updateData).forEach((key) => updateData[key] === undefined && delete updateData[key]);

  if (req.file) {
    updateData.resume = req.file.path;
  }

  try {
    const updatedCandidate = await Candidate.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedCandidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    res.status(200).json(updatedCandidate);
  } catch (err) {
    console.error('❌ Error updating candidate:', err);
    res.status(500).json({ message: 'Failed to update candidate' });
  }
});

app.delete('/api/candidates/:id', async (req, res) => {
  const { id } = req.params;
  console.log('🔍 Attempting to delete candidate with ID:', id);

  try {
    const candidate = await Candidate.findByIdAndDelete(id);

    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    res.status(200).json({ message: 'Candidate deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting candidate:', err);
    res.status(500).json({ message: 'Failed to delete candidate' });
  }
});

app.listen(5000, () => {
  console.log('🚀 Server running on http://localhost:5000');
});
