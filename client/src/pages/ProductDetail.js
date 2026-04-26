import { useState } from "react";
import toast from "react-hot-toast";
import Reviews from "../components/Reviews";

function ProductDetail({ product, onClose, addToCart, loadingId }) {
  const [quantity, setQuantity] = useState(1);
  const userId = localStorage.getItem("userId");

  console.log("ProductDetail received product:", product);

  // =====================
  // 🔹 GET PRODUCT IMAGE (FIX)
  // =====================
  const getProductImage = () => {
    // ✅ FIX: Try all possible image properties
    if (product?.image_url && product.image_url !== "") {
      console.log("Using image_url:", product.image_url);
      return product.image_url;
    }
    if (product?.image && product.image !== "") {
      console.log("Using image:", product.image);
      return product.image;
    }
    
    // Fallback placeholder
    const placeholder = `https://via.placeholder.com/500x500?text=${encodeURIComponent(product?.name || "Product")}`;
    console.log("Using placeholder:", placeholder);
    return placeholder;
    
  };

  const getProductDescription = () => {
    return product?.description || "High-quality product with excellent features";
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    toast.success(`Added ${quantity} item(s) to cart`);
    setQuantity(1);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl bg-white rounded-full w-10 h-10 flex items-center justify-center z-10"
        >
          ✕
        </button>

        <div className="flex flex-col md:flex-row">
          {/* IMAGE SECTION */}
          <div className="md:w-1/2 bg-gray-100 flex items-center justify-center p-8 min-h-64">
            <img
              src={getProductImage()}
              alt={product?.name || "Product"}
              className="max-w-sm w-full h-auto rounded object-contain"
              onError={(e) => {
                console.log("Image load error, using placeholder");
                e.target.src = `https://via.placeholder.com/500x500?text=${encodeURIComponent(product?.name || "Product")}`;
              }}
            />
          </div>

          {/* DETAILS SECTION */}
          <div className="md:w-1/2 p-8 flex flex-col justify-between">
            {/* TITLE & CATEGORY */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product?.name}
              </h1>
              <p className="text-gray-600 text-sm mb-4">
                {product?.category || "Product"}
              </p>

              {/* RATING */}
              <div className="flex items-center gap-2 mb-6">
                <span className="text-yellow-500 text-sm">⭐⭐⭐⭐⭐ 4.8</span>
                <span className="text-gray-600 text-sm">(249 reviews)</span>
              </div>

              {/* PRICE */}
              <p className="text-3xl font-bold text-blue-600 mb-6">
                ₹{product?.price?.toLocaleString() || "N/A"}
              </p>

              {/* DESCRIPTION */}
              <p className="text-gray-700 leading-relaxed mb-6">
                {getProductDescription()}
              </p>

              {/* FEATURES */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Key Features:</h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>✓ Premium Quality</li>
                  <li>✓ 2-Year Warranty</li>
                  <li>✓ Free Shipping</li>
                  <li>✓ Easy Returns</li>
                </ul>
              </div>

              {/* QUANTITY */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-gray-700 font-medium">Quantity:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded font-bold"
                  >
                    −
                  </button>
                  <span className="w-12 text-center font-semibold text-lg">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* BUTTONS */}
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={loadingId === product?.id}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
                >
                  {loadingId === product?.id ? "Adding..." : "🛒 Add to Cart"}
                </button>
                <button
                  onClick={onClose}
                  className="px-6 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  Close
                </button>
              </div>

              {/* REVIEWS SECTION */}
              {userId && product?.id && (
                <div className="mt-6 pt-6 border-t">
                  <Reviews productId={product.id} userId={parseInt(userId)} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;