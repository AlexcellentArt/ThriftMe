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
import PageWrapper from "./components/PageWrapper.jsx";
import { AuthContextProvider,AuthContext } from "./components/AuthContext.jsx";
import { SearchContext,SearchContextProvider } from "./components/SearchContext.jsx";
// import {Elements} from '@stripe/react-stripe-js';
// import {loadStripe} from '@stripe/stripe-js';
// const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');
function App() {
  const {token,isAdmin} = useContext(AuthContext);
  // const options = {
  //   // passing the client secret obtained from the server
  //   clientSecret: '{{CLIENT_SECRET}}',
  // };
  return (
    <AuthContextProvider>
    <SearchContextProvider>
    {/* <Elements stripe={stripePromise} options={options}> */}
    <BrowserRouter>
    <PageWrapper>
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />

          <Route path="/products" element={<Products />} />
          <Route path="/products:query" element={<Products />} />
          <Route path="/products/:id" element={<SingleProduct />} />

          {/* <Route path="/cart" element={<Cart />} /> */}
          <Route
            path="/checkout"
            element={
              <Checkout/>}/>

          {/* <Route
            path="/order/:id"
            element={
              <OrderConfirmation/>
              // token ? (
              //   <OrderConfirmation/>
              // ) : (
              //   <Navigate to="/login" />
              // )
            }
          /> */}

          <Route path="/login" element={<Login/>} />

          <Route path="/register" element={<Register/>} />

          {/* Only logged-in users can view their account */}
          <Route
            path="/account"
            element={<Account/>
              // token ? <Account/> : <Navigate to="/login" />
            }
          />

          {/* admin route */}
          <Route
            path="/admin"
            element={
              <AdminDashboard />
              // isAdmin ? (
              //   <AdminDashboard/>
              // ) : (
              //   <Navigate to="/login" />
              // )
            }
          />
        </Routes>
      </PageWrapper>
    </BrowserRouter>
    
    {/* </Elements> */}
    </SearchContextProvider>
    </AuthContextProvider>
  );
}

export default App;
