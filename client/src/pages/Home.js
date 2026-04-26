import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import ProductList from "../components/ProductList";
import ProductDetail from "./ProductDetail";
import Cart from "../components/Cart";
import OrderHistory from "./OrderHistory";
import Wishlist from "./Wishlist";
import toast from "react-hot-toast";

const API_URL = "http://localhost:5000/api";

function Home({ user }) {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [category, setCategory] = useState("");
  const [maxPrice, setMaxPrice] = useState(200000);
  const [loadingId, setLoadingId] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [currentPage, setCurrentPage] = useState("shopping");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productsLoading, setProductsLoading] = useState(true);
  const [error, setError] = useState(null);

  // ==========================
  // 🔹 FETCH PRODUCTS - WITH DEBUG
  // ==========================
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setProductsLoading(true);
        setError(null);
        console.log("🔄 Fetching products from:", API_URL + "/products");
        
        const res = await axios.get(`${API_URL}/products`);
        console.log("✅ Products response:", res.data);

        // Handle different response formats
        let productsData = [];
        
        if (res.data && res.data.success && Array.isArray(res.data.data)) {
          productsData = res.data.data;
        } else if (Array.isArray(res.data)) {
          productsData = res.data;
        } else if (res.data && res.data.products && Array.isArray(res.data.products)) {
          productsData = res.data.products;
        } else {
          console.warn("⚠️ Unexpected response format:", res.data);
          productsData = [];
        }

        console.log(`✅ Loaded ${productsData.length} products`);
        setProducts(productsData);
        
        if (productsData.length === 0) {
          setError("No products found in database");
        }
      } catch (err) {
        console.error("❌ Error fetching products:", err);
        setError(err.message || "Failed to load products");
        toast.error("Failed to load products: " + (err.message || "Unknown error"));
        setProducts([]);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ==========================
  // 🔹 FETCH CART COUNT
  // ==========================
  const fetchCartCount = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API_URL}/cart/${user}/count`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setCartCount(res.data.count);
      }
    } catch (err) {
      console.error("Error fetching cart count:", err);
    }
  }, [user]);

  // ==========================
  // 🔹 FETCH WISHLIST COUNT
  // ==========================
  const fetchWishlistCount = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API_URL}/wishlist/${user}/count`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setWishlistCount(res.data.count);
      }
    } catch (err) {
      console.error("Error fetching wishlist count:", err);
    }
  }, [user]);

  // ==========================
  // 🔹 FETCH CART
  // ==========================
  const fetchCart = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API_URL}/cart/${user}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.items) {
        setCart(res.data.items);
        setCartCount(res.data.count || res.data.items.length);
      } else {
        setCart([]);
        setCartCount(0);
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
      setCart([]);
      setCartCount(0);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchCart();
      fetchCartCount();
      fetchWishlistCount();
    }
  }, [user, fetchCart, fetchCartCount, fetchWishlistCount]);

  // ==========================
  // 🔹 ADD TO CART
  // ==========================
  const addToCart = async (product) => {
    try {
      setLoadingId(product.id);
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${API_URL}/cart`,
        {
          user_id: user,
          product_id: product.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success || res.data.message) {
        toast.success(res.data.message || "Added to cart");

        setCart((prev) => {
          const existing = prev.find(
            (item) => item.product_id === product.id
          );

          if (existing) {
            return prev.map((item) =>
              item.product_id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
          }

          return [
            ...prev,
            {
              product_id: product.id,
              name: product.name,
              price: product.price,
              quantity: 1,
            },
          ];
        });

        setCartCount((prev) => prev + 1);
      }
    } catch (err) {
      console.error("Add to cart error:", err);
      const errorMsg =
        err.response?.data?.message || "Failed to add to cart";
      toast.error(errorMsg);
    } finally {
      setLoadingId(null);
    }
  };

  // ==========================
  // 🔹 REMOVE FROM CART
  // ==========================
  const removeFromCart = async (productId) => {
    try {
      setLoadingId(productId);
      const token = localStorage.getItem("token");

      const res = await axios.delete(
        `${API_URL}/cart/${user}/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success || res.data.message) {
        toast.success(res.data.message || "Removed from cart");

        setCart((prev) =>
          prev.filter((item) => item.product_id !== productId)
        );

        setCartCount((prev) => Math.max(0, prev - 1));
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to remove item";
      toast.error(errorMsg);
    } finally {
      setLoadingId(null);
    }
  };

  // ==========================
  // 🔹 DECREASE QUANTITY
  // ==========================
  const decreaseQuantity = async (productId) => {
    try {
      setLoadingId(productId);
      const token = localStorage.getItem("token");

      const res = await axios.put(
        `${API_URL}/cart/decrease/${user}/${productId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success || res.data.message) {
        setCart((prev) =>
          prev
            .map((item) =>
              item.product_id === productId
                ? { ...item, quantity: item.quantity - 1 }
                : item
            )
            .filter((item) => item.quantity > 0)
        );

        setCartCount((prev) => Math.max(0, prev - 1));
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to update quantity";
      toast.error(errorMsg);
    } finally {
      setLoadingId(null);
    }
  };

  // ==========================
  // 🔹 CHECKOUT
  // ==========================
  const checkout = async () => {
    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    try {
      setLoadingId("checkout");
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${API_URL}/orders/checkout`,
        { user_id: user },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        toast.success(
          `Order #${res.data.orderId} placed! Total: ₹${res.data.total}`
        );
        setCart([]);
        setCartCount(0);
      } else {
        toast.error(res.data.message || "Checkout failed");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      const errorMsg = err.response?.data?.message || "Checkout failed";
      toast.error(errorMsg);
    } finally {
      setLoadingId(null);
    }
  };

  // ==========================
  // 🔹 FILTER
  // ==========================
  const filteredProducts = products.filter(
    (p) =>
      (category ? p.category?.toLowerCase() === category : true) &&
      p.price <= maxPrice
  );

  if (!user) return <div className="p-6 text-center">Loading...</div>;

  // ==========================
  // 🔹 RENDER ORDER HISTORY
  // ==========================
  if (currentPage === "orders") {
    return <OrderHistory user={user} />;
  }

  // ==========================
  // 🔹 RENDER WISHLIST
  // ==========================
  if (currentPage === "wishlist") {
    return (
      <Wishlist 
        userId={user}
        onBack={() => setCurrentPage("shopping")}
      />
    );
  }

  // ==========================
  // 🔹 RENDER SHOPPING PAGE
  // ==========================
  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="sticky top-0 z-20 bg-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">🛒 E-Commerce</h1>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setCurrentPage("orders")}
                className="px-4 py-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 font-medium text-sm"
              >
                📦 Orders
              </button>

              <button
                onClick={() => setCurrentPage("wishlist")}
                className="px-4 py-2 bg-pink-100 text-pink-600 rounded hover:bg-pink-200 font-medium text-sm"
              >
                ❤️ Wishlist ({wishlistCount})
              </button>

              <div style={{ position: "relative", cursor: "pointer" }}>
                <span style={{ fontSize: "24px" }}>🛒</span>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                    {cartCount}
                  </span>
                )}
              </div>

              <button
                onClick={() => {
                  localStorage.clear();
                  window.location.reload();
                }}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 font-medium text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* FILTER */}
        <div className="flex gap-4 mb-8 bg-white p-4 rounded shadow flex-wrap">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded"
          >
            <option value="">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="clothes">Clothes</option>
            <option value="home">Home</option>
            <option value="books">Books</option>
            <option value="sports">Sports</option>
            <option value="gaming">Gaming</option>
          </select>

          <div className="flex items-center gap-2">
            <span>Price: ₹{maxPrice.toLocaleString()}</span>
            <input
              type="range"
              min="0"
              max="200000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-48"
            />
          </div>
        </div>

        {/* LOADING STATE */}
        {productsLoading ? (
          <div className="text-center py-12 bg-white rounded shadow">
            <p className="text-lg text-gray-600">⏳ Loading products...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-white rounded shadow border-2 border-red-300">
            <p className="text-lg text-red-600">❌ Error: {error}</p>
            <p className="text-sm text-gray-500 mt-2">
              Check backend console for details
            </p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 bg-white rounded shadow">
            <p className="text-lg text-gray-600">📭 No products found</p>
          </div>
        ) : (
          <>
            {/* PRODUCTS GRID */}
            <div className="mb-8">
              <ProductList
                products={filteredProducts}
                addToCart={addToCart}
                onViewDetails={setSelectedProduct}
                loadingId={loadingId}
              />
            </div>

            {/* PRODUCT DETAIL MODAL */}
            {selectedProduct && (
              <ProductDetail
                product={selectedProduct}
                onClose={() => setSelectedProduct(null)}
                addToCart={addToCart}
                loadingId={loadingId}
              />
            )}

            {/* CART */}
            <Cart
              cart={cart}
              addToCart={addToCart}
              removeFromCart={removeFromCart}
              decreaseQuantity={decreaseQuantity}
              checkout={checkout}
              loadingId={loadingId}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default Home;