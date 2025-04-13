import React, { useState, useEffect } from 'react';
import './EditEmployeeModal.css';

const EditEmployeeModal = ({ candidate, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    createdAt: ''
  });

  useEffect(() => {
    if (candidate) {
      const [department, position] = candidate.position?.split(' ') || ['', ''];
      setFormData({
        name: candidate.name || '',
        email: candidate.email || '',
        phone: candidate.phone || '',
        position: position || '',
        department: department || '',
        createdAt: candidate.createdAt || ''
      });
    }
  }, [candidate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const updatedPosition = `${formData.department} ${formData.position}`;
      await fetch(`https://assignment-2-frontend.onrender.com/api/candidates/${candidate._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...candidate,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          position: updatedPosition,
          createdAt: formData.createdAt
        })
      });
      onSave();
      onClose();
    } catch (err) {
      console.error('Update failed:', err);
      alert('Failed to update employee');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Edit Employee Details</h2>
          <span className="close-button" onClick={onClose}>×</span>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label>Full Name*</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
            />
          </div>
          <div className="form-group">
            <label>Email Address*</label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
            />
          </div>
          <div className="form-group">
            <label>Phone Number*</label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone Number"
            />
          </div>
          <div className="form-group">
            <label>Department*</label>
            <input
              name="department"
              value={formData.department}
              onChange={handleChange}
              placeholder="Department"
            />
          </div>
          <div className="form-group">
            <label>Position*</label>
            <input
              name="position"
              value={formData.position}
              onChange={handleChange}
              placeholder="Position"
            />
          </div>
          <div className="form-group">
            <label>Date of Joining*</label>
            <input
              type="date"
              name="createdAt"
              value={formData.createdAt?.slice(0, 10)}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="modal-actions">
          <button className="save-button" onClick={handleSubmit}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default EditEmployeeModal;
