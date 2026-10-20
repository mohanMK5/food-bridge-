import { useState, useEffect } from "react";
import { api } from "../api.js";

const emptyForm = {
  food_name: "",
  quantity: "",
  expiry_date: "",
  location: "",
  contact: "",
  description: "",
};

function DonorDashboard({ user }) {
  const [donations, setDonations] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadDonations() {
    try {
      const data = await api.getMyDonations();
      setDonations(data);
    } catch (err) {
      setError(err.message);
    }
  }

  // runs one time when the page opens
  useEffect(() => {
    loadDonations();
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      await api.addDonation(form);
      setForm(emptyForm);
      setShowForm(false);
      setMessage("Donation added successfully!");
      loadDonations();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this donation?")) return;

    try {
      await api.deleteDonation(id);
      setMessage("Donation deleted");
      loadDonations();
    } catch (err) {
      setError(err.message);
    }
  }

  const pendingCount = donations.filter((d) => d.status === "pending").length;
  const acceptedCount = donations.filter((d) => d.status === "accepted").length;

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1>Donor Dashboard</h1>
          <p className="muted">Welcome, {user.name}. Manage your food donations here.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "+ New Donation"}
        </button>
      </div>

      <div className="stats">
        <div className="card stat">
          <span className="stat-number">{donations.length}</span>
          <span className="muted">Total</span>
        </div>
        <div className="card stat">
          <span className="stat-number">{pendingCount}</span>
          <span className="muted">Pending</span>
        </div>
        <div className="card stat">
          <span className="stat-number">{acceptedCount}</span>
          <span className="muted">Accepted</span>
        </div>
      </div>

      {error && <div className="error-box">{error}</div>}
      {message && <div className="success-box">{message}</div>}

      {showForm && (
        <div className="card form-card">
          <h2>Add a donation</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Food name *</label>
                <input type="text" name="food_name" value={form.food_name} onChange={handleChange} placeholder="e.g. Veg biryani" required />
              </div>
              <div className="form-group">
                <label>Quantity *</label>
                <input type="text" name="quantity" value={form.quantity} onChange={handleChange} placeholder="e.g. 20 plates" required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Expiry date *</label>
                <input type="date" name="expiry_date" value={form.expiry_date} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Contact number *</label>
                <input type="text" name="contact" value={form.contact} onChange={handleChange} placeholder="Phone number" required />
              </div>
            </div>

            <div className="form-group">
              <label>Pickup location *</label>
              <input type="text" name="location" value={form.location} onChange={handleChange} placeholder="Full address" required />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows="3" placeholder="Anything else the NGO should know"></textarea>
            </div>

            <button type="submit" className="btn btn-primary">
              Post Donation
            </button>
          </form>
        </div>
      )}

      <h2 className="section-title left">Your donations</h2>

      {donations.length === 0 ? (
        <div className="card empty">You have not posted any donation yet.</div>
      ) : (
        <div className="donation-grid">
          {donations.map((d) => (
            <div className="card donation" key={d.id}>
              <div className="donation-top">
                <h3>{d.food_name}</h3>
                <span className={d.status === "pending" ? "badge badge-pending" : "badge badge-accepted"}>
                  {d.status}
                </span>
              </div>

              <p>📦 {d.quantity}</p>
              <p>📅 Expires: {d.expiry_date.slice(0, 10)}</p>
              <p>📍 {d.location}</p>
              <p>📞 {d.contact}</p>
              {d.description && <p className="muted">{d.description}</p>}
              {d.accepted_by_name && <p className="accepted-by">Accepted by {d.accepted_by_name}</p>}

              {d.status === "pending" && (
                <button className="btn btn-danger" onClick={() => handleDelete(d.id)}>
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DonorDashboard;
