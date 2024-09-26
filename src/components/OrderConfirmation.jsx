import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

function OrderConfirmation() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const { token } = useContext(AuthContext);

  // fetch the order details using the order ID after checkout
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/orders/${id}`, {
          // headers: {
          //   Authorization: `Bearer ${token}`,
          //   "Content-Type": "application/json",
          // },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch order details.");
        }
        const data = await response.json();
        setOrder(data); // Set order details
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (token) {
      // Only fetch if token exists
      fetchOrderDetails();
    }
  }, [id, token]);

  if (loading) return <div>Loading your order details...</div>;
  if (error) return <div>Error: {error}</div>;

  // Continue Shopping function with button
  const handleContinueShopping = () => {
    navigate("/products");
  };

  return (
    <div className="orderConfirmation">
      <h2>Order Confirmation</h2>
      {order ? (
        <>
          <p>Thank you for your purchase, {order.customerName}!</p>

          <h3>Order Number: {order.id}</h3>
          <p>Total Amount: ${order.totalCost}</p>

          <h3>Shipping Address:</h3>
          <p>{order.address.street}</p>
          <p>
            {order.address.city}, {order.address.state} {order.address.zip}
          </p>

          <h3>Items Purchased:</h3>
          <ul>
            {order.items.map((item) => (
              <li key={item.id}>
                {item.name} (x{item.quantity}) - ${item.price * item.quantity}
              </li>
            ))}
          </ul>

          <h3>Order Date:</h3>
          <p>{new Date(order.createdAt).toLocaleDateString()}</p>

          <button
            onClick={handleContinueShopping}
            className="continue-shopping-btn"
          >
            Continue Shopping
          </button>
        </>
      ) : (
        <p>Order not found.</p>
      )}
    </div>
  );
}

export default OrderConfirmation;
