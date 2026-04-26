const router = require("express").Router();
const wishlist = require("../controllers/wishlistController");
const auth = require("../middleware/authMiddleware");

// =====================================================
// ❤️ WISHLIST ROUTES - CRITICAL ORDER!
// =====================================================
// IMPORTANT: Specific routes (with more params) MUST come BEFORE generic routes!
// Express matches routes in order, so /check must come before generic /:userId
// =====================================================

// ✅ SPECIFIC ROUTES FIRST (2+ params in path)
// These must come BEFORE the catch-all /:userId route

// Check if product is in wishlist
// GET /api/wishlist/:userId/:productId/check
router.get("/:userId/:productId/check", auth, wishlist.checkWishlist);

// Remove from wishlist
// DELETE /api/wishlist/:userId/:productId
router.delete("/:userId/:productId", auth, wishlist.removeFromWishlist);

// =====================================================
// ✅ GENERIC ROUTES SECOND (1 param in path)
// These come AFTER the specific 2-param routes

// Get wishlist count
// GET /api/wishlist/:userId/count
router.get("/:userId/count", auth, wishlist.getWishlistCount);

// Get user wishlist
// GET /api/wishlist/:userId
router.get("/:userId", auth, wishlist.getWishlist);

// =====================================================
// ✅ SPECIAL ROUTES (no params in path or POST/DELETE)

// Add to wishlist
// POST /api/wishlist
// Body: { userId, productId }
router.post("/", auth, wishlist.addToWishlist);

// Clear entire wishlist
// DELETE /api/wishlist/:userId (special - catch all userId deletes)
router.delete("/:userId", auth, wishlist.clearWishlist);

// =====================================================

module.exports = router;

/*
ROUTE MATCHING ORDER (from test):
1. GET /api/wishlist/8/191/check
   - Checks against: /:userId/:productId/check ✅ MATCHES
   - userId = 8, productId = 191
   
2. POST /api/wishlist
   - Checks against POST routes
   - Matches: / ✅ MATCHES
   
3. GET /api/wishlist/8/count
   - Checks against: /:userId/count ✅ MATCHES
   - userId = 8
   
4. DELETE /api/wishlist/8/191
   - Checks against: /:userId/:productId ✅ MATCHES
   - userId = 8, productId = 191

5. GET /api/wishlist/8
   - Checks against: /:userId ✅ MATCHES
   - userId = 8

REMEMBER: Specific routes (more params) MUST come BEFORE generic routes (fewer params)!
*/