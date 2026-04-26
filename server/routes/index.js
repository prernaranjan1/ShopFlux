const router = require("express").Router();
const auth = require("../controllers/authController");
const db = require("../db"); // make sure path is correct


// ================= AUTH =================
router.post("/register", (req, res) => {
  auth.register(req, res);
});

router.post("/login", (req, res) => {
  auth.login(req, res);
});

// ================= PRODUCTS =================
router.get("/products", (req, res) => {
  const query = "SELECT * FROM products";

  db.query(query, (err, result) => {
    if (err) {
      console.error("Products error:", err);
      return res.status(500).json({ message: "DB error" });
    }

    res.json(result);
  });
});

// ================= HEALTH =================
router.get("/health", (req, res) => {
  res.json({ message: "Auth service is running" });
});

module.exports = router;