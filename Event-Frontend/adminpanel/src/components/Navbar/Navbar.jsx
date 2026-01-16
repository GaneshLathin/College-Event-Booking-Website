import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("jwtToken");

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">Event Booking</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto">
            {token ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/add">Add Event</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/events">All Events</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/registered-events">Registered Teams</Link>
                </li>
                <li className="nav-item">
                  <button className="btn btn-danger ms-2" onClick={handleLogout}>Logout</button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/">Login</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
