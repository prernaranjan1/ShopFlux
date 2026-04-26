const router = require("express").Router();
const product = require("../controllers/productController");
const auth = require("../middleware/authMiddleware");

// ✅ GET all products (public)
router.get("/", product.getProducts);

// ✅ GET single product by ID (public)
router.get("/:productId", product.getProductById);

// ✅ SEARCH products (public)
router.get("/search/query", product.searchProducts);

// ✅ GET products by category (public)
router.get("/category/:category", product.getProductsByCategory);

// ✅ CREATE product (Admin only)
router.post("/", auth, product.createProduct);

// ✅ UPDATE product (Admin only)
router.put("/:productId", auth, product.updateProduct);

// ✅ DELETE product (Admin only)
router.delete("/:productId", auth, product.deleteProduct);

module.exports = router;