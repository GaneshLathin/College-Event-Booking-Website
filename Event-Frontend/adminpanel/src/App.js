import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar/Navbar';
import AddEvent from './components/AddEvent/AddEvent';
import EventList from './components/EventList/EventList';
import RegisteredEvents from './components/RegisteredEvents';
import Login from './components/Login';

function App() {
  return (
    <>
      <ToastContainer />
      <Navbar />
      <Routes>
        <Route path="/add" element={<AddEvent />} />
        <Route path="/events" element={<EventList />} />
        <Route path="/registered-events" element={<RegisteredEvents />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
