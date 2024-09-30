import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { useLocation } from "react-router-dom";

function OrderConfirmation() {
  const { id } = useParams();
  const [currentOrder, setCurrentOrder] = useState(order || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  // passing relevant info via state as it is unecessary to make an entire fetch call for information already compiled in checkout
  const { state } = useLocation();

  // Continue Shopping function with button
  const handleContinueShopping = () => {
    navigate("/products");
  };

  return (
    <div className="orderConfirmation">
      <h2>Order Confirmation</h2>
      {order ? (
        <>
          <p>Thank you for your purchase, {order.buyer}!</p>

          <h3>Order Number: {currentOrder.id}</h3>
          <p>Total Amount: ${currentOrder.totalCost}</p>

          <h3>Shipping Address:</h3>
          <p>{order.address.street}</p>
          <p>
            {order.address.city}, {order.address.state} {order.address.zip}
          </p>

          <h3>Items Purchased:</h3>
          <DisplayMany
              data={cart.mapped}
              factory={summarizeItem}
              additionalClasses="flex-v"
            />

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
