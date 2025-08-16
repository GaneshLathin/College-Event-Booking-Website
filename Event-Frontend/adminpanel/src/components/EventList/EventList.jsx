import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

const EventList = () => {
  const [groupedEvents, setGroupedEvents] = useState({});
  const [editEvent, setEditEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchEvents = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/events');
      const grouped = res.data.reduce((acc, event) => {
        acc[event.category] = acc[event.category] || [];
        acc[event.category].push(event);
        return acc;
      }, {});
      setGroupedEvents(grouped);
    } catch (error) {
      toast.error("Failed to load events");
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleEdit = (event) => {
    setEditEvent({
      ...event,
      rulesAndRegulations: event.rulesAndRegulations || '',
      startTime: event.startTime || '',
      endTime: event.endTime || '',
      date: event.date || '',
      teamSize: event.teamSize || 1,
      registrationClosed: event.registrationClosed || false,
    });
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setEditEvent(null);
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setEditEvent((prev) => ({ ...prev, [name]: val }));
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append('title', editEvent.title);
      formData.append('description', editEvent.description);
      formData.append('category', editEvent.category);
      formData.append('rulesAndRegulations', editEvent.rulesAndRegulations);
      formData.append('startTime', editEvent.startTime);
      formData.append('endTime', editEvent.endTime);
      formData.append('date', editEvent.date);
      formData.append('teamSize', editEvent.teamSize);
      formData.append('registrationClosed', editEvent.registrationClosed);

      if (editEvent.image && typeof editEvent.image !== 'string') {
        formData.append('image', editEvent.image);
      }

      await axios.put(`http://localhost:8080/api/events/${editEvent.id}`, formData);
      toast.success("Event updated successfully");
      setShowModal(false);
      fetchEvents();
    } catch (error) {
      toast.error("Failed to update event");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/events/${id}`);
      toast.success("Event deleted");
      fetchEvents();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="container mt-5">
      <h3 className="mb-4">Event List</h3>
      {Object.entries(groupedEvents).map(([category, events]) => (
        <div key={category}>
          <h4 className="mt-4">{category}</h4>
          <div className="row">
            {events.map((event) => (
              <div className="col-md-4 mb-4" key={event.id}>
                <div className="card h-100 shadow-sm">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="card-img-top"
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{event.title}</h5>
                    <p className="card-text"><strong>Description:</strong> {event.description}</p>
                    <p className="card-text"><strong>Date:</strong> {event.date}</p>
                    <p className="card-text"><strong>Time:</strong> {event.startTime} - {event.endTime}</p>
                    <p className="card-text"><strong>Team Size:</strong> {event.teamSize}</p>
                    <p className="card-text"><strong>Rules:</strong> {event.rulesAndRegulations}</p>
                    <p className="card-text text-danger">
                      {event.registrationClosed ? "Registration Closed" : "Registration Open"}
                    </p>
                    <Button variant="primary" onClick={() => handleEdit(event)} className="me-2">
                      Edit
                    </Button>
                    <Button variant="danger" onClick={() => handleDelete(event.id)}>
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editEvent && (
            <>
              <input
                type="text"
                name="title"
                value={editEvent.title}
                onChange={handleEditChange}
                className="form-control mb-2"
                placeholder="Title"
              />
              <textarea
                name="description"
                value={editEvent.description}
                onChange={handleEditChange}
                className="form-control mb-2"
                placeholder="Description"
              />
              <select
                name="category"
                value={editEvent.category}
                onChange={handleEditChange}
                className="form-select mb-2"
              >
                <option value="Online Events">Online Events</option>
                <option value="Gaming">Gaming</option>
                <option value="Dance">Dance</option>
                <option value="Music">Music</option>
                <option value="Quiz">Quiz</option>
                <option value="Creative Arts">Creative Arts</option>
                <option value="Performing Arts">Performing Arts</option>
                <option value="Theater Arts">Theater Arts</option>
              </select>

              <textarea
                name="rulesAndRegulations"
                value={editEvent.rulesAndRegulations}
                onChange={handleEditChange}
                className="form-control mb-2"
                placeholder="Rules & Regulations"
              />

              <input
                type="text"
                name="startTime"
                value={editEvent.startTime}
                onChange={handleEditChange}
                className="form-control mb-2"
                placeholder="Start Time"
              />
              <input
                type="text"
                name="endTime"
                value={editEvent.endTime}
                onChange={handleEditChange}
                className="form-control mb-2"
                placeholder="End Time"
              />
              <input
                type="date"
                name="date"
                value={editEvent.date}
                onChange={handleEditChange}
                className="form-control mb-2"
              />
              <select
                name="teamSize"
                value={editEvent.teamSize}
                onChange={handleEditChange}
                className="form-select mb-2"
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={4}>4</option>
              </select>
              <input
                type="file"
                name="image"
                className="form-control mb-2"
                onChange={(e) => setEditEvent((prev) => ({ ...prev, image: e.target.files[0] }))}
              />
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="registrationClosed"
                  name="registrationClosed"
                  checked={editEvent.registrationClosed}
                  onChange={handleEditChange}
                />
                <label className="form-check-label" htmlFor="registrationClosed">
                  Registration Closed
                </label>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Cancel</Button>
          <Button variant="success" onClick={handleUpdate}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EventList;
