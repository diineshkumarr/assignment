import React, { useState, useEffect } from 'react';
import './AddLeavePopup.css';
import axios from 'axios';

const AddLeavePopup = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    date: '',
    reason: '',
    docs: '',
    status: 'Approved',
    avatar: '#'
  });

  const [employees, setEmployees] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get('https://assignment-2-frontend.onrender.com/api/candidates');
        setEmployees(res.data);
      } catch (err) {
        console.error('Error fetching employees:', err);
      }
    };

    fetchEmployees();
  }, []);

  const handleChange = e => {
    const { name, value, files } = e.target;

    if (name === 'name') {
      const matches = employees.filter(emp =>
        emp.name.toLowerCase().includes(value.toLowerCase())
      );
      setFiltered(matches);
      setFormData({ ...formData, name: value, role: '', avatar: '#' });
      setSelectedEmployee(null);
    } else if (name === 'docs') {
      setFormData({ ...formData, docs: files[0]?.name || '' });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSelectEmployee = (emp) => {
    setSelectedEmployee(emp);
    setFiltered([]);
    setFormData({
      ...formData,
      name: emp.name,
      role: emp.position,
      avatar: emp.avatar || '#'
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('https://assignment-2-frontend.onrender.com/api/leaves', formData);
      onAdd(res.data);
      onClose();
    } catch (error) {
      console.error('Error submitting leave:', error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>Add New Leave</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="dropdown-container">
            <input
              type="text"
              name="name"
              placeholder="Search Employee Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            {filtered.length > 0 && (
              <ul className="dropdown">
                {filtered.map((emp, i) => (
                  <li key={i} onClick={() => handleSelectEmployee(emp)}>
                    {emp.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <input
            type="text"
            name="role"
            placeholder="Designation*"
            value={formData.role}
            onChange={handleChange}
            required
            readOnly
          />
          <input type="date" name="date" onChange={handleChange} required />
          <input type="file" name="docs" onChange={handleChange} />
          <input type="text" name="reason" placeholder="Reason*" onChange={handleChange} required />
          <button type="submit" className="save-btn">Save</button>
        </form>
      </div>
    </div>
  );
};

export default AddLeavePopup;
