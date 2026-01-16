import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  FaCalendarAlt, 
  FaClock, 
  FaUsers, 
  FaInfoCircle, 
  FaCheckCircle, 
  FaExclamationTriangle,
  FaArrowLeft,
  FaTags,
  FaStar,
  FaMapMarkerAlt,
  FaCreditCard,
  FaShieldAlt,
  FaFileAlt
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const RegisterEvent = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [checkDone, setCheckDone] = useState(false);
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
    console.log(parsedToken.token);

    if (parsedToken.role !== "STUDENT") {
      alert("Access denied: only students can register for events.");
      navigate("/login");
      return;
    }

    const fetchEvent = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/registrations/${id}`, {
          headers: { Authorization: `Bearer ${parsedToken.token}` },
        });
        setEvent(res.data);
      } catch (error) {
        console.error("Failed to fetch event:", error);
      } finally {
        setLoading(false);
      }
    };

    const checkRegistration = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/registrations/user", {
          headers: { Authorization: `Bearer ${parsedToken.token}` },
        });
        const already = res.data.some((ev) => ev.id === id);
        setIsRegistered(already);
      } catch (err) {
        console.error("Error checking registration:", err);
      } finally {
        setCheckDone(true);
      }
    };

    fetchEvent();
    checkRegistration();
  }, [id, navigate]);

  if (loading || !checkDone) {
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
          <h5 className="text-light">Loading event details...</h5>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div 
        className="min-vh-100 d-flex justify-content-center align-items-center position-relative"
        style={{
        backgroundImage: `url(${require("../../assests/image2.jpg")})`,         
        backgroundRepeat: "no-repeat",
          backgroundPosition: "top center",
          backgroundSize: "100% 100%",
          backgroundAttachment: "fixed",
          backgroundColor: "#000"
        }}
      >
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{ backgroundColor: "rgba(0,0,0,0.7)" }}></div>
        <div className="container position-relative">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="card shadow-lg border-0" style={{ 
                borderRadius: '25px',
                backgroundColor: 'rgba(255,255,255,0.95)'
              }}>
                <div className="card-body text-center p-5">
                  <FaExclamationTriangle className="text-danger mb-4" size={80} />
                  <h3 className="text-danger mb-4 fw-bold">Event Not Found</h3>
                  <p className="text-muted mb-4 lead">The event you're looking for doesn't exist or has been removed.</p>
                  <button 
                    className="btn btn-lg px-5 py-3 fw-bold text-white border-0" 
                    onClick={() => navigate("/events")}
                    style={{
                      borderRadius: '50px',
                      background: 'linear-gradient(45deg, #800000, #a00000)',
                      boxShadow: '0 10px 30px rgba(128,0,0,0.3)'
                    }}
                  >
                    <FaArrowLeft className="me-2" />
                    Back to Events
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-vh-100 position-relative"
      style={{
        backgroundImage: "url('../../assests/image2.jpg')",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "top center",
        backgroundSize: "100% 100%",
        backgroundAttachment: "fixed",
        backgroundColor: "#000"
      }}
    >
      {/* Dark overlay */}
      <div className="position-absolute top-0 start-0 w-100 h-100" style={{ backgroundColor: "rgba(0,0,0,0.8)" }}></div>
      
      {/* Hero Section */}
      <div className="container py-5 position-relative">
        {/* Back Button */}
        <div className="row mb-4">
          <div className="col-12">
            <button 
              className="btn btn-outline-light btn-lg px-4"
              onClick={() => navigate("/events")}
              style={{ borderRadius: '50px' }}
            >
              <FaArrowLeft className="me-2" />
              Back to Events
            </button>
          </div>
        </div>

        {/* Hero Image */}
        {event.image && (
          <div className="row justify-content-center mb-5">
            <div className="col-lg-10">
              <div className="position-relative">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-100 shadow-lg"
                  style={{
                    height: '400px',
                    objectFit: 'cover',
                    borderRadius: '25px',
                    filter: 'brightness(0.9)'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                {/* Overlay gradient */}
                <div className="position-absolute bottom-0 start-0 w-100 p-4" 
                     style={{
                       background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                       borderRadius: '0 0 25px 25px'
                     }}>
                  <div className="text-center">
                    <span className="badge bg-warning text-dark px-4 py-2 fs-5 mb-2" style={{ borderRadius: '50px' }}>
                      <FaTags className="me-2" />
                      {event.category}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="card shadow-lg border-0" style={{ 
              borderRadius: '25px',
              backgroundColor: 'rgba(255,255,255,0.95)'
            }}>
              <div className="card-body p-5">
                {/* Header */}
                <div className="text-center mb-5">
                  <h1 className="display-4 fw-bold mb-3" style={{ 
                    background: 'linear-gradient(135deg, #800000, #a00000)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                    {event.title}
                  </h1>
                  
                  {/* Rating Stars */}
                  <div className="d-flex justify-content-center mb-3">
                    <FaStar className="text-warning mx-1" />
                    <FaStar className="text-warning mx-1" />
                    <FaStar className="text-warning mx-1" />
                    <FaStar className="text-warning mx-1" />
                    <FaStar className="text-warning mx-1" />
                    <span className="ms-2 text-muted">Premium Event</span>
                  </div>
                  
                  {!event.image && (
                    <div className="d-inline-block mb-3">
                      <span className="badge bg-gradient bg-info text-dark px-4 py-2 fs-6" style={{ borderRadius: '50px' }}>
                        <FaTags className="me-2" />
                        {event.category}
                      </span>
                    </div>
                  )}
                </div>

                {/* Event Details Cards */}
                <div className="row g-4 mb-5">
                  <div className="col-lg-3 col-md-6">
                    <div className="card border-0 h-100" style={{ 
                      borderRadius: '20px',
                      background: 'linear-gradient(135deg, #800000, #a00000)',
                      color: 'white'
                    }}>
                      <div className="card-body text-center p-4">
                        <FaCalendarAlt className="mb-3" size={30} />
                        <h6 className="mb-1 opacity-75">Event Date</h6>
                        <h5 className="fw-bold mb-0">{event.date}</h5>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-6">
                    <div className="card border-0 h-100" style={{ 
                      borderRadius: '20px',
                      background: 'linear-gradient(135deg, #28a745, #20c997)',
                      color: 'white'
                    }}>
                      <div className="card-body text-center p-4">
                        <FaUsers className="mb-3" size={30} />
                        <h6 className="mb-1 opacity-75">Team Size</h6>
                        <h5 className="fw-bold mb-0">{event.teamSize || 1} Member{(event.teamSize > 1) ? 's' : ''}</h5>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-6">
                    <div className="card border-0 h-100" style={{ 
                      borderRadius: '20px',
                      background: 'linear-gradient(135deg, #ffc107, #fd7e14)',
                      color: 'white'
                    }}>
                      <div className="card-body text-center p-4">
                        <FaClock className="mb-3" size={30} />
                        <h6 className="mb-1 opacity-75">Start Time</h6>
                        <h5 className="fw-bold mb-0">{event.startTime}</h5>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-6">
                    <div className="card border-0 h-100" style={{ 
                      borderRadius: '20px',
                      background: 'linear-gradient(135deg, #dc3545, #e91e63)',
                      color: 'white'
                    }}>
                      <div className="card-body text-center p-4">
                        <FaClock className="mb-3" size={30} />
                        <h6 className="mb-1 opacity-75">End Time</h6>
                        <h5 className="fw-bold mb-0">{event.endTime}</h5>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description Section */}
                <div className="mb-5">
                  <div className="d-flex align-items-center mb-4">
                    <div className="p-3 rounded-circle me-3" style={{ background: 'linear-gradient(135deg, #6f42c1, #e83e8c)' }}>
                      <FaInfoCircle className="text-white" size={24} />
                    </div>
                    <h3 className="mb-0 fw-bold text-dark">Event Description</h3>
                  </div>
                  <div className="card border-0" style={{ 
                    borderRadius: '20px',
                    background: 'linear-gradient(135deg, #f8f9ff, #ffffff)',
                    border: '2px solid #e3e6f0'
                  }}>
                    <div className="card-body p-4">
                      <p className="mb-0 text-muted lh-lg fs-5">{event.description}</p>
                    </div>
                  </div>
                </div>

                {/* Rules & Regulations */}
                <div className="mb-5">
                  <div className="d-flex align-items-center mb-4">
                    <div className="p-3 rounded-circle me-3" style={{ background: 'linear-gradient(135deg, #fd7e14, #ffc107)' }}>
                      <FaFileAlt className="text-white" size={24} />
                    </div>
                    <h3 className="mb-0 fw-bold text-dark">Rules & Regulations</h3>
                  </div>
                  <div className="card border-0" style={{ 
                    borderRadius: '20px',
                    background: 'linear-gradient(135deg, #fff3cd, #ffeaa7)',
                    border: '2px solid #ffeaa7'
                  }}>
                    <div className="card-body p-4">
                      <p className="mb-0 text-dark lh-lg fs-5">
                        {event.rulesAndRegulations || "No specific rules mentioned for this event. General college event guidelines apply."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Status Alerts */}
                {event.registrationClosed && (
                  <div className="alert alert-warning border-0 d-flex align-items-center mb-4" role="alert" 
                       style={{ borderRadius: '15px', backgroundColor: 'rgba(255, 193, 7, 0.2)' }}>
                    <FaExclamationTriangle className="me-3" size={24} />
                    <div className="fs-5">Registration for this event is now closed.</div>
                  </div>
                )}

                {isRegistered && (
                  <div className="alert alert-success border-0 d-flex align-items-center mb-4" role="alert" 
                       style={{ borderRadius: '15px', backgroundColor: 'rgba(25, 135, 84, 0.2)' }}>
                    <FaCheckCircle className="me-3" size={24} />
                    <div className="fs-5">You are already registered for this event!</div>
                  </div>
                )}

                {/* Registration Fee Info */}
                <div className="mb-5">
                  <div className="card border-0" style={{ 
                    borderRadius: '20px',
                    background: 'linear-gradient(135deg, #17a2b8, #20c997)',
                    color: 'white'
                  }}>
                    <div className="card-body text-center p-4">
                      <div className="row align-items-center">
                        <div className="col-md-3">
                          <FaCreditCard size={40} />
                        </div>
                        <div className="col-md-6">
                          <h4 className="fw-bold mb-1">Registration Fee</h4>
                          <h2 className="fw-bold mb-0">₹100</h2>
                        </div>
                        <div className="col-md-3">
                          <FaShieldAlt size={30} className="opacity-75" />
                          <div className="small opacity-75 mt-1">Secure Payment</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Registration Button */}
                <div className="text-center mb-4">
                  <button
                    className={`btn btn-lg px-5 py-4 fw-bold text-white border-0 position-relative`}
                    disabled={isRegistered || event.registrationClosed}
                    onClick={() => navigate(`/registration/${id}`)}
                    style={{
                      borderRadius: '50px',
                      fontSize: '1.3rem',
                      minWidth: '300px',
                      background: isRegistered 
                        ? 'linear-gradient(45deg, #28a745, #20c997)' 
                        : event.registrationClosed 
                          ? 'linear-gradient(45deg, #6c757d, #495057)'
                          : 'linear-gradient(45deg, #800000, #a00000)',
                      boxShadow: '0 15px 35px rgba(128,0,0,0.4)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!isRegistered && !event.registrationClosed) {
                        e.target.style.transform = 'translateY(-3px)';
                        e.target.style.boxShadow = '0 20px 40px rgba(128,0,0,0.5)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 15px 35px rgba(128,0,0,0.4)';
                    }}
                  >
                    {isRegistered ? (
                      <>
                        <FaCheckCircle className="me-3" size={20} />
                        Already Registered
                      </>
                    ) : event.registrationClosed ? (
                      <>
                        <FaExclamationTriangle className="me-3" size={20} />
                        Registration Closed
                      </>
                    ) : (
                      <>
                        <FaCreditCard className="me-3" size={20} />
                        Register Now - ₹100
                      </>
                    )}
                  </button>
                </div>

                {/* Additional Info */}
                <div className="text-center">
                  <div className="d-flex justify-content-center align-items-center text-muted">
                    <FaMapMarkerAlt className="me-2" />
                    <span>College Campus</span>
                    <span className="mx-3">•</span>
                    <FaShieldAlt className="me-2" />
                    <span>Secure Payment</span>
                    <span className="mx-3">•</span>
                    <FaCreditCard className="me-2" />
                    <span>Instant Confirmation</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterEvent;

