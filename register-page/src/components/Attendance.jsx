import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Attendance.css';

const Attendance = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/candidates');
        setEmployees(res.data);
      } catch (err) {
        console.error('Error fetching attendance data:', err);
      }
    };

    fetchEmployees();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      // Optional: Update on backend
      await axios.put(`http://localhost:5000/api/candidates/${id}`, {
        status: newStatus,
      });

      // Update on frontend
      setEmployees((prev) =>
        prev.map((emp) =>
          emp._id === id ? { ...emp, status: newStatus } : emp
        )
      );
    } catch (err) {
      console.error('Error updating status:', err);
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

      <div className="attendance-container">
        <div className="attendance-header">
          <h2>Attendance</h2>
          <div className='newdiv'>
            <select className="filter-select">
              <option>Status</option>
            </select>
            <input type="text" placeholder="Search" className="search-input" />
          </div>
        </div>

        <table className="attendance-table">
          <thead>
            <tr>
              <th>Profile</th>
              <th>Employee Name</th>
              <th>Position</th>
              <th>Department</th>
              <th>Task</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp._id}>
                <td>
                  <img src={emp.profile} alt={emp.name} className="avatar" />
                </td>
                <td>{emp.name}</td>
                <td>{emp.position?.split(' ')[1] || '-'}</td>
                <td>{emp.position?.split(' ')[0] || '-'}</td>
                {/* <td>{emp.task}</td> */}
                <td>Design Admin-Panel</td>
                <td>
                  <select
                    value={emp.status}
                    onChange={(e) =>
                      handleStatusChange(emp._id, e.target.value)
                    }
                    className={`status-dropdown ${emp.status?.toLowerCase()}`}
                  >
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                  </select>
                </td>
                <td>
                  <button className="action-btn">...</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Attendance;
