console.log("🔥 THIS SERVER FILE IS RUNNING");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ✅ DB Connection
const db = require("./db");

// ✅ MIDDLEWARES
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ TEST ENDPOINT
app.get("/test", (req, res) => {
  res.json({ message: "Server is WORKING" });
});

app.get("/", (req, res) => {
  res.json({ message: "Server OK" });
});

// ==========================
// 🔹 API ROUTES
// ==========================

// Auth routes
app.use("/api/auth", require("./routes")); 

// Product routes
app.use("/api/products", require("./routes/product"));

// Cart routes
app.use("/api/cart", require("./routes/cart"));

// Orders routes
app.use("/api/orders", require("./routes/order")); 

// ⭐ REVIEW ROUTES (MUST ADD THIS)
app.use("/api/reviews", require("./routes/review"));

// ❤️ WISHLIST ROUTES (MUST ADD THIS)
app.use("/api/wishlist", require("./routes/wishlist"));

// ==========================
// 🔹 ERROR HANDLING
// ==========================

app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    message: "Route not found" 
  });
});

app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({ 
    success: false,
    message: err.message || "Server error"
  });
});

// ==========================
// 🔹 START SERVER
// ==========================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`✅ Routes loaded:`);
  console.log(`   - /api/auth`);
  console.log(`   - /api/products`);
  console.log(`   - /api/cart`);
  console.log(`   - /api/orders`);
  console.log(`   - /api/reviews ⭐`);
  console.log(`   - /api/wishlist ❤️`);
});