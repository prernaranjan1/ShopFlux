import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = "http://localhost:5000/api";

function ProductCard({ product, onViewDetails, addToCart, loadingId }) {
  const [inWishlist, setInWishlist] = useState(false);
  const [checking, setChecking] = useState(true);
  
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      setChecking(false);
      return;
    }

    const checkWishlist = async () => {
      try {
        setChecking(true);
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `${API_URL}/wishlist/${userId}/${product.id}/check`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setInWishlist(res.data.inWishlist || false);
      } catch (err) {
        console.error("Wishlist check error:", err);
        setInWishlist(false);
      } finally {
        setChecking(false);
      }
    };

    checkWishlist();
  }, [product.id, userId]);

  const toggleWishlist = async (e) => {
    e.stopPropagation();

    if (!userId) {
      toast.error("Please login first");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      if (inWishlist) {
        const res = await axios.delete(
          `${API_URL}/wishlist/${userId}/${product.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.data.success) {
          setInWishlist(false);
          toast.success("Removed from wishlist");
        }
      } else {
        const res = await axios.post(
          `${API_URL}/wishlist`,
          { 
            userId: parseInt(userId),
            productId: product.id 
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.data.success) {
          setInWishlist(true);
          toast.success("Added to wishlist");
        }
      }
    } catch (err) {
      console.error("Wishlist toggle error:", err);
      toast.error("Error updating wishlist");
    }
  };

  const getProductImage = () => {
    if (product.image_url && product.image_url.trim() !== "") {
      return product.image_url;
    }
    if (product.image && product.image.trim() !== "") {
      return product.image;
    }
    return "https://via.placeholder.com/300x300?text=" + encodeURIComponent(product.name || "Product");
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col h-full border border-gray-100">
      
      {/* IMAGE CONTAINER - FIXED SIZE, NO OVERFLOW */}
      <div className="relative w-full bg-gray-50 flex items-center justify-center overflow-hidden" style={{ aspectRatio: "1", minHeight: "200px" }}>
        <img
          src={getProductImage()}
          alt={product.name}
          className="w-full h-full object-contain p-2"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/300x300?text=Product";
          }}
        />

        {/* WISHLIST BUTTON */}
        <button
          onClick={toggleWishlist}
          disabled={checking}
          className="absolute top-2 right-2 bg-white rounded-full w-9 h-9 flex items-center justify-center hover:scale-110 transition-transform shadow-md hover:shadow-lg border border-gray-200"
          title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <span className="text-lg">
            {checking ? "⏳" : inWishlist ? "❤️" : "🤍"}
          </span>
        </button>
      </div>

      {/* CONTENT SECTION */}
      <div className="p-3 flex flex-col flex-grow">
        
        {/* PRODUCT NAME */}
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1 h-9">
          {product.name}
        </h3>

        {/* CATEGORY */}
        <p className="text-xs text-gray-500 mb-2">
          {product.category}
        </p>

        {/* PRICE */}
        <p className="text-base font-bold text-blue-600 mb-3 flex-grow">
          ₹{product.price?.toLocaleString() || "N/A"}
        </p>

        {/* BUTTONS - FIXED POSITION AT BOTTOM */}
        <div className="flex gap-2 pt-2 border-t border-gray-100">
          <button
            onClick={() => addToCart(product)}
            disabled={loadingId === product.id}
            className="flex-1 bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 disabled:bg-gray-400 transition text-xs"
          >
            {loadingId === product.id ? "Adding..." : "Add"}
          </button>

          <button
            onClick={() => onViewDetails(product)}
            className="px-3 bg-gray-100 text-gray-700 rounded font-medium hover:bg-gray-200 transition text-xs"
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;