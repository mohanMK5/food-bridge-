import { useState, useEffect } from "react";
import { api } from "../api.js";

function NgoDashboard({ user }) {
  const [donations, setDonations] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadDonations() {
    try {
      const data = await api.getAllDonations(search);
      setDonations(data);
    } catch (err) {
      setError(err.message);
    }
  }

  // load again whenever the search text changes
  useEffect(() => {
    loadDonations();
  }, [search]);

  async function handleAccept(id) {
    setError("");
    setMessage("");

    try {
      await api.acceptDonation(id);
      setMessage("You accepted this donation. Please contact the donor for pickup.");
      loadDonations();
    } catch (err) {
      setError(err.message);
      loadDonations();
    }
  }

  // filter buttons: all / pending / accepted
  const shownDonations = donations.filter((d) => {
    if (filter === "all") return true;
    return d.status === filter;
  });

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1>NGO Dashboard</h1>
          <p className="muted">Welcome, {user.name}. Find food donations near you.</p>
        </div>
      </div>

      <div className="toolbar">
        <input
          type="text"
          className="search-input"
          placeholder="Search by food name or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="filter-buttons">
          <button className={filter === "all" ? "btn btn-primary" : "btn btn-outline"} onClick={() => setFilter("all")}>
            All
          </button>
          <button className={filter === "pending" ? "btn btn-primary" : "btn btn-outline"} onClick={() => setFilter("pending")}>
            Available
          </button>
          <button className={filter === "accepted" ? "btn btn-primary" : "btn btn-outline"} onClick={() => setFilter("accepted")}>
            Accepted
          </button>
        </div>
      </div>

      {error && <div className="error-box">{error}</div>}
      {message && <div className="success-box">{message}</div>}

      {shownDonations.length === 0 ? (
        <div className="card empty">No donations found.</div>
      ) : (
        <div className="donation-grid">
          {shownDonations.map((d) => (
            <div className="card donation" key={d.id}>
              <div className="donation-top">
                <h3>{d.food_name}</h3>
                <span className={d.status === "pending" ? "badge badge-pending" : "badge badge-accepted"}>
                  {d.status === "pending" ? "available" : "accepted"}
                </span>
              </div>

              <p>🏪 {d.donor_name}</p>
              <p>📦 {d.quantity}</p>
              <p>📅 Expires: {d.expiry_date.slice(0, 10)}</p>
              <p>📍 {d.location}</p>
              <p>📞 {d.contact}</p>
              {d.description && <p className="muted">{d.description}</p>}

              {d.status === "pending" && (
                <button className="btn btn-primary" onClick={() => handleAccept(d.id)}>
                  Accept Donation
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NgoDashboard;
