const db = require("../db");

// =====================
// 🔹 GET USER ORDERS WITH ITEMS
// =====================
const getUserOrders = (req, res) => {
  try {
    const { userId } = req.params;

    console.log("📦 Fetching orders for user:", userId);

    // Get orders
    const orderQuery = `SELECT id, user_id, total, status, created_at FROM orders WHERE user_id = ? ORDER BY created_at DESC`;

    db.query(orderQuery, [userId], (err, orders) => {
      if (err) {
        console.error("❌ Error:", err);
        return res.status(500).json({ success: false, message: "Error fetching orders" });
      }

      if (orders.length === 0) {
        return res.json({ success: true, data: [] });
      }

      // Get items for all orders
      const orderIds = orders.map(o => o.id);
      const itemsQuery = `
        SELECT oi.id, oi.order_id, oi.product_id, oi.quantity, p.name, p.price
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id IN (${orderIds.map(() => "?").join(",")})
      `;

      db.query(itemsQuery, orderIds, (err, items) => {
        if (err) {
          console.error("❌ Error:", err);
          return res.status(500).json({ success: false, message: "Error fetching items" });
        }

        // Combine orders with items
        const ordersWithItems = orders.map(order => ({
          ...order,
          items: items.filter(item => item.order_id === order.id)
        }));

        console.log(`✅ Loaded ${orders.length} orders with items`);
        res.json({ success: true, data: ordersWithItems });
      });
    });
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// =====================
// 🔹 GET SINGLE ORDER
// =====================
const getOrderById = (req, res) => {
  try {
    const { orderId } = req.params;

    const orderQuery = `SELECT id, user_id, total, status, created_at FROM orders WHERE id = ?`;

    db.query(orderQuery, [orderId], (err, orders) => {
      if (err || orders.length === 0) {
        return res.status(404).json({ success: false, message: "Order not found" });
      }

      const order = orders[0];
      const itemsQuery = `
        SELECT oi.id, oi.order_id, oi.product_id, oi.quantity, p.name, p.price
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?
      `;

      db.query(itemsQuery, [orderId], (err, items) => {
        if (err) {
          return res.status(500).json({ success: false, message: "Error fetching items" });
        }

        res.json({ success: true, data: { ...order, items: items || [] } });
      });
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// =====================
// 🔹 CHECKOUT
// =====================
const checkout = (req, res) => {
  try {
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ success: false, message: "user_id required" });
    }

    console.log("🛒 Checkout for user:", user_id);

    // Get cart items
    const cartQuery = `
      SELECT c.product_id, c.quantity, p.price, p.name
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = ?
    `;

    db.query(cartQuery, [user_id], (err, cartItems) => {
      if (err || cartItems.length === 0) {
        return res.status(400).json({ success: false, message: "Cart is empty" });
      }

      // Calculate total
      const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

      // Create order
      const orderQuery = `INSERT INTO orders (user_id, total, status, created_at) VALUES (?, ?, 'pending', NOW())`;

      db.query(orderQuery, [user_id, total], (err, orderResult) => {
        if (err) {
          return res.status(500).json({ success: false, message: "Error creating order" });
        }

        const orderId = orderResult.insertId;

        // Insert order items
        const itemsQuery = `
          INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ${cartItems.map(() => "(?, ?, ?, ?)").join(",")}
        `;

        const values = [];
        cartItems.forEach(item => {
          values.push(orderId, item.product_id, item.quantity, item.price);
        });

        db.query(itemsQuery, values, (err) => {
          if (err) {
            return res.status(500).json({ success: false, message: "Error inserting items" });
          }

          // Clear cart
          const clearQuery = `DELETE FROM cart WHERE user_id = ?`;
          db.query(clearQuery, [user_id], () => {
            console.log("✅ Order created:", orderId);
            res.json({ success: true, orderId, total, message: "Order placed successfully" });
          });
        });
      });
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// =====================
// 🔹 CANCEL ORDER
// =====================
const cancelOrder = (req, res) => {
  try {
    const { orderId } = req.params;

    const query = `UPDATE orders SET status = 'cancelled' WHERE id = ?`;

    db.query(query, [orderId], (err, result) => {
      if (err || result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: "Order not found" });
      }

      console.log("✅ Order cancelled:", orderId);
      res.json({ success: true, message: "Order cancelled successfully" });
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// =====================
// 🔹 UPDATE ORDER STATUS
// =====================
const updateOrderStatus = (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: "status required" });
    }

    const query = `UPDATE orders SET status = ? WHERE id = ?`;

    db.query(query, [status, orderId], (err, result) => {
      if (err || result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: "Order not found" });
      }

      console.log("✅ Order status updated:", orderId);
      res.json({ success: true, message: "Order status updated successfully" });
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// =====================
// 🔹 EXPORTS
// =====================
module.exports = {
  getUserOrders,
  getOrderById,
  checkout,
  cancelOrder,
  updateOrderStatus,
};