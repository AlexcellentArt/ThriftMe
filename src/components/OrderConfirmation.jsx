import React, { useContext, useEffect, useState } from "react";
import {
  useParams,
  useNavigate,
  useLocation,
  createSearchParams,
} from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { SearchContext } from "./SearchContext";

function OrderConfirmation() {
  const { state } = useLocation();
  const [currentOrder, setCurrentOrder] = useState(state || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { info } = state;
  const { token } = useContext(AuthContext);
  const { reset } = useContext(SearchContext);
  // fetch the order details using the order ID after checkout.

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (currentOrder === null) {
        try {
          if (info) {
            setCurrentOrder(info);
          }
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
  }, []);

  if (loading) return <h1 className="dark-bg merriweather-black-italic large-text">Loading your order details...</h1>;
  if (error) return <h1>Error: {error}</h1>;

  // Continue Shopping function with button
  const handleContinueShopping = () => {
    navigate("/products", {
      state: {},
      search: createSearchParams(reset()).toString(),
    });
  };
  const summarizeItem = (item) => {
    return (
      <li key={item.id} className="merriweather-regular">
        {item.name} x({item.quantity}) - ${item.quantity * item.price}
      </li>
    );
  };
  const makeOrderUI = (order) => {
    return (
      <div className="light-bg rounded-corners flex-v">
        <h3 className="merriweather-regular">
          <span className="merriweather-bold">Seller:</span>
          {order.seller_name ? order.seller_name : "Seller"}
        </h3>
        <p className="merriweather-regular">
          <span className="merriweather-bold">Transaction Amount:</span> $
          {order.total_cost}
        </p>
        <h4 className="merriweather-bold">Items Purchased:</h4>
        <ul>{order.items.map((item) => summarizeItem(item))}</ul>
      </div>
    );
  };
  return (
    <div className="orderConfirmation flex-v align-items-center stretch">
      <h2>Order Confirmation</h2>
      {currentOrder !== undefined || null ? (
        <>
          <div className="flex-v align-items-center stretch">
            <p>Thank you for your purchase, {currentOrder.name}!</p>
            <h1 className="flex">Thank you for your purchase!</h1>
            <p className="flex">Overall Amount: ${currentOrder.total}</p>

            <h3 className="flex">Shipping Address:</h3>
            <p>{currentOrder.address}</p>
          </div>
          <div className="flex-h stretch flex">
            {currentOrder.orders.map((order) => {
              return makeOrderUI(order);
            })}
          </div>
          <button onClick={handleContinueShopping} className="three-d-button">
            Continue Shopping
          </button>
        </>
      ) : (
        <p>Order did not go through.</p>
      )}
    </div>
  );
}

export default OrderConfirmation;
