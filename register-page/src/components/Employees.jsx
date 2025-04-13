import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Employees.css'; 
import EditEmployeeModal from '../components/EditEmployeeModal'; 
import { useNavigate } from 'react-router-dom';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const openModal = () => setShowModal(true);
  const closeModal = () => {
    setShowModal(false);
    setSelectedCandidate(null);
  };

  const handleEdit = (candidate) => {
    setSelectedCandidate(candidate);
    openModal();
  };

  const handleDelete = async (id) => {
    console.log('Attempting to delete candidate with ID:', id);
    try {
      const res = await axios.delete(`https://assignment-2-frontend.onrender.com/api/candidates/${id}`);
      console.log('Delete response:', res.data);
      alert('Candidate deleted successfully');
      fetchEmployees();
    } catch (err) {
      console.error('Failed to delete candidate:', err.response?.data || err.message);
      alert('Failed to delete candidate');
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await axios.get('https://assignment-2-frontend.onrender.com/api/candidates');
      setEmployees(res.data);
    } catch (err) {
      console.error('Failed to fetch employees:', err);
    }
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
          <a href="/dashboard">👥 Candidates</a>
          <p className="section">Organization</p>
          <a href="/employees" className="active">👔 Employees</a>
          <a href="/attendance">🕒 Attendance</a>
          <a href="/leaves">📅 Leaves</a>
          <p className="section">Others</p>
          <button onClick={handleLogout} className="logout-btn">🚪 Logout</button>
        </nav>
      </aside>

      <main className="main-content">
        <header className="header">
          <h2>Employees</h2>
          <div className="filters">
            <select><option>Position</option></select>
            <input type="text" placeholder="🔍 Search" />
          </div>
        </header>

        <table className="candidates-table">
          <thead>
            <tr>
              <th>Profile</th>
              <th>Employee Name</th>
              <th>Email Address</th>
              <th>Phone Number</th>
              <th>Position</th>
              <th>Department</th>
              <th>Date of Joining</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp, index) => (
              <tr key={emp._id}>
                <td>
                  <img src={emp.profile || '/default-profile.png'} alt="profile" className="avatar" />
                </td>
                <td>{emp.name}</td>
                <td>{emp.email}</td>
                <td>{emp.phone}</td>
                <td>{emp.position?.split(' ')[1] || '-'}</td>
                <td>{emp.position?.split(' ')[0] || '-'}</td>
                <td>{new Date(emp.createdAt).toLocaleDateString()}</td>
                <td className="action-cell">
                  <button className="btn" onClick={() => setDropdownVisible(dropdownVisible === emp._id ? null : emp._id)}>
                    ...
                  </button>
                  {dropdownVisible === emp._id && (
                    <div className="dropdown-menu">
                      <button onClick={() => handleEdit(emp)}>Edit</button>
                      <button onClick={() => handleDelete(emp._id)}>Delete</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ✅ NEW: Modal call */}
        {showModal && selectedCandidate && (
          <EditEmployeeModal
            candidate={selectedCandidate}
            onClose={closeModal}
            onSave={fetchEmployees}
          />
        )}
      </main>
    </div>
  );
};

export default Employees;
