import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = "http://localhost:5000/api";

function OrderHistory({ user }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // =====================
  // 🔹 FETCH ORDERS
  // =====================
  useEffect(() => {
    if (user) {
      fetchOrders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      console.log("📦 Fetching orders for user:", user);

      const res = await axios.get(`${API_URL}/orders/user/${user}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("✅ Orders response:", res.data);

      if (res.data.success) {
        setOrders(res.data.data || []);
      } else if (Array.isArray(res.data)) {
        setOrders(res.data);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error("❌ Error fetching orders:", err);
      toast.error("Error loading orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // =====================
  // 🔹 CANCEL ORDER
  // =====================
  const cancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      const token = localStorage.getItem("token");

      console.log("❌ Cancelling order:", orderId);

      const res = await axios.delete(`${API_URL}/orders/${orderId}/cancel`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("✅ Cancel response:", res.data);

      if (res.data.success) {
        toast.success("Order cancelled");
        setOrders(orders.filter((order) => order.id !== orderId));
      }
    } catch (err) {
      console.error("❌ Error cancelling order:", err);
      toast.error("Error cancelling order");
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <p className="text-lg text-gray-600">⏳ Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* HEADER */}
      <div className="max-w-5xl mx-auto mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          📦 Order History
        </h1>
        <p className="text-gray-600">
          You have {orders.length} order{orders.length !== 1 ? "s" : ""}
        </p>
      </div>

      {orders.length === 0 ? (
        // EMPTY STATE
        <div className="max-w-5xl mx-auto bg-white rounded-lg shadow p-12 text-center">
          <p className="text-4xl mb-4">📭</p>
          <p className="text-lg text-gray-600">No orders yet</p>
          <p className="text-sm text-gray-500 mt-2">
            Start shopping to see your orders here!
          </p>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition p-6"
            >
              {/* ORDER HEADER */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Order #{order.id}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {new Date(order.created_at).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    order.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : order.status === "delivered"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {order.status?.toUpperCase() || "PENDING"}
                </span>
              </div>

              {/* ORDER ITEMS */}
              <div className="border-t border-b border-gray-200 py-4 mb-4">
                <div className="space-y-2">
                  {order.items && order.items.length > 0 ? (
                    <>
                      <h4 className="font-semibold text-gray-900 mb-3">Items:</h4>
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm bg-gray-50 p-2 rounded">
                          <div>
                            <p className="font-medium text-gray-900">
                              {item.name || item.product_name || "Product"}
                            </p>
                            <p className="text-gray-600">
                              Quantity: <span className="font-semibold">{item.quantity}</span>
                            </p>
                          </div>
                          <p className="text-gray-900 font-semibold">
                            ₹{(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </>
                  ) : (
                    <p className="text-gray-500 text-sm italic">No items in order</p>
                  )}
                </div>
              </div>

              {/* ORDER TOTAL & ACTION */}
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="text-2xl font-bold text-blue-600">
                    ₹{order.total?.toLocaleString() || "0"}
                  </p>
                </div>

                {order.status === "pending" && (
                  <button
                    onClick={() => cancelOrder(order.id)}
                    className="bg-red-100 text-red-600 px-4 py-2 rounded hover:bg-red-200 font-medium transition"
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrderHistory;