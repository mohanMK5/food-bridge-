import express from "express";
import db from "../db.js";
import { checkLogin, onlyRole } from "../middleware/auth.js";

const router = express.Router();

// GET /api/donations  -> NGO sees all donations (can search by food name or location)
router.get("/", checkLogin, onlyRole("ngo"), async (req, res) => {
  try {
    const search = req.query.search || "";
    const like = "%" + search + "%";

    const [rows] = await db.query(
      `SELECT d.*, u.name AS donor_name
       FROM donations d
       JOIN users u ON u.id = d.donor_id
       WHERE d.food_name LIKE ? OR d.location LIKE ?
       ORDER BY d.status ASC, d.created_at DESC`,
      [like, like]
    );
    res.json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Could not get donations" });
  }
});

// GET /api/donations/mine  -> donor sees only his own donations
router.get("/mine", checkLogin, onlyRole("donor"), async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT d.*, n.name AS accepted_by_name
       FROM donations d
       LEFT JOIN users n ON n.id = d.accepted_by
       WHERE d.donor_id = ?
       ORDER BY d.created_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Could not get your donations" });
  }
});

// POST /api/donations  -> donor adds a new donation
router.post("/", checkLogin, onlyRole("donor"), async (req, res) => {
  try {
    const { food_name, quantity, expiry_date, location, contact, description } = req.body;

    if (!food_name || !quantity || !expiry_date || !location || !contact) {
      return res.status(400).json({ message: "Please fill all the required fields" });
    }

    await db.query(
      `INSERT INTO donations
       (donor_id, food_name, quantity, expiry_date, location, contact, description)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [req.user.id, food_name, quantity, expiry_date, location, contact, description || ""]
    );
    res.status(201).json({ message: "Donation added" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Could not add donation" });
  }
});

// PUT /api/donations/:id/accept  -> NGO accepts a pending donation
router.put("/:id/accept", checkLogin, onlyRole("ngo"), async (req, res) => {
  try {
    // the "status = pending" check stops two NGOs accepting the same food
    const [result] = await db.query(
      "UPDATE donations SET status = 'accepted', accepted_by = ? WHERE id = ? AND status = 'pending'",
      [req.user.id, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "This donation is already accepted" });
    }
    res.json({ message: "Donation accepted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Could not accept donation" });
  }
});

// DELETE /api/donations/:id  -> donor deletes his own pending donation
router.delete("/:id", checkLogin, onlyRole("donor"), async (req, res) => {
  try {
    const [result] = await db.query(
      "DELETE FROM donations WHERE id = ? AND donor_id = ? AND status = 'pending'",
      [req.params.id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "Cannot delete this donation" });
    }
    res.json({ message: "Donation deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Could not delete donation" });
  }
});

export default router;
