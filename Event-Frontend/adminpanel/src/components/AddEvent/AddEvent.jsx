import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

const AddEvent = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    image: null,
    rulesAndRegulations: '',
    startTime: '',
    endTime: '',
    date: '',
    teamSize: 1,
  });

  const categories = [
    'Online Events',
    'Gaming',
    'Dance',
    'Music',
    'Quiz',
    'Creative Arts',
    'Performing Arts',
    'Theater Arts'
  ];

  // ------------------ Access Control ------------------
  useEffect(() => {
    const tokenData = localStorage.getItem('jwtToken');
    if (!tokenData) {
      navigate('/login');
      return;
    }

    let parsedToken;
    try {
      parsedToken = JSON.parse(tokenData);
    } catch (err) {
      console.error('Invalid token format:', err);
      localStorage.removeItem('jwtToken');
      navigate('/login');
      return;
    }

    if (parsedToken.role !== 'ADMIN') {
      alert('Access denied: only admins can add events.');
      navigate('/login');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setForm((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.image) return toast.error("Please upload an image!");

    const tokenData = localStorage.getItem('jwtToken');
    const parsedToken = JSON.parse(tokenData);

    const data = new FormData();
    Object.keys(form).forEach((key) => {
      data.append(key, form[key]);
    });

    try {
      await axios.post(
        'http://localhost:8080/api/admin/events/',
        data,
        { headers: { Authorization: `Bearer ${parsedToken.token}` } }
      );
      toast.success('Event added successfully!');
      setForm({
        title: '',
        description: '',
        category: '',
        image: null,
        rulesAndRegulations: '',
        startTime: '',
        endTime: '',
        date: '',
        teamSize: 1
      });
      e.target.reset();
    } catch (err) {
      console.error(err);
      toast.error('Upload failed!');
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        <h3 className="mb-4 text-primary">Add New Event</h3>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {/* Title */}
          <div className="mb-3">
            <label className="form-label">Title</label>
            <input name="title" value={form.title} onChange={handleChange} className="form-control" required />
          </div>

          {/* Description */}
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} className="form-control" rows={3} required />
          </div>

          {/* Category */}
          <div className="mb-3">
            <label className="form-label">Category</label>
            <select name="category" value={form.category} onChange={handleChange} className="form-select" required>
              <option value="">-- Select Category --</option>
              {categories.map((cat, i) => <option key={i} value={cat}>{cat}</option>)}
            </select>
          </div>

          {/* Rules */}
          <div className="mb-3">
            <label className="form-label">Rules & Regulations</label>
            <textarea name="rulesAndRegulations" value={form.rulesAndRegulations} onChange={handleChange} className="form-control" rows={2} />
          </div>

          {/* Date */}
          <div className="mb-3">
            <label className="form-label">Date</label>
            <input type="date" name="date" value={form.date} onChange={handleChange} className="form-control" required />
          </div>

          {/* Start Time */}
          <div className="mb-3">
            <label className="form-label">Start Time</label>
            <input type="text" name="startTime" value={form.startTime} onChange={handleChange} className="form-control" placeholder="e.g. 10:00 AM" required />
          </div>

          {/* End Time */}
          <div className="mb-3">
            <label className="form-label">End Time</label>
            <input type="text" name="endTime" value={form.endTime} onChange={handleChange} className="form-control" placeholder="e.g. 2:00 PM" required />
          </div>

          {/* Team Size */}
          <div className="mb-3">
            <label className="form-label">Team Size</label>
            <select name="teamSize" value={form.teamSize} onChange={handleChange} className="form-select" required>
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={4}>4</option>
            </select>
          </div>

          {/* Image */}
          <div className="mb-3">
            <label className="form-label">Image</label>
            <input type="file" name="image" onChange={handleFileChange} className="form-control" accept="image/*" required />
          </div>

          <button type="submit" className="btn btn-success w-100">Upload Event</button>
        </form>
      </div>
    </div>
  );
};

export default AddEvent;
