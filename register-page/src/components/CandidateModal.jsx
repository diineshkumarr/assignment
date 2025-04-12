import React, { useState, useEffect } from 'react';
import './CandidateModal.css';
import axios from 'axios';

const CandidateModal = ({ onClose, onSave, candidate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    experience: '',
    resume: null,
    declaration: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (candidate) {
      setFormData({
        name: candidate.name || '',
        email: candidate.email || '',
        phone: candidate.phone || '',
        position: candidate.position || '',
        experience: candidate.experience || '',
        resume: null,
        declaration: candidate.declaration || false, 
      });
    }
  }, [candidate]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      setFormData({ ...formData, resume: files[0] });
    } else if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);

    const { name, email, phone, position, experience, resume, declaration } = formData;

    if (!name || !email || !phone || !position || !experience || !resume || !declaration) {
      alert("Please fill all fields and accept the declaration.");
      setIsSubmitting(false);
      return;
    }

    const payload = new FormData();
    payload.append('name', name);
    payload.append('email', email);
    payload.append('phone', phone);
    payload.append('position', position);
    payload.append('experience', experience);
    payload.append('resume', resume);

    try {
      if (candidate) {
        await axios.put(`http://localhost:5000/api/candidates/${candidate._id}`, payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        alert('Candidate updated successfully!');
      } else {
        await axios.post('http://localhost:5000/api/candidates', payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        alert('Candidate added successfully!');
      }
      onSave(); 
      onClose();
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Failed to save candidate.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>{candidate ? 'Edit Candidate' : 'Add New Candidate'}</h3>
          <button type="button" onClick={onClose} className="close-btn">✖</button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <input
                type="text"
                name="name"
                placeholder="Full Name*"
                value={formData.name}
                onChange={handleChange}
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address*"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="form-row">
              <input
                type="text"
                name="phone"
                placeholder="Phone Number*"
                value={formData.phone}
                onChange={handleChange}
              />
              <input
                type="text"
                name="position"
                placeholder="Position*"
                value={formData.position}
                onChange={handleChange}
              />
            </div>
            <div className="form-row">
              <input
                type="text"
                name="experience"
                placeholder="Experience*"
                value={formData.experience}
                onChange={handleChange}
              />
              <label className="upload-label">
                <input type="file" name="resume" onChange={handleChange} hidden />
                <span>{formData.resume ? formData.resume.name : '📎 Upload Resume'}</span>
              </label>
            </div>
            <div className="form-footer">
              <label className="declaration">
                <input
                  type="checkbox"
                  name="declaration"
                  checked={formData.declaration}
                  onChange={handleChange}
                />
                I hereby declare that the above information is true to the best of my knowledge and belief
              </label>
              <button type="submit" className="submit-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CandidateModal;
