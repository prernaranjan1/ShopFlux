import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = "http://localhost:5000/api";

function Wishlist({ userId, onBack }) {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);

  // =====================
  // 🔹 FETCH WISHLIST
  // =====================
  useEffect(() => {
    if (userId) {
      fetchWishlist();
      fetchWishlistCount();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API_URL}/wishlist/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Wishlist response:", res.data);

      if (res.data.success) {
        setWishlistItems(res.data.data || []);
      }
    } catch (err) {
      console.error("Error fetching wishlist:", err);
      toast.error("Error loading wishlist");
    } finally {
      setLoading(false);
    }
  };

  // =====================
  // 🔹 FETCH WISHLIST COUNT
  // =====================
  const fetchWishlistCount = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API_URL}/wishlist/${userId}/count`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setWishlistCount(res.data.count);
      }
    } catch (err) {
      console.error("Error fetching wishlist count:", err);
    }
  };

  // =====================
  // 🔹 REMOVE FROM WISHLIST
  // =====================
  const removeFromWishlist = async (productId) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.delete(
        `${API_URL}/wishlist/${userId}/${productId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        toast.success("Removed from wishlist");
        setWishlistItems(
          wishlistItems.filter((item) => item.id !== productId)
        );
        setWishlistCount(Math.max(0, wishlistCount - 1));
      }
    } catch (err) {
      console.error("Error removing from wishlist:", err);
      toast.error("Error removing from wishlist");
    }
  };

  // =====================
  // 🔹 CLEAR WISHLIST
  // =====================
  const clearWishlist = async () => {
    if (!window.confirm("Are you sure you want to clear your wishlist?"))
      return;

    try {
      const token = localStorage.getItem("token");

      const res = await axios.delete(`${API_URL}/wishlist/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        toast.success("Wishlist cleared");
        setWishlistItems([]);
        setWishlistCount(0);
      }
    } catch (err) {
      console.error("Error clearing wishlist:", err);
      toast.error("Error clearing wishlist");
    }
  };

  // =====================
  // 🔹 GET IMAGE (FIXED)
  // =====================
  const getProductImage = (item) => {
    // Try database image first
    if (item?.image_url && item.image_url.trim() !== "") {
      console.log("✅ Using database image_url:", item.image_url);
      return item.image_url;
    }

    // Try fallback image field
    if (item?.image && item.image.trim() !== "") {
      console.log("✅ Using image field:", item.image);
      return item.image;
    }

    // Use generic product placeholder from Unsplash
    const placeholders = {
      electronics:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
      clothes:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop",
      home: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=500&fit=crop",
      books:
        "https://images.unsplash.com/photo-1507842072343-583f20270319?w=500&h=500&fit=crop",
      sports:
        "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&h=500&fit=crop",
      gaming:
        "https://images.unsplash.com/photo-1538481143235-b716cc223e70?w=500&h=500&fit=crop",
    };

    const category = item?.category?.toLowerCase() || "electronics";
    const placeholder =
      placeholders[category] || placeholders.electronics;

    console.log(
      `⚠️ No image for ${item?.name}, using ${category} placeholder`
    );
    return placeholder;
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <p>Loading wishlist...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* HEADER */}
      <div className="max-w-5xl mx-auto mb-6">
        <div className="flex items-center gap-4 mb-4">
          {/* BACK BUTTON - ENGLISH */}
          {onBack && (
            <button
              onClick={onBack}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
            >
              ← Back
            </button>
          )}
          <h1 className="text-3xl font-bold text-gray-900">
            ❤️ My Wishlist
          </h1>
        </div>
        <p className="text-gray-600">
          {wishlistCount} item{wishlistCount !== 1 ? "s" : ""} saved
        </p>
      </div>

      {wishlistItems.length === 0 ? (
        // EMPTY STATE
        <div className="max-w-5xl mx-auto bg-white rounded-lg shadow p-12 text-center">
          <p className="text-4xl mb-4">💔</p>
          <p className="text-lg text-gray-600">Your wishlist is empty</p>
          <p className="text-sm text-gray-500 mt-2">
            Click the heart icon on products to save them!
          </p>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto">
          {/* WISHLIST GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {wishlistItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden"
              >
                {/* IMAGE */}
                <div className="bg-gray-100 h-48 flex items-center justify-center overflow-hidden relative">
                  <img
                    src={getProductImage(item)}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.log("Image load failed, using fallback");
                      e.target.src =
                        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop";
                    }}
                  />
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-red-600 text-xl"
                    title="Remove from wishlist"
                  >
                    ❤️
                  </button>
                </div>

                {/* CONTENT */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1 h-14">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{item.category}</p>
                  <p className="text-sm text-gray-700 line-clamp-2 mb-3">
                    {item.description}
                  </p>

                  <div className="flex justify-between items-center">
                    <p className="text-lg font-bold text-blue-600">
                      ₹{item.price?.toLocaleString()}
                    </p>
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ACTIONS */}
          <div className="flex gap-3 justify-end">
            <button
              onClick={clearWishlist}
              className="bg-red-100 text-red-600 px-4 py-2 rounded hover:bg-red-200 font-medium"
            >
              Clear Wishlist
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Wishlist;