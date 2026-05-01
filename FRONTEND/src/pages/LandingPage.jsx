import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <div className="hero-section">
        <div className="container">
          <h1 className="hero-title">Welcome to Shiv Electricals</h1>
          <p className="hero-subtitle">Your trusted partner for electrical products and service management</p>
          
          <div className="login-options">
            <Link to="/customer/login" className="login-card card">
              <div className="login-icon">👤</div>
              <h2>Customer Login</h2>
              <p>Browse products, place orders, and manage services</p>
              <button className="btn btn-primary">Login as Customer</button>
            </Link>
            
            <Link to="/admin/login" className="login-card card">
              <div className="login-icon">🛠️</div>
              <h2>Admin Login</h2>
              <p>Manage products, orders, and customer services</p>
              <button className="btn btn-outline">Login as Admin</button>
            </Link>
          </div>
          
          <div className="features">
            <div className="feature-item">
              <span className="feature-icon">🛍️</span>
              <h3>Wide Product Range</h3>
              <p>Browse thousands of products</p>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🚚</span>
              <h3>Fast Delivery</h3>
              <p>Quick and reliable shipping</p>
            </div>
            <div className="feature-item">
              <span className="feature-icon">💳</span>
              <h3>Secure Payment</h3>
              <p>Safe online transactions</p>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🎧</span>
              <h3>24/7 Support</h3>
              <p>Always here to help</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
