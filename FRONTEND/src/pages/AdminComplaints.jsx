import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import './AdminDashboard.css';

const AdminComplaints = () => {
  const sidebarItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/admin/products', label: 'Products', icon: '📦' },
    { path: '/admin/orders', label: 'Orders', icon: '🛒' },
    { path: '/admin/users', label: 'Users', icon: '👥' },
    { path: '/admin/services', label: 'Services', icon: '🔧' },
    { path: '/admin/complaints', label: 'Complaints', icon: '📝' },
    { path: '/admin/reports', label: 'Reports', icon: '📈' }
  ];

  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};
  const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

  const fetchComplaints = async () => {
    try {
      const { data } = await axios.get('/api/complaints', config);
      setComplaints(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleViewDetails = (complaint) => {
    setSelectedComplaint(complaint);
  };

  const handleAssign = async (id) => {
    try {
      await axios.put(`/api/complaints/${id}/status`, { status: 'Resolved' }, config);
      fetchComplaints();
      setSelectedComplaint(null);
    } catch (error) {
      alert("Failed to update status");
    }
  };

  const closeModal = () => {
    setSelectedComplaint(null);
  };

  return (
    <div className="admin-layout">
      <Sidebar items={sidebarItems} />
      
      <div className="admin-content">
        <div className="admin-header">
          <h1>Complaint Assignment</h1>
        </div>

        <div className="card">
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Complaint ID</th>
                  <th>Customer</th>
                  <th>Subject</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map(complaint => (
                  <tr key={complaint._id}>
                    <td>{complaint._id.substring(0, 8)}...</td>
                    <td>{complaint.user ? complaint.user.name : 'Unknown'}</td>
                    <td>{complaint.description.split('\n')[0].replace('Subject: ', '').substring(0, 20)}...</td>
                    <td>
                      <span className={`status-badge ${complaint.status.toLowerCase().replace(' ', '-')}`}>
                        {complaint.status}
                      </span>
                    </td>
                    <td>{new Date(complaint.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => handleViewDetails(complaint)} className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '13px' }}>View</button>
                        {complaint.status === 'Open' && (
                          <button onClick={() => handleAssign(complaint._id)} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '13px' }}>Mark Resolved</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {selectedComplaint && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content card" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Complaint Details</h2>
                <button onClick={closeModal} className="close-btn">✕</button>
              </div>
              
              <div className="detail-section">
                <div className="detail-row">
                  <span className="detail-label">Complaint ID:</span>
                  <span className="detail-value">{selectedComplaint._id}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Status:</span>
                  <span className={`status-badge ${selectedComplaint.status.toLowerCase().replace(' ', '-')}`}>{selectedComplaint.status}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Filed Date:</span>
                  <span className="detail-value">{new Date(selectedComplaint.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="detail-section">
                <h3>Customer Information</h3>
                <div className="detail-row">
                  <span className="detail-label">Name:</span>
                  <span className="detail-value">{selectedComplaint.user?.name}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">{selectedComplaint.user?.email}</span>
                </div>
              </div>

              <div className="detail-section">
                <h3>Complaint Information</h3>
                <div className="detail-row">
                  <span className="detail-label">Related ID:</span>
                  <span className="detail-value">{selectedComplaint.relatedId}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label" style={{alignItems: 'flex-start'}}>Details:</span>
                  <span className="detail-value" style={{whiteSpace: 'pre-wrap'}}>{selectedComplaint.description}</span>
                </div>
              </div>

              <div className="modal-actions">
                {selectedComplaint.status === 'Open' && (
                  <button onClick={() => handleAssign(selectedComplaint._id)} className="btn btn-primary">
                    Mark Resolved
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

export default AdminComplaints;
