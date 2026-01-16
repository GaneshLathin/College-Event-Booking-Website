import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  FaCalendarAlt, 
  FaClock, 
  FaUsers, 
  FaFileAlt,
  FaExclamationCircle,
  FaCheckCircle,
  FaArrowLeft,
  FaStar,
  FaTrophy,
  FaGift,
  FaMapMarkerAlt
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const RegisteredEvents = () => {
  const [events, setEvents] = useState([]);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const tokenData = localStorage.getItem("jwtToken");
    if (!tokenData) {
      navigate("/login");
      return;
    }
    let parsedToken;
    try {
      parsedToken = JSON.parse(tokenData);
    } catch (err) {
      console.error("Invalid token format:", err);
      localStorage.removeItem("jwtToken");
      navigate("/login");
      return;
    }
    if (parsedToken.role !== "STUDENT") {
      alert("Access denied: only students can view registered events.");
      navigate("/login");
      return;
    }

    const fetchUserEvents = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/api/registrations/user",
          {
            headers: {
              Authorization: `Bearer ${parsedToken.token}`,
            },
          }
        );
        console.log("Fetched Registered Events:", res.data);
        setEvents(res.data);
      } catch (error) {
        console.error("Error fetching events:", error);
        setMessage({
          type: "error",
          text: "Could not load your registered events. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserEvents();
  }, [navigate]);

  if (loading) {
    return (
      <div 
        className="min-vh-100 d-flex justify-content-center align-items-center position-relative"
        style={{
          backgroundImage: "url('../../assests/image2.jpg')",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "top center",
          backgroundSize: "100% 100%",
          backgroundAttachment: "fixed",
          backgroundColor: "#000"
        }}
      >
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{ backgroundColor: "rgba(0,0,0,0.7)" }}></div>
        <div className="text-center position-relative">
          <div className="spinner-border text-light mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <h5 className="text-light">Loading your events...</h5>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-vh-100 position-relative"
      style={{
        backgroundImage: `url(${require("../../assests/image2.jpg")})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "top center",
        backgroundSize: "100% 100%",
        backgroundAttachment: "fixed",
        backgroundColor: "#000"
      }}
    >
      {/* Dark overlay */}
      <div className="position-absolute top-0 start-0 w-100 h-100" style={{ backgroundColor: "rgba(0,0,0,0.8)" }}></div>
      
      <div className="container py-5 position-relative">
        {/* Header with back button */}
        <div className="text-center mb-5">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <button 
              className="btn btn-outline-light btn-lg px-4"
              onClick={() => navigate("/events")}
              style={{ borderRadius: '50px' }}
            >
              <FaArrowLeft className="me-2" />
              Back
            </button>
            <div className="text-center flex-grow-1">
              <h1 className="display-3 fw-bold text-white mb-0">My Registered Events</h1>
            </div>
            <div style={{ width: '120px' }}></div> {/* Spacer for center alignment */}
          </div>
          <p className="lead text-light mb-4">Track all your upcoming events in one place</p>
          
          {/* Decorative elements */}
          <div className="d-flex justify-content-center mb-4">
            <FaTrophy className="text-warning mx-2" size={24} />
            <FaStar className="text-warning mx-2" size={20} />
            <FaTrophy className="text-warning mx-2" size={24} />
          </div>
        </div>

        {/* Message Alert */}
        {message.text && (
          <div className="row justify-content-center mb-4">
            <div className="col-lg-8">
              <div 
                className={`alert ${message.type === 'error' ? 'alert-danger' : 'alert-success'} d-flex align-items-center border-0`} 
                role="alert"
                style={{ 
                  borderRadius: '15px',
                  backgroundColor: message.type === 'error' ? 'rgba(220, 53, 69, 0.9)' : 'rgba(25, 135, 84, 0.9)'
                }}
              >
                <FaExclamationCircle className="me-2" />
                {message.text}
              </div>
            </div>
          </div>
        )}

        {/* Events Grid */}
        {events.length === 0 ? (
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="card shadow-lg border-0" style={{ 
                borderRadius: '25px',
                backgroundColor: 'rgba(255,255,255,0.95)'
              }}>
                <div className="card-body text-center p-5">
                  <div className="mb-4">
                    <FaCalendarAlt className="text-muted mb-3" size={80} />
                  </div>
                  <h3 className="text-muted mb-4 fw-bold">No Events Registered</h3>
                  <p className="text-muted mb-4 lead">You haven't registered for any events yet. Browse available events to get started on your journey!</p>
                  <button 
                    className="btn btn-lg px-5 py-3 fw-bold text-white border-0"
                    onClick={() => navigate("/events")}
                    style={{
                      borderRadius: '50px',
                      background: 'linear-gradient(45deg, #800000, #a00000)',
                      boxShadow: '0 10px 30px rgba(128,0,0,0.3)'
                    }}
                  >
                    <FaGift className="me-2" />
                    Browse Events
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="row g-4 mb-5">
              {events.map((event, index) => (
                <div key={event.id} className="col-xl-4 col-lg-6 col-md-6">
                  <div 
                    className="card h-100 border-0 shadow-lg" 
                    style={{
                      borderRadius: '25px',
                      backgroundColor: 'rgba(255,255,255,0.95)',
                      transition: 'all 0.4s ease',
                      overflow: 'hidden'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-15px) scale(1.02)';
                      e.currentTarget.style.boxShadow = '0 25px 50px rgba(0,0,0,0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
                    }}
                  >
                    {/* Event Image */}
                    {event.image && (
                      <div style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
                        <img
                          src={event.image}
                          alt={event.title}
                          className="card-img-top"
                          style={{ 
                            height: '100%', 
                            objectFit: 'cover',
                            transition: 'transform 0.4s ease'
                          }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.transform = 'scale(1.1)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = 'scale(1)';
                          }}
                        />
                        {/* Success overlay */}
                        <div className="position-absolute top-0 end-0 m-3">
                          <span className="badge bg-success px-3 py-2 fs-6" style={{ borderRadius: '50px' }}>
                            <FaCheckCircle className="me-2" />
                            Registered
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="card-body p-4">
                      {/* Event Title */}
                      <div className="mb-3">
                        <h4 className="card-title fw-bold text-primary mb-2">{event.title}</h4>
                        <div className="d-flex align-items-center">
                          <FaStar className="text-warning me-1" size={14} />
                          <FaStar className="text-warning me-1" size={14} />
                          <FaStar className="text-warning me-1" size={14} />
                          <FaStar className="text-warning me-1" size={14} />
                          <FaStar className="text-warning me-2" size={14} />
                          <small className="text-muted">Premium Event</small>
                        </div>
                      </div>

                      {/* Event Details */}
                      <div className="mb-3">
                        <div className="row g-2">
                          <div className="col-12">
                            <div className="d-flex align-items-center p-2 bg-light rounded-3 mb-2">
                              <FaCalendarAlt className="text-primary me-3" size={16} />
                              <div>
                                <small className="text-muted d-block">Date</small>
                                <span className="fw-semibold">{event.date || "Date TBA"}</span>
                              </div>
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="d-flex align-items-center p-2 bg-light rounded-3">
                              <FaClock className="text-warning me-2" size={14} />
                              <div>
                                <small className="text-muted d-block">Time</small>
                                <small className="fw-semibold">{event.startTime} - {event.endTime}</small>
                              </div>
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="d-flex align-items-center p-2 bg-light rounded-3">
                              <FaUsers className="text-success me-2" size={14} />
                              <div>
                                <small className="text-muted d-block">Team</small>
                                <small className="fw-semibold">{event.teamSize || 1} Member{(event.teamSize > 1) ? 's' : ''}</small>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="mb-3">
                        <p className="card-text text-muted" style={{ 
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          lineHeight: '1.4'
                        }}>
                          {event.description}
                        </p>
                      </div>

                      {/* Rules Section */}
                      {event.rulesAndRegulations && (
                        <div className="mt-auto">
                          <div className="border-top pt-3">
                            <div className="d-flex align-items-center mb-2">
                              <FaFileAlt className="text-info me-2" size={14} />
                              <small className="text-info fw-semibold">Rules & Guidelines</small>
                            </div>
                            <p className="small text-muted" style={{ 
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden'
                            }}>
                              {event.rulesAndRegulations}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Card Footer */}
                    <div className="card-footer border-0 p-4" style={{ 
                      background: 'linear-gradient(135deg, #f8f9ff, #ffffff)'
                    }}>
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <FaCheckCircle className="text-success me-2" />
                          <small className="text-success fw-semibold">Registration Confirmed</small>
                        </div>
                        <div className="d-flex align-items-center">
                          <FaMapMarkerAlt className="text-muted me-1" size={12} />
                          <small className="text-muted">College Campus</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats Section */}
            <div className="row justify-content-center mb-5">
              <div className="col-lg-8">
                <div className="card border-0 shadow-lg" style={{ 
                  borderRadius: '20px',
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(248,249,255,0.95))'
                }}>
                  <div className="card-body p-4">
                    <div className="row text-center g-4">
                      <div className="col-md-4">
                        <div className="p-3">
                          <FaTrophy className="text-warning mb-2" size={30} />
                          <h4 className="fw-bold text-primary mb-1">{events.length}</h4>
                          <small className="text-muted">Total Events</small>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="p-3">
                          <FaCheckCircle className="text-success mb-2" size={30} />
                          <h4 className="fw-bold text-success mb-1">{events.length}</h4>
                          <small className="text-muted">Confirmed</small>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="p-3">
                          <FaGift className="text-info mb-2" size={30} />
                          <h4 className="fw-bold text-info mb-1">₹{events.length * 100}</h4>
                          <small className="text-muted">Total Investment</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Call to Action */}
        <div className="text-center">
          <div className="card border-0 bg-white bg-opacity-10" style={{ borderRadius: '20px' }}>
            <div className="card-body py-4">
              <p className="text-light mb-3 lead">Ready to join more exciting events?</p>
              <button 
                className="btn btn-outline-light btn-lg px-4 py-2"
                onClick={() => navigate("/events")}
                style={{ borderRadius: '50px' }}
              >
                Explore More Events
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisteredEvents;