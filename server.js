import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import waitingList from "./routes/waitingList.js";

// Load env vars
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json()); // Parse JSON requests

app.get("/", (req, res) => {
  res.send("API is running...");
});
app.use("/api/waiting-list", waitingList); // 👈 add waiting list routes

// Port from .env
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
