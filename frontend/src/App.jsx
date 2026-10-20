import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Auth from "./pages/Auth.jsx";
import DonorDashboard from "./pages/DonorDashboard.jsx";
import NgoDashboard from "./pages/NgoDashboard.jsx";
import { getUser } from "./api.js";

function App() {
  const [user, setUser] = useState(getUser());

  return (
    <div>
      <Navbar user={user} setUser={setUser} />

      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/login" element={<Auth setUser={setUser} />} />

        <Route
          path="/donor"
          element={user && user.role === "donor" ? <DonorDashboard user={user} /> : <Navigate to="/login" />}
        />
        <Route
          path="/ngo"
          element={user && user.role === "ngo" ? <NgoDashboard user={user} /> : <Navigate to="/login" />}
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
