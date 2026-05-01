import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Sidebar from '../components/Sidebar';
import './AdminDashboard.css';
import './AdminReports.css';

const AdminReports = () => {
  const sidebarItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/admin/products', label: 'Products', icon: '📦' },
    { path: '/admin/orders', label: 'Orders', icon: '🛒' },
    { path: '/admin/users', label: 'Users', icon: '👥' },
    { path: '/admin/services', label: 'Services', icon: '🔧' },
    { path: '/admin/complaints', label: 'Complaints', icon: '📝' },
    { path: '/admin/reports', label: 'Reports', icon: '📈' }
  ];

  const [selectedReport, setSelectedReport] = useState('sales');

  const [reportData, setReportData] = useState({
    salesData: [],
    topProducts: [],
    inventoryReport: [],
    customerReport: [],
    totalRevenue: '₹0.00',
    totalOrders: 0
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await api.get('/api/reports/analytics', config);
        setReportData(data);
      } catch (error) {
        console.error('Error fetching analytics', error);
      }
    };
    fetchAnalytics();
  }, []);

  const { salesData, topProducts, inventoryReport, customerReport, totalRevenue, totalOrders } = reportData;

  const handleExport = (type) => {
    alert(`Exporting ${type} report as PDF...`);
  };

  return (
    <div className="admin-layout">
      <Sidebar items={sidebarItems} />
      
      <div className="admin-content">
        <div className="admin-header">
          <h1>Reports & Analytics</h1>
          <button onClick={() => handleExport(selectedReport)} className="btn btn-primary">
            📥 Export Report
          </button>
        </div>

        <div className="report-tabs">
          <button 
            className={`report-tab ${selectedReport === 'sales' ? 'active' : ''}`}
            onClick={() => setSelectedReport('sales')}
          >
            💰 Sales Report
          </button>
          <button 
            className={`report-tab ${selectedReport === 'products' ? 'active' : ''}`}
            onClick={() => setSelectedReport('products')}
          >
            📦 Top Products
          </button>
          <button 
            className={`report-tab ${selectedReport === 'inventory' ? 'active' : ''}`}
            onClick={() => setSelectedReport('inventory')}
          >
            📊 Inventory Status
          </button>
          <button 
            className={`report-tab ${selectedReport === 'customers' ? 'active' : ''}`}
            onClick={() => setSelectedReport('customers')}
          >
            👥 Customer Report
          </button>
        </div>

        {selectedReport === 'sales' && (
          <div className="report-content">
            <div className="report-summary">
              <div className="summary-card card">
                <h3>Total Revenue</h3>
                <p className="summary-value">{totalRevenue}</p>
                <span className="summary-change">0%</span>
              </div>
              <div className="summary-card card">
                <h3>Total Orders</h3>
                <p className="summary-value">{totalOrders}</p>
                <span className="summary-change">0%</span>
              </div>
              <div className="summary-card card">
                <h3>Avg Order Value</h3>
                <p className="summary-value">₹{totalOrders ? (parseFloat(totalRevenue.replace('₹','')) / totalOrders).toFixed(2) : '0.00'}</p>
                <span className="summary-change">0%</span>
              </div>
            </div>

            <div className="card">
              <h2>Monthly Sales Performance</h2>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Month</th>
                      <th>Revenue (₹)</th>
                      <th>Orders</th>
                      <th>Avg Order (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salesData.map((data, index) => (
                      <tr key={index}>
                        <td>{data.month}</td>
                        <td>₹{data.revenue.toLocaleString()}</td>
                        <td>{data.orders}</td>
                        <td>₹{data.orders ? (data.revenue / data.orders).toFixed(2) : '0.00'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {selectedReport === 'products' && (
          <div className="report-content">
            <div className="card">
              <h2>Top Selling Products</h2>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Product Name</th>
                      <th>Barcode</th>
                      <th>Units Sold</th>
                      <th>Revenue (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topProducts.map((product, index) => (
                      <tr key={index}>
                        <td>{product.name}</td>
                        <td><span className="barcode-display">PID-{product.id}</span></td>
                        <td>{product.sales}</td>
                        <td>{product.revenue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {selectedReport === 'inventory' && (
          <div className="report-content">
            <div className="card">
              <h2>Inventory Status Report</h2>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Current Stock</th>
                      <th>Reorder Level</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventoryReport.map((item, index) => (
                      <tr key={index}>
                        <td>{item.name}</td>
                        <td>{item.stock}</td>
                        <td>10</td>
                        <td>
                          <span className={`status-badge ${
                              item.status === 'Out of Stock' ? 'inactive' : 
                              item.status === 'Low Stock' ? 'medium' : 'active'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {selectedReport === 'customers' && (
          <div className="report-content">
            <div className="card">
              <h2>Top Customers Report</h2>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Customer Name</th>
                      <th>Total Orders</th>
                      <th>Total Spent (₹)</th>
                      <th>Last Order</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customerReport.map((customer, index) => (
                      <tr key={index}>
                        <td>{customer.name}</td>
                        <td>{customer.orders}</td>
                        <td>{customer.spent}</td>
                        <td>Recent</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReports;
