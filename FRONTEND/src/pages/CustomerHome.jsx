import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './CustomerHome.css';
import './AdminProducts.css'; // Utilizing the bulletproof grid modal layout

const CustomerHome = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};
  const firstName = userInfo.name ? userInfo.name.split(' ')[0] : 'Customer';

  const [stats, setStats] = useState([
    { label: 'Total Orders', value: '0', icon: '📦' },
    { label: 'Active Services', value: '0', icon: '🔧' },
    { label: 'Pending Complaints', value: '0', icon: '📝' },
    { label: 'Wishlist Items', value: '0', icon: '❤️' }
  ]);

  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo || !userInfo.token) return;

        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get('/api/orders/myorders', config);
        
        // Update stats
        setStats(prev => [
            { ...prev[0], value: data.length.toString() },
            ...prev.slice(1)
        ]);

        // Map recent orders (sort by date descending, take top 5)
        const sortedData = data.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
        
        const mappedOrders = sortedData.map(order => ({
            id: order._id.toString().substring(0,8),
            product: order.orderItems[0]?.name || 'Multiple Items',
            quantity: order.orderItems.reduce((acc, item) => acc + item.qty, 0),
            amount: order.totalPrice.toFixed(2),
            status: order.isDelivered ? 'Delivered' : (order.isPaid ? 'Processing' : 'Pending'),
            date: new Date(order.createdAt).toLocaleDateString(),
            address: order.shippingAddress ? `${order.shippingAddress.address}, ${order.shippingAddress.city}` : 'Default Address',
            paymentMethod: order.paymentMethod || 'Online'
        }));

        setRecentOrders(mappedOrders);
      } catch (error) {
        console.error('Failed to fetch user orders', error);
      }
    };

    fetchMyOrders();
  }, []);

  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
  };

  const closeModal = () => {
    setSelectedOrder(null);
  };

  return (
    <div className="customer-home">
      <div className="container">
        <div className="welcome-section">
          <h1>Welcome back, {firstName}! 👋</h1>
          <p>Here's what's happening with your account today</p>
        </div>

        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card card">
              <span className="stat-icon">{stat.icon}</span>
              <div className="stat-info">
                <h3>{stat.value}</h3>
                <p>{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <Link to="/customer/products" className="action-card card">
              <span className="action-icon">🛍️</span>
              <h3>Browse Products</h3>
              <p>Explore our catalog</p>
            </Link>
            <Link to="/customer/cart" className="action-card card">
              <span className="action-icon">🛒</span>
              <h3>View Cart</h3>
              <p>3 items waiting</p>
            </Link>
            <Link to="/customer/service-request" className="action-card card">
              <span className="action-icon">🔧</span>
              <h3>Request Service</h3>
              <p>Get help with products</p>
            </Link>
            <Link to="/customer/complaints" className="action-card card">
              <span className="action-icon">📝</span>
              <h3>File Complaint</h3>
              <p>Report an issue</p>
            </Link>
          </div>
        </div>

        <div className="recent-orders">
          <h2>Recent Orders</h2>
          <div className="orders-list">
            {recentOrders.map((order) => (
              <div 
                key={order.id} 
                className="order-item card"
                onClick={() => handleOrderClick(order)}
                style={{ cursor: 'pointer' }}
              >
                <div className="order-info">
                  <h4>{order.product}</h4>
                  <p className="order-id">Order #{order.id}</p>
                </div>
                <div className="order-status">
                  <span className={`status-badge ${order.status.toLowerCase().replace(' ', '-')}`}>
                    {order.status}
                  </span>
                  <p className="order-date">{order.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedOrder && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content card" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Order Details</h2>
                <button onClick={closeModal} className="close-btn">✕</button>
              </div>
              
              <div className="detail-section">
                <div className="detail-row">
                  <span className="detail-label">Order ID:</span>
                  <span className="detail-value">{selectedOrder.id}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Status:</span>
                  <span className={`status-badge ${selectedOrder.status.toLowerCase().replace(' ', '-')}`}>
                    {selectedOrder.status}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Order Date:</span>
                  <span className="detail-value">{selectedOrder.date}</span>
                </div>
              </div>

              <div className="detail-section">
                <h3>Product Information</h3>
                <div className="detail-row">
                  <span className="detail-label">Product:</span>
                  <span className="detail-value">{selectedOrder.product}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Quantity:</span>
                  <span className="detail-value">{selectedOrder.quantity}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Amount:</span>
                  <span className="detail-value">₹{selectedOrder.amount}</span>
                </div>
              </div>

              <div className="detail-section">
                <h3>Delivery Information</h3>
                <div className="detail-row">
                  <span className="detail-label">Delivery Address:</span>
                  <span className="detail-value">{selectedOrder.address}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Payment Method:</span>
                  <span className="detail-value">{selectedOrder.paymentMethod}</span>
                </div>
              </div>

              <div className="modal-actions">
                <button onClick={closeModal} className="btn btn-outline">Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerHome;
