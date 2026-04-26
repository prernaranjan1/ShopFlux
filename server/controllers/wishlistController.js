const db = require("../db");

// =====================
// 🔹 GET USER WISHLIST
// =====================
exports.getWishlist = (req, res) => {
  const { userId } = req.params;

  console.log("GET WISHLIST:", userId);

  if (!userId) {
    return res.status(400).json({ 
      success: false, 
      message: "Missing userId" 
    });
  }

  const query = `
    SELECT 
      p.id,
      p.name,
      p.category,
      p.price,
      p.description,
      p.image_url,
      w.created_at
    FROM wishlist w
    JOIN products p ON w.product_id = p.id
    WHERE w.user_id = ?
    ORDER BY w.created_at DESC
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error:", err);
      return res.status(500).json({ 
        success: false, 
        message: "Error fetching wishlist" 
      });
    }

    res.json({ 
      success: true, 
      data: results || [] 
    });
  });
};

// =====================
// 🔹 ADD TO WISHLIST
// =====================
exports.addToWishlist = (req, res) => {
  const { userId, productId } = req.body;

  console.log("ADD WISHLIST:", { userId, productId });

  if (!userId || !productId) {
    return res.status(400).json({ 
      success: false, 
      message: "Missing userId or productId" 
    });
  }

  // Check if already exists
  const checkQuery = `
    SELECT id FROM wishlist 
    WHERE user_id = ? AND product_id = ?
  `;

  db.query(checkQuery, [userId, productId], (err, results) => {
    if (err) {
      console.error("Check error:", err);
      return res.status(500).json({ success: false });
    }

    if (results && results.length > 0) {
      return res.json({ 
        success: true, 
        message: "Already in wishlist" 
      });
    }

    // Add to wishlist
    const insertQuery = `
      INSERT INTO wishlist (user_id, product_id, created_at)
      VALUES (?, ?, NOW())
    `;

    db.query(insertQuery, [userId, productId], (err, result) => {
      if (err) {
        console.error("Insert error:", err);
        return res.status(500).json({ success: false });
      }

      res.json({ 
        success: true, 
        message: "Added to wishlist" 
      });
    });
  });
};

// =====================
// 🔹 REMOVE FROM WISHLIST
// =====================
exports.removeFromWishlist = (req, res) => {
  const { userId, productId } = req.params;

  console.log("REMOVE WISHLIST:", { userId, productId });

  if (!userId || !productId) {
    return res.status(400).json({ 
      success: false, 
      message: "Missing userId or productId" 
    });
  }

  const query = `
    DELETE FROM wishlist 
    WHERE user_id = ? AND product_id = ?
  `;

  db.query(query, [userId, productId], (err, result) => {
    if (err) {
      console.error("Delete error:", err);
      return res.status(500).json({ success: false });
    }

    res.json({ 
      success: true, 
      message: "Removed from wishlist" 
    });
  });
};

// =====================
// 🔹 CHECK IF IN WISHLIST
// =====================
exports.checkWishlist = (req, res) => {
  const { userId, productId } = req.params;

  console.log("CHECK WISHLIST:", { userId, productId });

  if (!userId || !productId) {
    return res.status(400).json({ 
      success: false, 
      message: "Missing userId or productId" 
    });
  }

  const query = `
    SELECT id FROM wishlist 
    WHERE user_id = ? AND product_id = ?
  `;

  db.query(query, [userId, productId], (err, results) => {
    if (err) {
      console.error("Check error:", err);
      return res.status(500).json({ 
        success: false, 
        inWishlist: false 
      });
    }

    res.json({ 
      success: true,
      inWishlist: results && results.length > 0 
    });
  });
};

// =====================
// 🔹 GET WISHLIST COUNT
// =====================
exports.getWishlistCount = (req, res) => {
  const { userId } = req.params;

  console.log("GET WISHLIST COUNT:", userId);

  if (!userId) {
    return res.status(400).json({ 
      success: false, 
      message: "Missing userId",
      count: 0 
    });
  }

  db.query(
    `SELECT COUNT(*) as count FROM wishlist WHERE user_id = ?`,
    [userId],
    (err, results) => {
      if (err) {
        console.error("Count error:", err);
        return res.status(500).json({ 
          success: false, 
          count: 0 
        });
      }

      res.json({ 
        success: true, 
        count: results[0].count 
      });
    }
  );
};

// =====================
// 🔹 CLEAR WISHLIST
// =====================
exports.clearWishlist = (req, res) => {
  const { userId } = req.params;

  console.log("CLEAR WISHLIST:", userId);

  if (!userId) {
    return res.status(400).json({ 
      success: false, 
      message: "Missing userId" 
    });
  }

  db.query(
    `DELETE FROM wishlist WHERE user_id = ?`,
    [userId],
    (err) => {
      if (err) {
        console.error("Clear error:", err);
        return res.status(500).json({ success: false });
      }
      
      res.json({ 
        success: true, 
        message: "Wishlist cleared" 
      });
    }
  );
};