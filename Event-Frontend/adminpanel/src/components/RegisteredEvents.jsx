import React, { useEffect, useState } from "react";
import API from "../api";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const RegisteredEvents = () => {
  const [registrations, setRegistrations] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    API.get("/api/registrations/all-registered-events")
      .then((res) => setRegistrations(res.data))
      .catch(() => console.error("Failed to load"));
  }, []);

  // ✅ Unique event names
  const eventNames = [...new Set(registrations.map((reg) => reg.eventName))];

  // ✅ Filter logic
  const filtered = registrations.filter((reg) => {
    const searchLower = search.toLowerCase();
    const matchesSearch =
      reg.eventName.toLowerCase().includes(searchLower) ||
      reg.teamMemberNames.some((name) =>
        name.toLowerCase().includes(searchLower)
      );

    const matchesEvent =
      selectedEvent === "" || reg.eventName === selectedEvent;

    return matchesSearch && matchesEvent;
  });

  // 🔄 Format for export
  const formatData = (data) =>
    data.map((reg) => ({
      Event: reg.eventName,
      "Leader Email": reg.leaderEmail,
      "Team Members": reg.teamMemberNames.join(", "),
      Phones: reg.teamMemberPhones.join(", "),
    }));

  // 📤 Export Excel
  const exportToExcel = (data, filename) => {
    const worksheet = XLSX.utils.json_to_sheet(formatData(data));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Registered Events");

    worksheet["!cols"] = [
      { wch: 20 }, // Event
      { wch: 30 }, // Leader Email
      { wch: 40 }, // Team Members
      { wch: 20 }, // Phones
    ];

    XLSX.writeFile(workbook, filename);
  };

  // 📤 Export PDF
  const exportToPDF = (data, filename) => {
    const doc = new jsPDF({ orientation: "landscape" });
    doc.setFontSize(14);
    doc.text("Registered Events Report", 14, 15);

    const tableColumn = ["Event", "Leader Email", "Team Members", "Phones"];
    const tableRows = data.map((reg) => [
      reg.eventName,
      reg.leaderEmail,
      reg.teamMemberNames.join(", "),
      reg.teamMemberPhones.join(", "),
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 25,
      styles: { halign: "left", valign: "middle" },
      headStyles: { fillColor: [22, 160, 133], halign: "center" },
      columnStyles: {
        0: { cellWidth: 80 },
        1: { cellWidth: 60 },
        2: { cellWidth: 100 },
        3: { cellWidth: 40 },
      },
    });

    doc.save(filename);
  };

  // 📧 Send Email to Event Users
  const sendEmailToEventUsers = () => {
    if (!selectedEvent) {
      alert("Please select an event first.");
      return;
    }
    if (!emailMessage.trim()) {
      alert("Please enter a message.");
      return;
    }

    setLoading(true);

    // ✅ Send as JSON body instead of query params
    API.post("/api/admin/events/send-message", {
      eventName: selectedEvent,
      subject: emailSubject || `Update for ${selectedEvent}`,
      messageBody: emailMessage,
    })
      .then((res) => {
        alert(res.data);
        setEmailSubject("");
        setEmailMessage("");
      })
      .catch((err) => {
        alert(
          err.response?.data || "Failed to send emails. Please try again later."
        );
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="container mt-4">
      <h2>All Registered Events</h2>

      {/* 🔎 Search Box */}
      <input
        type="text"
        placeholder="Search by event or team member..."
        className="form-control mb-3"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* ⬇️ Event Dropdown */}
      <select
        className="form-select mb-3"
        value={selectedEvent}
        onChange={(e) => setSelectedEvent(e.target.value)}
      >
        <option value="">All Events</option>
        {eventNames.map((name, idx) => (
          <option key={idx} value={name}>
            {name}
          </option>
        ))}
      </select>

      {/* 📧 Email Section */}
      <div className="card p-3 mb-4">
        <h5>Send Message to {selectedEvent || "an Event"}</h5>

        <input
          type="text"
          className="form-control mb-2"
          placeholder="Email Subject"
          value={emailSubject}
          onChange={(e) => setEmailSubject(e.target.value)}
        />

        <textarea
          className="form-control mb-2"
          placeholder="Write your message here..."
          rows="6"
          value={emailMessage}
          onChange={(e) => setEmailMessage(e.target.value)}
        ></textarea>

        <button
          className="btn btn-primary"
          onClick={sendEmailToEventUsers}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Email"}
        </button>
      </div>

      {/* 📥 Export Buttons */}
      <div className="mb-3">
        <h5>Export Options</h5>
        <button
          className="btn btn-success me-2"
          onClick={() =>
            exportToExcel(filtered, "Filtered_RegisteredEvents.xlsx")
          }
        >
          Download Filtered Excel
        </button>
        <button
          className="btn btn-danger me-2"
          onClick={() =>
            exportToPDF(filtered, "Filtered_RegisteredEvents.pdf")
          }
        >
          Download Filtered PDF
        </button>
        <button
          className="btn btn-outline-success me-2"
          onClick={() =>
            exportToExcel(registrations, "All_RegisteredEvents.xlsx")
          }
        >
          Download All Excel
        </button>
        <button
          className="btn btn-outline-danger"
          onClick={() =>
            exportToPDF(registrations, "All_RegisteredEvents.pdf")
          }
        >
          Download All PDF
        </button>
      </div>

      {/* 📋 Results */}
      {filtered.length === 0 ? (
        <p>No results found.</p>
      ) : (
        filtered.map((reg, idx) => (
          <div key={idx} className="card mb-3 shadow">
            <div className="card-body">
              <h5 className="card-title">{reg.eventName}</h5>
              <p>
                <b>Leader Email:</b> {reg.leaderEmail}
              </p>
              <p>
                <b>Team Members:</b> {reg.teamMemberNames.join(", ")}
              </p>
              <p>
                <b>Phones:</b> {reg.teamMemberPhones.join(", ")}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default RegisteredEvents;
