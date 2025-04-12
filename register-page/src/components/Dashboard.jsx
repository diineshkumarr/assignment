import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import CandidateModal from './CandidateModal';
import Employees from './Employees';
import Attendance from './Attendance';

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCandidate(null); // Reset selected candidate on modal close
  };

  const fetchCandidates = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/candidates');
      setCandidates(res.data);
    } catch (err) {
      console.error('Failed to fetch candidates:', err);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const handleAddOrUpdateCandidate = () => {
    fetchCandidates(); 
    closeModal();
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/candidates/${id}`, {
        status: newStatus,
      });
      fetchCandidates();
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Failed to update status');
    }
  };

  const handleEdit = (candidate) => {
    setSelectedCandidate(candidate);
    openModal();
  };

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`http://localhost:5000/api/candidates/${id}`);
      alert('Candidate deleted successfully');
      fetchCandidates(); // Refresh list
    } catch (err) {
      console.error('Failed to delete candidate:', err);
      alert('Failed to delete candidate');
    }
  };

  const toggleDropdown = (id) => {
    setDropdownVisible((prev) => (prev === id ? null : id));
  };

  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token'); 
    sessionStorage.clear();
  
    navigate('/login');
  };
  

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="logo">🔳 LOGO</div>
        <input type="text" className="search-box" placeholder="🔍 Search" />
        <nav>
          <p className="section">Recruitment</p>
          <a href="#" className="active">👥 Candidates</a>
          <p className="section">Organization</p>
          <Link to="/employees">👔 Employees</Link>
          <Link to="/attendance">🕒 Attendance</Link>
          <Link to="/leaves">📅 Leaves</Link>
          <p className="section">Others</p>
          <button onClick={handleLogout} className="logout-btn">🚪 Logout</button>
        </nav>
      </aside>

      <main className="main-content">
        <header className="header">
          <h2>Candidates</h2>
          <div className="filters">
            <div className="abc">
              <select><option>Status</option></select>
              <select><option>Position</option></select>
            </div>
            <div className="def">
              <input type="text" placeholder="🔍 Search" />
              <button className="add-btn" onClick={openModal}>Add Candidate</button>
            </div>
          </div>
        </header>

        <table className="candidates-table">
          <thead>
            <tr>
              <th>Sr no.</th>
              <th>Candidate Name</th>
              <th>Email Address</th>
              <th>Phone Number</th>
              <th>Position</th>
              <th>Status</th>
              <th>Experience</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((c, index) => (
              <tr key={c._id}>
                <td>{index + 1}</td>
                <td>{c.name}</td>
                <td>{c.email}</td>
                <td>{c.phone}</td>
                <td>{c.position}</td>
                <td>
                  <select
                    value={c.status}
                    onChange={(e) => handleStatusChange(c._id, e.target.value)}
                    className={`status-dropdown ${c.status?.toLowerCase()}`}
                  >
                    <option value="new">New</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="selected">Selected</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </td>
                <td>{c.experience}</td>
                <td className="action-cell">
                  <button className="btn" onClick={() => toggleDropdown(c._id)}>...</button>
                  {dropdownVisible === c._id && (
                    <div className="dropdown-menu">
                      <button onClick={() => handleEdit(c)}>Edit</button>
                      <button onClick={() => handleDelete(c._id)}>Delete</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {isModalOpen && (
          <CandidateModal
            onClose={closeModal}
            onSave={handleAddOrUpdateCandidate}
            candidate={selectedCandidate}
          />
        )}
      </main>
    </div>
  );
};

export default Dashboard;
