import { BrowserRouter, Routes, Route } from "react-router-dom";
import EventorHome from "./components/EventorHome/EventorHome";
import Contact from "./components/Contact/Contact";
import Login from "./components/Login/Login";
import About from "./components/About/About";
import Register from "./components/Register/Register";
import EventsPage from "./components/EventsPage/EventsPage";
import PublicOnlyRoute from "./components/PublicOnlyRoute"; // Import the PublicOnlyRoute
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
import ResetPassword from "./components/ResetPassword/ResetPassword";
import RegisterEvent from "./components/RegisterEvent/RegisterEvent";
import EventRegistration from "./components/EventRegistration/EventRegistration";
import RegisteredEvents from "./components/RegisteredEvents/RegisteredEvents";
import EnhancedChatbot from "./components/EnhancedChatbot";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EventorHome />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/events" element={<EventsPage />} /> {/* This route will likely contain protected content */}

        {/* Routes only accessible when NOT logged in */}
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/registerevent/:id" element={<RegisterEvent />} />
           <Route path="/registration/:id" element={<EventRegistration />} />
          <Route path="/registered-events" element={<RegisteredEvents />} />
         <Route path="/chatbot" element={<EnhancedChatbot/>}/>



        {/* Add more routes as needed */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;