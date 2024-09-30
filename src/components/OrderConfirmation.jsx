import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "./AuthContext";

function OrderConfirmation() {
  const { id } = useParams();
  const [currentOrder, setCurrentOrder] = useState(order || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  //   const { token } = useContext(AuthContext);
const {state} = useLocation()
  // fetch the order details using the order ID after checkout
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!currentOrder) {
        try {
          const response = await fetch(
            `http://localhost:3000/api/orders/${id}`,
            {
              // headers: {
              //   Authorization: `Bearer ${token}`,
              //   "Content-Type": "application/json",
              // },
            }
          );
          if (!response.ok) {
            throw new Error("Failed to fetch order details.");
          }
          const data = await response.json();
          setCurrentOrder(data);
          setLoading(false);
        } catch (error) {
          setError(error.message);
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    if (token) {
      // Only fetch if token exists
      fetchOrderDetails();
    }
  }, [id, state]);

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

          <h3>Order Number: {currentOrder.id}</h3>
          <p>Total Amount: ${currentOrder.totalCost}</p>

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
