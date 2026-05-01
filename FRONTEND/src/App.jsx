import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import CustomerLogin from './pages/CustomerLogin';
import CustomerRegister from './pages/CustomerRegister';
import CustomerHome from './pages/CustomerHome';
import ProductListing from './pages/ProductListing';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Payment from './pages/Payment';
import ServiceRequest from './pages/ServiceRequest';
import Complaints from './pages/Complaints';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import AdminOrders from './pages/AdminOrders';
import AdminUsers from './pages/AdminUsers';
import AdminServices from './pages/AdminServices';
import AdminComplaints from './pages/AdminComplaints';
import AdminReports from './pages/AdminReports';
import './styles/global.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLogin = (admin = false) => {
    setIsLoggedIn(true);
    setIsAdmin(admin);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
  };

  return (
    <CartProvider>
      <Router>
        <div className="app">
          <Navbar isAdmin={isAdmin} isLoggedIn={isLoggedIn} onLogout={handleLogout} />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            
            {/* Customer Routes */}
            <Route path="/customer/login" element={<CustomerLogin onLogin={handleLogin} />} />
            <Route path="/customer/register" element={<CustomerRegister />} />
            <Route path="/customer/home" element={<CustomerHome />} />
            <Route path="/customer/products" element={<ProductListing />} />
            <Route path="/customer/products/:id" element={<ProductDetails />} />
            <Route path="/customer/cart" element={<Cart />} />
            <Route path="/customer/checkout" element={<Checkout />} />
            <Route path="/customer/payment" element={<Payment />} />
            <Route path="/customer/service-request" element={<ServiceRequest />} />
            <Route path="/customer/complaints" element={<Complaints />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin onLogin={handleLogin} />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/services" element={<AdminServices />} />
            <Route path="/admin/complaints" element={<AdminComplaints />} />
            <Route path="/admin/reports" element={<AdminReports />} />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
