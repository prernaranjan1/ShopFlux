const db = require("../db");

// ==========================
// 🔹 GET CART
// ==========================
exports.getCart = (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "Missing userId" });
  }

  db.query(
    `SELECT c.product_id, c.quantity, p.name, p.price
     FROM cart c
     JOIN products p ON c.product_id = p.id
     WHERE c.user_id = ?`,
    [userId],
    (err, result) => {
      if (err) {
        console.error("Error fetching cart:", err);
        return res.status(500).json({ message: "Failed to fetch cart" });
      }

      const total =
        result?.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ) || 0;

      res.json({
        items: result || [],
        total,
        count: result?.length || 0,
      });
    }
  );
};

// ==========================
// 🔹 ADD TO CART
// ==========================
exports.addToCart = (req, res) => {
  const { user_id, product_id } = req.body;

  if (!user_id || !product_id) {
    return res.status(400).json({ message: "Missing user_id or product_id" });
  }

  db.query(
    `INSERT INTO cart (user_id, product_id, quantity)
     VALUES (?, ?, 1)
     ON DUPLICATE KEY UPDATE quantity = quantity + 1`,
    [user_id, product_id],
    (err) => {
      if (err) {
        console.error("Error adding to cart:", err);
        return res.status(500).json({ message: "Failed to add to cart" });
      }

      res.json({ message: "Added to cart" });
    }
  );
};

// ==========================
// 🔹 DECREASE QUANTITY
// ==========================
exports.decreaseQuantity = (req, res) => {
  const { userId, productId } = req.params;

  if (!userId || !productId) {
    return res.status(400).json({ message: "Missing parameters" });
  }

  db.query(
    `UPDATE cart
     SET quantity = quantity - 1
     WHERE user_id = ? AND product_id = ? AND quantity > 1`,
    [userId, productId],
    (err) => {
      if (err) {
        console.error("Error decreasing quantity:", err);
        return res.status(500).json({ message: "Failed to decrease quantity" });
      }

      res.json({ message: "Quantity decreased" });
    }
  );
};

// ==========================
// 🔹 REMOVE ITEM
// ==========================
exports.removeFromCart = (req, res) => {
  const { userId, productId } = req.params;

  if (!userId || !productId) {
    return res.status(400).json({ message: "Missing parameters" });
  }

  db.query(
    "DELETE FROM cart WHERE user_id = ? AND product_id = ?",
    [userId, productId],
    (err, result) => {
      if (err) {
        console.error("Error removing item:", err);
        return res.status(500).json({ message: "Failed to remove item" });
      }

      res.json({
        message: "Item removed",
        affectedRows: result.affectedRows,
      });
    }
  );
};

// ==========================
// 🔹 CLEAR CART
// ==========================
exports.clearCart = (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "Missing userId" });
  }

  db.query(
    "DELETE FROM cart WHERE user_id = ?",
    [userId],
    (err, result) => {
      if (err) {
        console.error("Error clearing cart:", err);
        return res.status(500).json({ message: "Failed to clear cart" });
      }

      res.json({
        message: "Cart cleared",
        removedItems: result.affectedRows,
      });
    }
  );
};

// ==========================
// 🔹 GET CART COUNT
// ==========================
exports.getCartCount = (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ 
      success: false,
      message: "Missing userId" 
    });
  }

  db.query(
    "SELECT COUNT(*) as count FROM cart WHERE user_id=?",
    [userId],
    (err, result) => {
      if (err) {
        console.error("Error fetching cart count:", err);
        return res.status(500).json({ 
          success: false,
          message: "Failed to fetch cart count" 
        });
      }

      res.json({ 
        success: true,
        count: result[0]?.count || 0
      });
    }
  );
};