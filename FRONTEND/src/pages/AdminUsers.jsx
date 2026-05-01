import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Sidebar from '../components/Sidebar';
import './AdminDashboard.css';

const AdminUsers = () => {
  const sidebarItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/admin/products', label: 'Products', icon: '📦' },
    { path: '/admin/orders', label: 'Orders', icon: '🛒' },
    { path: '/admin/users', label: 'Users', icon: '👥' },
    { path: '/admin/services', label: 'Services', icon: '🔧' },
    { path: '/admin/complaints', label: 'Complaints', icon: '📝' },
    { path: '/admin/reports', label: 'Reports', icon: '📈' }
  ];

  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo || !userInfo.token) return;

        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await api.get('/api/auth/users', config);
        
        const mappedUsers = data.map(u => ({
            id: u._id.toString().substring(0,8),
            name: u.name,
            email: u.email,
            phone: 'Not provided',
            status: u.role === 'admin' ? 'Active' : 'Pending',
            joined: new Date(u.createdAt).toLocaleDateString()
        }));

        setUsers(mappedUsers);
      } catch (error) {
        console.error('Failed to fetch user list', error);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="admin-layout">
      <Sidebar items={sidebarItems} />
      
      <div className="admin-content">
        <div className="admin-header">
          <h1>User Management</h1>
        </div>

        <div className="card">
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>
                      <span className={`status-badge ${user.status.toLowerCase()}`}>
                        {user.status}
                      </span>
                    </td>
                    <td>{user.joined}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
