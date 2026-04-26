const router = require("express").Router();
const orderController = require("../controllers/orderController");
const auth = require("../middleware/authMiddleware");

// =====================
// 🔹 ORDER ROUTES
// =====================

// Get all orders for a user
// GET /api/orders/user/:userId
router.get("/user/:userId", auth, orderController.getUserOrders);

// Get a single order
// GET /api/orders/:orderId
router.get("/:orderId", auth, orderController.getOrderById);

// Create order (checkout)
// POST /api/orders/checkout
router.post("/checkout", auth, orderController.checkout);

// Cancel order
// DELETE /api/orders/:orderId/cancel
router.delete("/:orderId/cancel", auth, orderController.cancelOrder);

// Update order status
// PUT /api/orders/:orderId/status
router.put("/:orderId/status", auth, orderController.updateOrderStatus);

module.exports = router;