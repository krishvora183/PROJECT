import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Sidebar from '../components/Sidebar';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const sidebarItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/admin/products', label: 'Products', icon: '📦' },
    { path: '/admin/orders', label: 'Orders', icon: '🛒' },
    { path: '/admin/users', label: 'Users', icon: '👥' },
    { path: '/admin/services', label: 'Services', icon: '🔧' },
    { path: '/admin/complaints', label: 'Complaints', icon: '📝' },
    { path: '/admin/reports', label: 'Reports', icon: '📈' }
  ];

  const [stats, setStats] = useState([
    { label: 'Total Orders', value: '0', change: '+0%', icon: '📦', color: '#4f46e5' },
    { label: 'Total Revenue', value: '₹0', change: '+0%', icon: '💰', color: '#10b981' },
    { label: 'Active Users', value: '0', change: '+0%', icon: '👥', color: '#f59e0b' },
    { label: 'Pending Complaints', value: '0', change: '0%', icon: '📝', color: '#ef4444' }
  ]);
  const [recentOrders, setRecentOrders] = useState([]);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await api.get('/api/reports/dashboard', config);
        setStats(data.stats);
        setRecentOrders(data.recentOrders);
      } catch (error) {
        console.error('Error fetching dashboard stats', error);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="admin-layout">
      <Sidebar items={sidebarItems} />
      
      <div className="admin-content">
        <div className="admin-header">
          <h1>Dashboard</h1>
          <p>Welcome back, Admin! Here's what's happening today.</p>
        </div>

        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card card" style={{ borderLeft: `4px solid ${stat.color}` }}>
              <div className="stat-icon" style={{ backgroundColor: `${stat.color}20` }}>
                {stat.icon}
              </div>
              <div className="stat-details">
                <p className="stat-label">{stat.label}</p>
                <h3 className="stat-value">{stat.value}</h3>
                <span className="stat-change" style={{ color: stat.change.startsWith('+') ? '#10b981' : '#ef4444' }}>
                  {stat.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-section card">
            <h2>Recent Orders</h2>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map(order => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{order.customer}</td>
                      <td>{order.amount}</td>
                      <td>
                        <span className={`status-badge ${order.status.toLowerCase()}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="dashboard-section card">
            <h2>Quick Actions</h2>
            <div className="quick-actions-grid">
              <button className="action-btn">
                <span>➕</span>
                Add Product
              </button>
              <button className="action-btn">
                <span>📦</span>
                View Orders
              </button>
              <button className="action-btn">
                <span>👥</span>
                Manage Users
              </button>
              <button className="action-btn">
                <span>📊</span>
                View Reports
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
