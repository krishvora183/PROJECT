import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Sidebar from '../components/Sidebar';
import './AdminDashboard.css';
import './AdminProducts.css';

const AdminOrders = () => {
  const sidebarItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/admin/products', label: 'Products', icon: '📦' },
    { path: '/admin/orders', label: 'Orders', icon: '🛒' },
    { path: '/admin/users', label: 'Users', icon: '👥' },
    { path: '/admin/services', label: 'Services', icon: '🔧' },
    { path: '/admin/complaints', label: 'Complaints', icon: '📝' },
    { path: '/admin/reports', label: 'Reports', icon: '📈' }
  ];

  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};
  const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/api/orders', config);
      setOrders(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
  };

  const closeModal = () => {
    setSelectedOrder(null);
  };

  const markAsDelivered = async (id) => {
    try {
      await api.put(`/api/orders/${id}/deliver`, {}, config);
      fetchOrders();
      closeModal();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="admin-layout">
      <Sidebar items={sidebarItems} />
      
      <div className="admin-content">
        <div className="admin-header">
          <h1>Order Management</h1>
        </div>

        <div className="card">
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id}>
                    <td>{order._id.substring(0, 8)}...</td>
                    <td>{order.user ? order.user.name : 'Unknown User'}</td>
                    <td>₹{order.totalPrice}</td>
                    <td>
                      <span className={`status-badge ${order.isDelivered ? 'delivered' : 'processing'}`}>
                        {order.isDelivered ? 'Delivered' : 'Processing'}
                      </span>
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button 
                        onClick={() => handleViewDetails(order)} 
                        className="btn btn-primary"
                        style={{ padding: '8px 16px', fontSize: '13px' }}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
                  <span className="detail-value">{selectedOrder._id}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Status:</span>
                  <span className={`status-badge ${selectedOrder.isDelivered ? 'delivered' : 'processing'}`}>
                    {selectedOrder.isDelivered ? 'Delivered' : 'Processing'}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Order Date:</span>
                  <span className="detail-value">{new Date(selectedOrder.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="detail-section">
                <h3>Customer Information</h3>
                <div className="detail-row">
                  <span className="detail-label">Name:</span>
                  <span className="detail-value">{selectedOrder.user?.name}</span>
                </div>
              </div>

              <div className="detail-section">
                <h3>Shipping Information</h3>
                <div className="detail-row">
                  <span className="detail-label">Address:</span>
                  <span className="detail-value">
                    {selectedOrder.shippingAddress?.address}, {selectedOrder.shippingAddress?.city}
                  </span>
                </div>
              </div>

              <div className="detail-section">
                <h3>Product Information</h3>
                <div className="detail-row">
                  <span className="detail-label">Items:</span>
                  <span className="detail-value">{selectedOrder.orderItems?.length} items</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Amount:</span>
                  <span className="detail-value">₹{selectedOrder.totalPrice}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Payment Method:</span>
                  <span className="detail-value">{selectedOrder.paymentMethod}</span>
                </div>
              </div>

              <div className="modal-actions">
                {!selectedOrder.isDelivered && (
                   <button onClick={() => markAsDelivered(selectedOrder._id)} className="btn btn-primary">
                     Mark as Delivered
                   </button>
                )}
                <button onClick={closeModal} className="btn btn-outline">Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
