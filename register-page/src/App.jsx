import { Routes, Route } from 'react-router-dom'; // ✅ remove BrowserRouter
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Employees from './components/Employees.jsx';
import Attendance from './components/Attendance';
import Leaves from './components/Leaves.jsx';

// Inside your Routes:


function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/employees" element={<Employees />} />
      <Route path="/attendance" element={<Attendance />} />
      <Route path="/leaves" element={<Leaves />} />
    </Routes>
  );
}

export default App;
