import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../api.js";

function Navbar({ user, setUser }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    setUser(null);
    setMenuOpen(false);
    navigate("/");
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="logo">
          🍲 Food Bridge
        </Link>

        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>

        <div className={menuOpen ? "nav-links open" : "nav-links"}>
          <Link to="/" onClick={() => setMenuOpen(false)}>
            Home
          </Link>

          {user && user.role === "donor" && (
            <Link to="/donor" onClick={() => setMenuOpen(false)}>
              My Donations
            </Link>
          )}
          {user && user.role === "ngo" && (
            <Link to="/ngo" onClick={() => setMenuOpen(false)}>
              Available Food
            </Link>
          )}

          {user ? (
            <>
              <span className="user-name">Hi, {user.name}</span>
              <button className="btn btn-outline" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary" onClick={() => setMenuOpen(false)}>
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
