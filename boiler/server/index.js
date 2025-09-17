import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "dotenv";

config(); // Load environment variables

const app = express();

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URI,
  methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
  credentials: true,
};
app.use(cors(corsOptions));

// Middleware
app.use(cookieParser());
app.use(express.json());

// Single API route
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from the server!" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
