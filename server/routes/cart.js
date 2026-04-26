const router = require("express").Router();
const cart = require("../controllers/cartController");
const auth = require("../middleware/authMiddleware");

// ✅ GET user's cart
router.get("/:userId", auth, cart.getCart);

// ✅ GET cart item count
router.get("/:userId/count", auth, cart.getCartCount);

// ✅ ADD to cart
router.post("/", auth, cart.addToCart);

// ✅ DECREASE quantity
router.put("/decrease/:userId/:productId", auth, cart.decreaseQuantity);

// ✅ REMOVE item from cart
router.delete("/:userId/:productId", auth, cart.removeFromCart);

// ✅ CLEAR entire cart
router.delete("/:userId", auth, cart.clearCart);

module.exports = router;