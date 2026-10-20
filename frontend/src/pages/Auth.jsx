import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, saveLogin } from "../api.js";

function Auth({ setUser }) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "donor" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    // basic checks before calling the server
    if (!form.email || !form.password) {
      setError("Email and password are required");
      return;
    }
    if (!isLogin && !form.name) {
      setError("Please enter your name");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      let data;
      if (isLogin) {
        data = await api.login({ email: form.email, password: form.password });
      } else {
        data = await api.register(form);
      }

      saveLogin(data);
      setUser(data.user);

      if (data.user.role === "donor") {
        navigate("/donor");
      } else {
        navigate("/ngo");
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }

  return (
    <div className="auth-page">
      <div className="card auth-card">
        <h2>{isLogin ? "Welcome back" : "Create your account"}</h2>
        <p className="muted">{isLogin ? "Login to continue" : "Join Food Bridge today"}</p>

        {error && <div className="error-box">{error}</div>}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label>Name</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Your name or organisation" />
            </div>
          )}

          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="At least 6 characters" />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label>I am a</label>
              <select name="role" value={form.role} onChange={handleChange}>
                <option value="donor">Donor (restaurant, store, individual)</option>
                <option value="ngo">NGO</option>
              </select>
            </div>
          )}

          <button type="submit" className="btn btn-primary full-width" disabled={loading}>
            {loading ? "Please wait..." : isLogin ? "Login" : "Register"}
          </button>
        </form>

        <p className="switch-text">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            className="link-button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Auth;
