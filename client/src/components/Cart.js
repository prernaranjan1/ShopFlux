import React from "react";

function Cart({
  cart,
  addToCart,
  removeFromCart,
  decreaseQuantity,
  checkout,
  loadingId,
}) {
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mt-10">
      <h2 className="text-2xl font-bold mb-6">
        🛒 Shopping Cart ({cart.length} items)
      </h2>

      {cart.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">Your cart is empty</p>
          <p className="text-gray-400 text-sm mt-2">
            Add some products to get started!
          </p>
        </div>
      ) : (
        <>
          {/* CART ITEMS */}
          <div className="space-y-3 mb-6 border-t border-b py-4">
            {cart.map((item) => (
              <div
                key={item.product_id}
                className="flex justify-between items-center hover:bg-gray-50 p-3 rounded"
              >
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{item.name}</p>
                  <p className="text-sm text-gray-600">
                    ₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {/* QUANTITY CONTROLS */}
                  <button
                    onClick={() => decreaseQuantity(item.product_id)}
                    disabled={loadingId === item.product_id}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded disabled:opacity-50"
                  >
                    −
                  </button>

                  <span className="font-semibold text-lg w-6 text-center">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() =>
                      addToCart({ id: item.product_id, name: item.name, price: item.price })
                    }
                    disabled={loadingId === item.product_id}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded disabled:opacity-50"
                  >
                    +
                  </button>

                  {/* REMOVE BUTTON */}
                  <button
                    onClick={() => removeFromCart(item.product_id)}
                    disabled={loadingId === item.product_id}
                    className="bg-red-100 hover:bg-red-200 text-red-600 px-3 py-1 rounded disabled:opacity-50"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* TOTAL & CHECKOUT */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">
              Total: <span className="text-green-600">₹{total.toFixed(2)}</span>
            </h3>
          </div>

          <button
            onClick={checkout}
            disabled={loadingId !== null || cart.length === 0}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg disabled:bg-gray-400 transition"
          >
            {loadingId === "checkout" ? "Processing..." : "✓ Checkout"}
          </button>
        </>
      )}
    </div>
  );
}

export default Cart;