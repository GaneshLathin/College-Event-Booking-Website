import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => (
  <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow">
    <div className="container">
      <Link className="navbar-brand fw-bold" to="/">Event Booking</Link>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/add">Add Event</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/events">All Events</Link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
);

export default Navbar;
