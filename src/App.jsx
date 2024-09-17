import thriftmeLogo from "/src/assets/ThriftMeLogo.svg";
import "./App.css";
import { Routes, Route, Navigate,BrowserRouter } from "react-router-dom";
import { useContext, useState } from "react";
import Navigations from "./components/Navigations";
import Home from './components/Home';
import Products from './components/Products';
import SingleProduct from './components/SingleProduct';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import OrderConfirmation from './components/OrderConfirmation';
import Login from './components/Login';
import Register from './components/Register';
import Account from './components/Account';
import AdminDashboard from './components/AdminDashboard';
import { TokenContext } from "./TokenContext";
function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const {token, setToken} = useContext(TokenContext);
  return (
    <BrowserRouter>
      <header>
        <div>
          <img src={thriftmeLogo} className="logo hover" alt="ThriftMe logo" />
        </div>
        <Navigations/>
      </header>

      <main>
        <p>Site To Be Built</p>
        <Routes>
          <Route path="/" element={<Navigate to="/products" />} />

          <Route path="/products" element={<Products />} />

          <Route path="/products/:id" element={<SingleProduct />} />

          <Route path="/cart" element={<Cart />} />

          {/* Only logged-in users can check out */}
          <Route
            path="/checkout"
            element={
              token ? <Checkout/> : <Navigate to="/login" />
            }
          />

          <Route
            path="/order/:id"
            element={
              token ? (
                <OrderConfirmation/>
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route path="/login" element={<Login/>} />

          <Route path="/register" element={<Register/>} />

          {/* Only logged-in users can view their account */}
          <Route
            path="/account"
            element={
              token ? <Account token={token} /> : <Navigate to="/login" />
            }
          />

          {/* admin route */}
          <Route
            path="/admin"
            element={
              isAdmin ? (
                <AdminDashboard token={token} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
