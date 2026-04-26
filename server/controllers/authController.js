const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ✅ Use environment variable or fallback
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

exports.register = (req, res) => {
  const { name, email, password } = req.body;

  // ✅ FIX 1: VALIDATION
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Missing name, email, or password" });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  try {
    const hash = bcrypt.hashSync(password, 10);

    db.query(
      "INSERT INTO users (name,email,password) VALUES (?,?,?)",
      [name, email, hash],
      (err) => {
        if (err) {
          console.error(err);
          // ✅ FIX 2: CONSISTENT JSON RESPONSE
          return res.status(400).json({ 
            message: err.code === 'ER_DUP_ENTRY' 
              ? "Email already exists" 
              : "Registration failed" 
          });
        }
        res.status(201).json({ message: "Registered successfully" });
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  // ✅ FIX 3: VALIDATION
  if (!email || !password) {
    return res.status(400).json({ message: "Missing email or password" });
  }

  try {
    db.query(
      "SELECT * FROM users WHERE email=?",
      [email],
      (err, result) => {
        // ✅ FIX 4: HANDLE DB ERROR
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Server error" });
        }

        // ✅ FIX 5: USER CHECK
        if (result.length === 0) {
          return res.status(400).json({ message: "User not found" });
        }

        const user = result[0];

        // PASSWORD CHECK
        const match = bcrypt.compareSync(password, user.password);

        if (!match) {
          return res.status(400).json({ message: "Wrong password" });
        }

        // ✅ USE PROPER SECRET
        const token = jwt.sign({ id: user.id }, JWT_SECRET);

        res.json({
          token,
          userId: user.id,
          message: "Login successful"
        });
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};