import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = "http://localhost:5000/api";

function Reviews({ productId, userId }) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);  // 0 = no rating selected
  const [hoverRating, setHoverRating] = useState(0);  // For hover preview
  const [comment, setComment] = useState("");
  const [userReview, setUserReview] = useState(null);
  const [loading, setLoading] = useState(false);

  console.log("📝 Reviews component loaded - productId:", productId, "userId:", userId);

  // =====================
  // 🔹 FETCH REVIEWS
  // =====================
  useEffect(() => {
    if (productId) {
      fetchReviews();
      checkUserReview();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, userId]);

  const fetchReviews = async () => {
    try {
      console.log("🔄 Fetching reviews for product:", productId);

      const res = await axios.get(
        `${API_URL}/reviews/product/${productId}`
      );

      console.log("✅ Reviews fetched:", res.data);

      if (res.data.success) {
        setReviews(res.data.data || []);
      } else {
        setReviews(res.data || []);
      }
    } catch (err) {
      console.error("❌ Error fetching reviews:", err);
    }
  };

  // =====================
  // 🔹 CHECK USER REVIEW
  // =====================
  const checkUserReview = async () => {
    if (!userId || !productId) {
      console.log("⚠️ Missing userId or productId, skipping check");
      return;
    }

    try {
      console.log("🔍 Checking user review - productId:", productId, "userId:", userId);

      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${API_URL}/reviews/check?productId=${productId}&userId=${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("✅ Check review result:", res.data);

      if (res.data.success && res.data.data) {
        console.log("📝 User already reviewed this product:", res.data.data);
        setUserReview(res.data.data);
        setRating(res.data.data.rating);
        setComment(res.data.data.comment);
      } else {
        console.log("ℹ️ User has not reviewed this product");
        setUserReview(null);
        setRating(0);  // Reset rating
        setComment("");
      }
    } catch (err) {
      console.error("❌ Error checking review:", err);
      setUserReview(null);
    }
  };

  // =====================
  // 🔹 SUBMIT REVIEW
  // =====================
  const submitReview = async () => {
    if (!comment.trim()) {
      toast.error("Please write a review");
      return;
    }

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (!productId || !userId) {
      toast.error("Product ID or User ID missing");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const payload = {
        product_id: parseInt(productId),
        user_id: parseInt(userId),
        rating: parseInt(rating),
        comment: comment.trim(),
      };

      console.log("📤 Submitting review with payload:", payload);

      let res;

      if (userReview) {
        // UPDATE existing review
        console.log("✏️ Updating existing review:", userReview.id);

        res = await axios.put(
          `${API_URL}/reviews/${userReview.id}`,
          {
            rating: parseInt(rating),
            comment: comment.trim(),
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        // CREATE new review
        console.log("➕ Creating new review");

        res = await axios.post(
          `${API_URL}/reviews`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      console.log("✅ Review response:", res.data);

      if (res.data.success) {
        toast.success(userReview ? "Review updated!" : "Review added!");
        setComment("");
        setRating(0);
        
        // Refresh reviews list and check status
        await fetchReviews();
        await checkUserReview();
      } else {
        toast.error(res.data.message || "Error submitting review");
      }
    } catch (err) {
      console.error("❌ Error submitting review:", err);
      
      const errorMsg = err.response?.data?.message || err.message || "Error submitting review";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // =====================
  // 🔹 DELETE REVIEW
  // =====================
  const deleteReview = async (reviewId) => {
    if (!window.confirm("Delete this review?")) return;

    try {
      const token = localStorage.getItem("token");

      console.log("🗑️ Deleting review:", reviewId);

      const res = await axios.delete(`${API_URL}/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("✅ Delete response:", res.data);

      if (res.data.success) {
        toast.success("Review deleted!");
        setUserReview(null);
        setComment("");
        setRating(0);
        await fetchReviews();
      }
    } catch (err) {
      console.error("❌ Error deleting review:", err);
      toast.error("Error deleting review");
    }
  };

  // =====================
  // 🔹 RENDER STAR
  // =====================
  const renderStar = (starNumber) => {
    // Determine which rating to show (hover preview or selected)
    const displayRating = hoverRating || rating;
    
    // Star is yellow if it's <= current rating
    const isYellow = starNumber <= displayRating;

    return (
      <button
        key={starNumber}
        onMouseEnter={() => setHoverRating(starNumber)}  // Show preview on hover
        onMouseLeave={() => setHoverRating(0)}           // Hide preview on leave
        onClick={() => setRating(starNumber)}            // Set rating on click
        className={`text-4xl transition-all duration-200 transform hover:scale-110 ${
          isYellow ? "text-yellow-400" : "text-gray-300"
        }`}
        title={`Rate ${starNumber} stars`}
      >
        ⭐
      </button>
    );
  };

  return (
    <div className="space-y-4">
      {/* ADD/EDIT REVIEW */}
      {userId && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-3">
            {userReview ? "Edit Your Review" : "Add a Review"}
          </h4>

          <div className="space-y-3">
            {/* RATING - INTERACTIVE STARS */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating
              </label>
              <div className="flex gap-3">
                {[1, 2, 3, 4, 5].map((starNumber) => renderStar(starNumber))}
              </div>
              {rating > 0 && (
                <p className="text-sm text-gray-600 mt-2">
                  Your rating: <span className="font-semibold">{rating} star{rating !== 1 ? 's' : ''}</span>
                </p>
              )}
            </div>

            {/* COMMENT */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comment
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write your review here..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                rows="3"
              />
            </div>

            {/* SUBMIT BUTTON */}
            <button
              onClick={submitReview}
              disabled={loading || rating === 0}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              {loading
                ? "Submitting..."
                : userReview
                ? "Update Review"
                : "Add Review"}
            </button>
          </div>
        </div>
      )}

      {/* REVIEWS LIST */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-3">
          Reviews ({reviews.length})
        </h4>

        {reviews.length === 0 ? (
          <p className="text-gray-500 text-sm">No reviews yet</p>
        ) : (
          <div className="space-y-3">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-gray-50 p-3 rounded-lg border border-gray-200 hover:bg-gray-100 transition"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex gap-2">
                    <span className="text-yellow-400">
                      {"⭐".repeat(review.rating)}
                    </span>
                    <span className="text-gray-600 text-sm">
                      ({review.rating}/5)
                    </span>
                  </div>

                  {userReview?.id === review.id && (
                    <button
                      onClick={() => deleteReview(review.id)}
                      className="text-red-600 text-sm hover:text-red-700 font-medium"
                    >
                      Delete
                    </button>
                  )}
                </div>

                <p className="text-gray-800 text-sm">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Reviews;