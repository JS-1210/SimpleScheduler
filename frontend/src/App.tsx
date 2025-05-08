import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import ServiceTypes from './components/ServiceTypes';
import BookAppointment from './pages/BookAppointment';
import AdminAppointments from './pages/AdminAppointments';
import './App.css';

const App: React.FC = () => {
  return (
    <div>
      <nav className="navbar">
        <div className="container">
          <div className="logo">SimpleScheduler</div>
          <div className="nav-links">
            <NavLink to="/" end className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              Admin Services
            </NavLink>
            <NavLink to="/book" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              Book Appointment
            </NavLink>
            <NavLink to="/availability" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              Admin Appointments
            </NavLink>
          </div>
        </div>
      </nav>

      <main className="container">
        <Routes>
          <Route path="/" element={<ServiceTypes />} />
          <Route path="/book" element={<BookAppointment />} />
          <Route path="/availability" element={<AdminAppointments />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
