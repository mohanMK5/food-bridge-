import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import donationRoutes from "./routes/donations.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/donations", donationRoutes);

app.get("/", (req, res) => {
  res.send("Food Bridge API is running");
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log("Server started on port " + port);
});
