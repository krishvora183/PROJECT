import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import './AdminDashboard.css';

const AdminServices = () => {
  const sidebarItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/admin/products', label: 'Products', icon: '📦' },
    { path: '/admin/orders', label: 'Orders', icon: '🛒' },
    { path: '/admin/users', label: 'Users', icon: '👥' },
    { path: '/admin/services', label: 'Services', icon: '🔧' },
    { path: '/admin/complaints', label: 'Complaints', icon: '📝' },
    { path: '/admin/reports', label: 'Reports', icon: '📈' }
  ];

  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);

  const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};
  const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

  const fetchServices = async () => {
    try {
      const { data } = await axios.get('/api/services', config);
      setServices(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleViewDetails = (service) => {
    setSelectedService(service);
  };

  const handleAssign = async (id, currentStatus) => {
    try {
      await axios.put(`/api/services/${id}/status`, { status: currentStatus === 'Pending' ? 'In Progress' : 'Completed' }, config);
      fetchServices();
      setSelectedService(null);
    } catch (error) {
      alert("Failed to update status");
    }
  };

  const closeModal = () => {
    setSelectedService(null);
  };

  return (
    <div className="admin-layout">
      <Sidebar items={sidebarItems} />
      
      <div className="admin-content">
        <div className="admin-header">
          <h1>Service Assignment</h1>
        </div>

        <div className="card">
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Service ID</th>
                  <th>Customer</th>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {services.map(service => (
                  <tr key={service._id}>
                    <td>{service._id.substring(0, 8)}...</td>
                    <td>{service.user ? service.user.name : 'Unknown User'}</td>
                    <td>{service.serviceType}</td>
                    <td>{service.description.substring(0, 30)}...</td>
                    <td>
                      <span className={`status-badge ${service.status.toLowerCase().replace(' ', '-')}`}>
                        {service.status}
                      </span>
                    </td>
                    <td>{new Date(service.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          onClick={() => handleViewDetails(service)} 
                          className="btn btn-outline"
                          style={{ padding: '8px 16px', fontSize: '13px' }}
                        >
                          View
                        </button>
                        {service.status !== 'Completed' && (
                          <button 
                            onClick={() => handleAssign(service._id, service.status)} 
                            className="btn btn-primary"
                            style={{ padding: '8px 16px', fontSize: '13px' }}
                          >
                            Mark {service.status === 'Pending' ? 'In Progress' : 'Completed'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {selectedService && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content card" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Service Request Details</h2>
                <button onClick={closeModal} className="close-btn">✕</button>
              </div>
              
              <div className="detail-section">
                <div className="detail-row">
                  <span className="detail-label">Service ID:</span>
                  <span className="detail-value">{selectedService._id}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Status:</span>
                  <span className={`status-badge ${selectedService.status.toLowerCase().replace(' ', '-')}`}>
                    {selectedService.status}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Request Date:</span>
                  <span className="detail-value">{new Date(selectedService.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="detail-section">
                <h3>Customer Information</h3>
                <div className="detail-row">
                  <span className="detail-label">Name:</span>
                  <span className="detail-value">{selectedService.user?.name}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">{selectedService.user?.email}</span>
                </div>
              </div>

              <div className="detail-section">
                <h3>Service Information</h3>
                <div className="detail-row">
                  <span className="detail-label">Service Type:</span>
                  <span className="detail-value">{selectedService.serviceType}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label" style={{alignItems: 'flex-start'}}>Description:</span>
                  <span className="detail-value" style={{whiteSpace: 'pre-wrap'}}>{selectedService.description}</span>
                </div>
              </div>

              <div className="modal-actions">
                {selectedService.status !== 'Completed' && (
                  <button onClick={() => handleAssign(selectedService._id, selectedService.status)} className="btn btn-primary">
                    Mark {selectedService.status === 'Pending' ? 'In Progress' : 'Completed'}
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

export default AdminServices;
