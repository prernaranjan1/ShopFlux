const router = require("express").Router();
const review = require("../controllers/reviewController");
const auth = require("../middleware/authMiddleware");

// =====================================================
// ⭐ REVIEW ROUTES - FIXED
// =====================================================

// 1️⃣ Get all reviews for a product (NO AUTH NEEDED)
// GET /api/reviews/product/:productId
router.get("/product/:productId", review.getProductReviews);

// 2️⃣ Check if user has reviewed this product (AUTH NEEDED)
// GET /api/reviews/check?productId=1&userId=1
router.get("/check", auth, review.checkUserReview);

// 3️⃣ Add new review (AUTH NEEDED)
// POST /api/reviews
// Body: { product_id, user_id, rating, comment }
router.post("/", auth, review.createReview);

// 4️⃣ Update review (AUTH NEEDED)
// PUT /api/reviews/:reviewId
// Body: { rating, comment }
router.put("/:reviewId", auth, review.updateReview);

// 5️⃣ Delete review (AUTH NEEDED)
// DELETE /api/reviews/:reviewId
router.delete("/:reviewId", auth, review.deleteReview);

// =====================================================

module.exports = router;