import React, { useState } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import './ServiceRequest.css';

const ServiceRequest = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    productId: '',
    serviceType: 'installation',
    description: '',
    preferredDate: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (!userInfo) {
        alert("Please login first to submit a request");
        navigate('/customer/login');
        return;
      }
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      
      await api.post('/api/services', {
        serviceType: formData.serviceType,
        description: `Product/Order ID: ${formData.productId}\nPreferred Date: ${formData.preferredDate}\n${formData.description}`,
      }, config);
      
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      setFormData({ productId: '', serviceType: 'installation', description: '', preferredDate: '' });
    } catch (error) {
      alert("Failed to submit request.");
    }
  };

  return (
    <div className="service-request-page">
      <div className="container">
        <h1>Request Service</h1>
        
        <div className="service-layout">
          <form onSubmit={handleSubmit} className="service-form card">
            <div className="form-group">
              <label className="form-label">Product/Order ID</label>
              <input type="text" className="form-input" value={formData.productId} onChange={(e) => setFormData({...formData, productId: e.target.value})} placeholder="Enter order or product ID" required />
            </div>
            <div className="form-group">
              <label className="form-label">Service Type</label>
              <select className="form-input" value={formData.serviceType} onChange={(e) => setFormData({...formData, serviceType: e.target.value})}>
                <option value="installation">Installation</option>
                <option value="repair">Repair</option>
                <option value="maintenance">Maintenance</option>
                <option value="replacement">Replacement</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-input" rows="5" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Describe the service you need..." required />
            </div>
            <div className="form-group">
              <label className="form-label">Preferred Date</label>
              <input type="date" className="form-input" value={formData.preferredDate} onChange={(e) => setFormData({...formData, preferredDate: e.target.value})} required />
            </div>
            <button type="submit" className="btn btn-primary">Submit Request</button>
            {submitted && <div className="success-message">✓ Service request submitted successfully!</div>}
          </form>

          <div className="service-info card">
            <h2>Service Information</h2>
            <div className="info-item">
              <span className="info-icon">⏱️</span>
              <div>
                <h3>Response Time</h3>
                <p>We respond within 24 hours</p>
              </div>
            </div>
            <div className="info-item">
              <span className="info-icon">🔧</span>
              <div>
                <h3>Expert Technicians</h3>
                <p>Certified professionals</p>
              </div>
            </div>
            <div className="info-item">
              <span className="info-icon">✓</span>
              <div>
                <h3>Quality Guarantee</h3>
                <p>100% satisfaction guaranteed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceRequest;
