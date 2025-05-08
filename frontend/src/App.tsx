import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
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
            <Link to="/">Admin Services</Link>
            <Link to="/book">Book Appointment</Link>
            <Link to="/availability">Admin Appointments</Link>
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
