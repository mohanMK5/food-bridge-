import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db.js";

const router = express.Router();

function makeToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }
    if (role !== "donor" && role !== "ngo") {
      return res.status(400).json({ message: "Role must be donor or ngo" });
    }

    // check if email is already used
    const [old] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
    if (old.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashed, role]
    );

    const user = { id: result.insertId, name, email, role };
    res.status(201).json({ user, token: makeToken(user) });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0) {
      return res.status(400).json({ message: "Wrong email or password" });
    }

    const found = rows[0];
    const same = await bcrypt.compare(password, found.password);
    if (!same) {
      return res.status(400).json({ message: "Wrong email or password" });
    }

    const user = { id: found.id, name: found.name, email: found.email, role: found.role };
    res.json({ user, token: makeToken(user) });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

export default router;
