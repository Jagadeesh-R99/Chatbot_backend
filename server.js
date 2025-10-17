// server.js
const express = require("express");
const cors = require("cors");
const path = require("path");

// Routes
const ordersRoutes = require("./routes/ordersRoutes");
const faqsRoutes = require("./routes/faqsRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Base route
app.get("/", (req, res) => {
  res.send("E-commerce Backend API is running...");
});

// Orders routes
app.use("/api/orders", ordersRoutes);

// FAQs routes
app.use("/api/faqs", faqsRoutes);

// Serve static JSON files (optional)
app.use("/faqs-json", express.static(path.join(__dirname, "config/faqs")));

// Error handling for unknown routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found." });
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
