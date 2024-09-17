import thriftmeLogo from "/src/assets/ThriftMeLogo.svg";
import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
/* import Navigations from "./components/Navigations";
import Products from './components/Products';
import SingleProduct from './components/SingleProduct';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import OrderConfirmation from './components/OrderConfirmation';
import Login from './components/Login';
import Register from './components/Register';
import Account from './components/Account';
import AdminDashboard from './components/AdminDashboard';
*/

function App() {
  return (
    <BrowserRouter>
      <header>
        <div>
          <img src={thriftmeLogo} className="logo hover" alt="ThriftMe logo" />
        </div>
        <Navigations token={token} />
      </header>

      <main>
        <p>Site To Be Built</p>
        <Routes>
          <Route path="/" element={<Navigate to="/products" />} />

          <Route path="/products" element={<Products />} />

          <Route path="/products/:id" element={<SingleProduct />} />

          <Route path="/cart" element={<Navigate to="/products" />} />

          <Route path="/checkout" element={<Navigate to="/products" />} />

          <Route path="/login" element={<Login setToken={setToken} />} />

          <Route path="/register" element={<Register setToken={setToken} />} />

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
