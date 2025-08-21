import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import waitingList from "./routes/waitingList.js";
import cors from "cors"; // ✅ import cors

// Load env vars
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json()); // Parse JSON requests

// CORS setup
const allowedOrigins = [
  "http://localhost:3000",           // local dev
  "https://blooming-bet.vercel.app",
  "https://bloomingbet.com" // deployed frontend
];

app.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin like mobile apps or curl
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = `The CORS policy for this site does not allow access from the specified Origin.`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true // if you want to send cookies
}));

// Routes
app.get("/", (req, res) => {
  res.send("API is running...");
});
app.use("/api/waiting-list", waitingList);

// Port from .env
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
