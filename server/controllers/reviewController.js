const db = require("../db");

// =====================
// 🔹 GET REVIEWS FOR PRODUCT
// =====================
exports.getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    console.log("📝 Fetching reviews for product:", productId);

    const query = `
      SELECT id, product_id, user_id, rating, comment, created_at 
      FROM reviews 
      WHERE product_id = ? 
      ORDER BY created_at DESC
    `;

    db.query(query, [productId], (err, results) => {
      if (err) {
        console.error("❌ Error fetching reviews:", err);
        return res.status(500).json({ 
          success: false, 
          message: "Error fetching reviews",
          error: err.message 
        });
      }

      console.log(`✅ Found ${results.length} reviews for product ${productId}`);
      res.json({
        success: true,
        data: results || [],
        message: "Reviews fetched successfully"
      });
    });
  } catch (err) {
    console.error("❌ Server error in getProductReviews:", err);
    res.status(500).json({ 
      success: false, 
      message: "Server error",
      error: err.message 
    });
  }
};

// =====================
// 🔹 CHECK USER REVIEW FOR PRODUCT
// =====================
exports.checkUserReview = async (req, res) => {
  try {
    const { productId, userId } = req.query;

    console.log("🔍 Checking review - productId:", productId, "userId:", userId);

    if (!productId || !userId) {
      return res.status(400).json({ 
        success: false, 
        message: "productId and userId required" 
      });
    }

    const query = `
      SELECT id, product_id, user_id, rating, comment, created_at 
      FROM reviews 
      WHERE product_id = ? AND user_id = ? 
      LIMIT 1
    `;

    db.query(query, [productId, userId], (err, results) => {
      if (err) {
        console.error("❌ Error checking review:", err);
        return res.status(500).json({ 
          success: false, 
          message: "Error checking review",
          error: err.message 
        });
      }

      const userReview = results && results.length > 0 ? results[0] : null;

      console.log("✅ Review check result:", userReview ? "Found" : "Not found");

      res.json({
        success: true,
        data: userReview,
        inWishlist: !!userReview,
        message: userReview ? "Review found" : "No review found"
      });
    });
  } catch (err) {
    console.error("❌ Server error in checkUserReview:", err);
    res.status(500).json({ 
      success: false, 
      message: "Server error",
      error: err.message 
    });
  }
};

// =====================
// 🔹 CREATE REVIEW
// =====================
exports.createReview = async (req, res) => {
  try {
    const { product_id, user_id, rating, comment } = req.body;

    console.log("📝 Creating review:", { product_id, user_id, rating, comment });

    if (!product_id || !user_id || !rating || !comment) {
      return res.status(400).json({ 
        success: false, 
        message: "All fields required (product_id, user_id, rating, comment)" 
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ 
        success: false, 
        message: "Rating must be between 1 and 5" 
      });
    }

    const query = `
      INSERT INTO reviews (product_id, user_id, rating, comment, created_at) 
      VALUES (?, ?, ?, ?, NOW())
    `;

    db.query(query, [product_id, user_id, rating, comment], (err, result) => {
      if (err) {
        console.error("❌ Error creating review:", err);
        
        // Check if it's a UNIQUE constraint error
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({ 
            success: false, 
            message: "You already have a review for this product. Edit it instead.",
            error: err.message 
          });
        }

        return res.status(500).json({ 
          success: false, 
          message: "Error creating review",
          error: err.message 
        });
      }

      console.log("✅ Review created with ID:", result.insertId);

      res.json({
        success: true,
        reviewId: result.insertId,
        message: "Review created successfully"
      });
    });
  } catch (err) {
    console.error("❌ Server error in createReview:", err);
    res.status(500).json({ 
      success: false, 
      message: "Server error",
      error: err.message 
    });
  }
};

// =====================
// 🔹 UPDATE REVIEW
// =====================
exports.updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    console.log("✏️ Updating review:", reviewId);

    if (!rating || !comment) {
      return res.status(400).json({ 
        success: false, 
        message: "Rating and comment required" 
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ 
        success: false, 
        message: "Rating must be between 1 and 5" 
      });
    }

    const query = `
      UPDATE reviews 
      SET rating = ?, comment = ?, created_at = NOW() 
      WHERE id = ?
    `;

    db.query(query, [rating, comment, reviewId], (err, result) => {
      if (err) {
        console.error("❌ Error updating review:", err);
        return res.status(500).json({ 
          success: false, 
          message: "Error updating review",
          error: err.message 
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ 
          success: false, 
          message: "Review not found" 
        });
      }

      console.log("✅ Review updated successfully");

      res.json({
        success: true,
        message: "Review updated successfully"
      });
    });
  } catch (err) {
    console.error("❌ Server error in updateReview:", err);
    res.status(500).json({ 
      success: false, 
      message: "Server error",
      error: err.message 
    });
  }
};

// =====================
// 🔹 DELETE REVIEW
// =====================
exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    console.log("🗑️ Deleting review:", reviewId);

    const query = `DELETE FROM reviews WHERE id = ?`;

    db.query(query, [reviewId], (err, result) => {
      if (err) {
        console.error("❌ Error deleting review:", err);
        return res.status(500).json({ 
          success: false, 
          message: "Error deleting review",
          error: err.message 
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ 
          success: false, 
          message: "Review not found" 
        });
      }

      console.log("✅ Review deleted successfully");

      res.json({
        success: true,
        message: "Review deleted successfully"
      });
    });
  } catch (err) {
    console.error("❌ Server error in deleteReview:", err);
    res.status(500).json({ 
      success: false, 
      message: "Server error",
      error: err.message 
    });
  }
};