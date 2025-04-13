import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import './Leaves.css';
import AddLeavePopup from './AddLeavePopup';
import { useNavigate } from 'react-router-dom';

const Leaves = () => {
  const [date, setDate] = useState(new Date());
  const [leaves, setLeaves] = useState([]);
  const [showPopup, setShowPopup] = useState(false);


  const handleStatusChange = (index, newStatus) => {
    const updatedLeaves = [...leaves];
    updatedLeaves[index].status = newStatus;
    setLeaves(updatedLeaves);
    localStorage.setItem('leaves', JSON.stringify(updatedLeaves));
  };
  
  useEffect(() => {
    const storedLeaves = localStorage.getItem('leaves');
    if (storedLeaves) {
      setLeaves(JSON.parse(storedLeaves));
    } else {
      fetchLeavesFromBackend();
    }
  }, []);

  const fetchLeavesFromBackend = async () => {
    try {
      const res = await axios.get('https://assignment-2-frontend.onrender.com/api/leaves');
      setLeaves(res.data);
      localStorage.setItem('leaves', JSON.stringify(res.data)); 
    } catch (err) {
      console.error('Error fetching leaves:', err);
    }
  };

  const handleAddLeave = (newLeave) => {
    const updatedLeaves = [...leaves, newLeave];
    setLeaves(updatedLeaves);
    localStorage.setItem('leaves', JSON.stringify(updatedLeaves)); 
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
          <a href="/employees">👔 Employees</a>
          <a href="/attendance">🕒 Attendance</a>
          <a href="/leaves" className="active">📅 Leaves</a>
          <p className="section">Others</p>
          <button onClick={handleLogout} className="logout-btn">🚪 Logout</button>
        </nav>
      </aside>

      <div className="leaves-page">
        <header className="leaves-header">
          <h2>Leaves</h2>
          <div className="leave-controls">
            <div className='one'>
              <select>
                <option>Status</option>
              </select>
            </div>
            <div className='two'>
              <input type="text" placeholder="🔍 Search" />
              <button className="add-leave-btn" onClick={() => setShowPopup(true)}>Add Leave</button>
            </div>
          </div>
        </header>

        <div className="leaves-content">
          <div className="leave-table-section">
            <div className="leave-table-header">Applied Leaves</div>
            <table className="leave-table">
              <thead>
                <tr>
                  <th>Profile</th>
                  <th>Name</th>
                  <th>Date</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Docs</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map((leave, index) => (
                  <tr key={index}>
                    <td><img src={leave.avatar || "#"} alt="profile" className="profile-pic" /></td>
                    <td>
                      {leave.name}
                      <br />
                      <span className="role">{leave.role}</span>
                    </td>
                    <td>{leave.date}</td>
                    <td>{leave.reason}</td>
                    <td>
  <select
    value={leave.status}
    onChange={(e) => handleStatusChange(index, e.target.value)}
    className={`status-dropdown ${leave.status.toLowerCase()}`}
  >
    <option value="Pending">Pending</option>
    <option value="Approved">Approved</option>
    <option value="Rejected">Rejected</option>
  </select>
</td>
                    <td>{leave.docs || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="calendar-section">
            <div className="calendar-box">
              <h4>Leave Calendar</h4>
              <Calendar onChange={setDate} value={date} />
            </div>
            <div className="approved-leaves">
              <h4>Approved Leaves:</h4>
              {leaves
                .filter(l => l.status === 'Approved')
                .map((l, i) => (
                  <div className="approved-item" key={i}>
                    <img src={l.avatar || "#"} alt="profile" className="profile-pic" />
                    {l.name} - {l.date}
                  </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 👇 AddLeavePopup modal */}
      {showPopup && (
        <AddLeavePopup
          onClose={() => setShowPopup(false)}
          onAdd={handleAddLeave}
        />
      )}
    </div>
  );
};

export default Leaves;
