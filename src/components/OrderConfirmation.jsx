import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "./AuthContext";

function OrderConfirmation() {
  // const { id } = useParams();
  const { state } = useLocation();
  // const { name, orders, address, total } = state;
  // const [buyerInfo, setBuyerInfo] = useState();
  const [currentOrder, setCurrentOrder] = useState(state || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { info } = state;
  const {token} = useContext(AuthContext)
  // fetch the order details using the order ID after checkout.

  //Alex here, there is no singular order id. It's broken up by seller on the backend. We could make an order schema holding the transactions in an order, but we do not have time to add that on the backend.

  //I'm just passing via state the already processed data from checkout)
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (currentOrder === null) {
        try { console.log("STATE",state)
          // try {
          //   const response = await fetch(
          //     `http://localhost:3000/api/orders/${id}`,
          //     {
          //       // headers: {
          //       //   Authorization: `Bearer ${token}`,
          //       //   "Content-Type": "application/json",
          //       // },
          //     }
          //   );
          //   if (!response.ok) {
          //     throw new Error("Failed to fetch order details.");
          //   }
          //   const data = await response.json();
          // setBuyerInfo()
          if (info){
            console.log(info)
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

  if (loading) return <div>Loading your order details...</div>;
  if (error) return <div>Error: {error}</div>;

  // Continue Shopping function with button
  const handleContinueShopping = () => {
    navigate("/products");
  };
  const summarizeItem = (item) => {
    return (
      <li key={item.id}>
        {item.name} x({item.quantity}) - ${item.quantity * item.price}
      </li>
    );
  };
  const makeOrderUI = (order) => {
    return (
      <div className="light-bg rounded-corners flex-v">
        <h3>Seller: {order.seller_name}</h3>
        <p>Transaction Amount: ${order.total_cost}</p>
        <h4>Items Purchased:</h4>
        <ul>{order.items.map((item) => summarizeItem(item))}</ul>
      </div>
    );
  };
  return (
    <div className="orderConfirmation centered flex-v align-items-center">
      <h2>Order Confirmation</h2>
      {currentOrder !== undefined||null ? (
        <>
        {/* <p>Thank you for your purchase, {currentOrder.name}!</p> */}
          <h1>Thank you for your purchase!</h1>
          {/* <p>Overall Amount: ${currentOrder.total}</p>

          <h3>Shipping Address:</h3>
          <p>{currentOrder.address}</p> */}
          {/* {currentOrder.orders.map((order) => {
            return makeOrderUI(order);
          })} */}
          <button onClick={handleContinueShopping} className="three-d-button flex">
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
