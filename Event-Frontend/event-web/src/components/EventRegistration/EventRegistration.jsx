import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  FaUser, 
  FaPhone, 
  FaCreditCard, 
  FaUsers,
  FaCalendarAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaArrowLeft,
  FaClock,
  FaStar,
  FaShieldAlt
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const EventRegistration = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [teamMembers, setTeamMembers] = useState([]);
  const [event, setEvent] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isProcessing, setIsProcessing] = useState(false);

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
      alert("Access denied: only students can register for events.");
      navigate("/login");
      return;
    }
  }, [navigate]);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const tokenData = JSON.parse(localStorage.getItem("jwtToken"));
        const res = await axios.get(`http://localhost:8080/api/registrations/${id}`, {
          headers: { Authorization: `Bearer ${tokenData.token}` },
        });
        setEvent(res.data);
        const size = res.data.teamSize || 1;
        const initialMembers = Array.from({ length: size }, () => ({
          name: "",
          phone: "",
        }));
        setTeamMembers(initialMembers);
      } catch (err) {
        setMessage({ type: "error", text: "Event not found." });
      }
    };
    fetchEvent();
  }, [id]);

  const handleChange = (index, field, value) => {
    const updated = [...teamMembers];
    updated[index][field] = value;
    setTeamMembers(updated);
  };

  const openRazorpay = async (amount) => {
    setIsProcessing(true);
    try {
      const tokenData = JSON.parse(localStorage.getItem("jwtToken"));
      const res = await axios.post(
        "http://localhost:8080/api/payment/create-order",
        { amount },
        { headers: { Authorization: `Bearer ${tokenData.token}` } }
      );
      const { orderId, currency } = res.data;
      const sanitizedTitle = event.title.replace(/[^a-zA-Z0-9 ]/g, "");

      const options = {
        key: "",
        amount: amount * 100,
        currency,
        name: "College Event",
        description: `Registration for ${sanitizedTitle}`,
        order_id: orderId,
        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              "http://localhost:8080/api/payment/verify",
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              },
              { headers: { Authorization: `Bearer ${tokenData.token}` } }
            );
            if (verifyRes.data.status === "SUCCESS") {
              setMessage({ type: "success", text: "Payment successful!" });
              await axios.post(
                "http://localhost:8080/api/registrations",
                {
                  eventId: id,
                  teamMembers,
                  paymentId: response.razorpay_payment_id,
                  orderId: response.razorpay_order_id,
                  paymentStatus: "SUCCESS",
                },
                { headers: { Authorization: `Bearer ${tokenData.token}` } }
              );
              setTimeout(() => navigate("/events"), 2000);
            } else {
              setMessage({ type: "error", text: "Payment failed!" });
            }
          } catch (verifyError) {
            console.error("🔴 Payment verification failed:", verifyError);
            setMessage({
              type: "error",
              text: "Payment failed! Verification failed.",
            });
          }
        },
        prefill: {
          name: teamMembers[0]?.name || "",
          contact: teamMembers[0]?.phone || "",
        },
        theme: { color: "#800000" },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (err) {
        console.error("🔴 Razorpay Payment Failed:", err.error);
        setMessage({ type: "error", text: "Payment failed at gateway." });
      });
      rzp.open();
    } catch (err) {
      console.error("🔴 Error initiating Razorpay:", err);
      setMessage({ type: "error", text: "Failed to initiate payment." });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const incomplete = teamMembers.some((member) => !member.name || !member.phone);
    if (incomplete) {
      setMessage({
        type: "error",
        text: "Name and phone are required for each team member.",
      });
      return;
    }
    await openRazorpay(100);
  };

  if (!event) {
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
        <div className="row justify-content-center">
          <div className="col-lg-8">
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
                  <h1 className="display-4 fw-bold text-white mb-0">Event Registration</h1>
                </div>
                <div style={{ width: '120px' }}></div> {/* Spacer for center alignment */}
              </div>
              <p className="lead text-light mb-4">Complete your registration details below</p>
              
              {/* Decorative stars */}
              <div className="d-flex justify-content-center mb-4">
                <FaStar className="text-warning mx-1" />
                <FaStar className="text-warning mx-1" />
                <FaStar className="text-warning mx-1" />
              </div>
            </div>

            <div className="card border-0 shadow-lg" style={{ borderRadius: '25px', backgroundColor: 'rgba(255,255,255,0.95)' }}>
              <div className="card-body p-5">
                {/* Event Header */}
                <div className="text-center mb-5 p-4" style={{ 
                  background: 'linear-gradient(135deg, #800000, #a00000)',
                  borderRadius: '20px',
                  color: 'white'
                }}>
                  <h2 className="fw-bold mb-3">{event.title}</h2>
                  <div className="row g-3 justify-content-center">
                    <div className="col-auto">
                      <div className="d-flex align-items-center bg-black bg-opacity-20 px-3 py-2 rounded-pill">
                        <FaUsers className="me-2" />
                        <span className="fw-semibold">Team Size: {event.teamSize || 1}</span>
                      </div>
                    </div>
                    <div className="col-auto">
                      <div className="d-flex align-items-center bg-black bg-opacity-20 px-3 py-2 rounded-pill">
                        <FaCalendarAlt className="me-2" />
                        <span className="fw-semibold">{event.date}</span>
                      </div>
                    </div>
                    <div className="col-auto">
                      <div className="d-flex align-items-center bg-black bg-opacity-20 px-3 py-2 rounded-pill">
                        <FaCreditCard className="me-2" />
                        <span className="fw-semibold">Fee: ₹100</span>
                      </div>
                    </div>
                    {event.startTime && (
                      <div className="col-auto">
                        <div className="d-flex align-items-center bg-black bg-opacity-20 px-3 py-2 rounded-pill">
                          <FaClock className="me-2" />
                          <span className="fw-semibold">{event.startTime} - {event.endTime}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Alert Messages */}
                {message.text && (
                  <div className={`alert ${message.type === 'error' ? 'alert-danger' : 'alert-success'} d-flex align-items-center mb-4 border-0`} role="alert" style={{ borderRadius: '15px' }}>
                    {message.type === 'error' ? 
                      <FaExclamationTriangle className="me-2" /> : 
                      <FaCheckCircle className="me-2" />
                    }
                    {message.text}
                  </div>
                )}

                {/* Registration Form */}
                <form onSubmit={handleSubmit}>
                  <div className="mb-5">
                    <h4 className="mb-4 d-flex align-items-center text-dark">
                      <FaUsers className="text-primary me-3" />
                      Team Member Details
                      <div className="ms-auto">
                        <span className="badge bg-primary px-3 py-2">{teamMembers.length} Member{teamMembers.length > 1 ? 's' : ''}</span>
                      </div>
                    </h4>

                    {teamMembers.map((member, index) => (
                      <div key={index} className="mb-4">
                        <div className="card border-0" style={{ 
                          borderRadius: '20px',
                          background: 'linear-gradient(135deg, #f8f9ff, #ffffff)',
                          boxShadow: '0 5px 20px rgba(0,0,0,0.1)'
                        }}>
                          <div className="card-header border-0 py-3" style={{ 
                            background: index === 0 ? 'linear-gradient(135deg, #800000, #a00000)' : 'linear-gradient(135deg, #6c757d, #5a6268)',
                            borderRadius: '20px 20px 0 0',
                            color: 'white'
                          }}>
                            <h6 className="mb-0 d-flex align-items-center fw-bold">
                              <FaUser className="me-3" />
                              Member {index + 1}
                              {index === 0 && <span className="badge bg-warning text-dark ms-3">Team Leader</span>}
                            </h6>
                          </div>
                          <div className="card-body p-4">
                            <div className="row g-4">
                              <div className="col-md-6">
                                <label className="form-label fw-semibold text-muted mb-2">
                                  <FaUser className="me-2" size={14} />
                                  Full Name *
                                </label>
                                <input
                                  type="text"
                                  className="form-control form-control-lg border-2"
                                  placeholder="Enter full name"
                                  value={member.name}
                                  onChange={(e) => handleChange(index, "name", e.target.value)}
                                  required
                                  style={{ 
                                    borderRadius: '15px',
                                    borderColor: '#e3e6f0',
                                    padding: '12px 20px'
                                  }}
                                />
                              </div>
                              <div className="col-md-6">
                                <label className="form-label fw-semibold text-muted mb-2">
                                  <FaPhone className="me-2" size={14} />
                                  Phone Number *
                                </label>
                                <input
                                  type="tel"
                                  className="form-control form-control-lg border-2"
                                  placeholder="Enter phone number"
                                  value={member.phone}
                                  onChange={(e) => handleChange(index, "phone", e.target.value)}
                                  required
                                  pattern="[0-9]{10}"
                                  style={{ 
                                    borderRadius: '15px',
                                    borderColor: '#e3e6f0',
                                    padding: '12px 20px'
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Payment Section */}
                  <div className="card border-0 mb-5" style={{ 
                    borderRadius: '20px',
                    background: 'linear-gradient(135deg, #800000, #a00000)',
                    color: 'white'
                  }}>
                    <div className="card-body p-5 text-center">
                      <FaCreditCard className="mb-3" size={50} />
                      <h4 className="mb-3 fw-bold">Registration Fee</h4>
                      <h1 className="fw-bold mb-3">₹100</h1>
                      <p className="mb-0 opacity-75 d-flex align-items-center justify-content-center">
                        <FaShieldAlt className="me-2" />
                        Secure payment via Razorpay
                      </p>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="text-center">
                    <button
                      type="submit"
                      className="btn btn-lg px-5 py-4 fw-bold text-white border-0"
                      disabled={isProcessing}
                      style={{
                        borderRadius: '50px',
                        background: 'linear-gradient(45deg, #800000, #a00000)',
                        minWidth: '250px',
                        fontSize: '1.2rem',
                        boxShadow: '0 10px 30px rgba(128,0,0,0.3)',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 15px 40px rgba(128,0,0,0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 10px 30px rgba(128,0,0,0.3)';
                      }}
                    >
                      {isProcessing ? (
                        <>
                          <div className="spinner-border spinner-border-sm me-3" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                          Processing Payment...
                        </>
                      ) : (
                        <>
                          <FaCreditCard className="me-3" />
                          Pay & Register Now
                        </>
                      )}
                    </button>
                  </div>

                  {/* Security Note */}
                  <div className="text-center mt-4">
                    <small className="text-muted d-flex align-items-center justify-content-center">
                      <FaShieldAlt className="me-2 text-success" />
                      Your payment information is secure and encrypted with 256-bit SSL
                    </small>
                  </div>
                </form>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="text-center mt-5">
              <div className="card border-0 bg-white bg-opacity-10" style={{ borderRadius: '15px' }}>
                <div className="card-body py-3">
                  <small className="text-light">
                    By registering, you agree to the event terms and conditions. 
                    Registration fee is non-refundable after successful payment.
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventRegistration;