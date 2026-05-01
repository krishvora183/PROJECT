import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Complaints.css';

const Complaints = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('register');
  const [formData, setFormData] = useState({
    orderId: '',
    category: 'product',
    subject: '',
    description: ''
  });
  const [trackingId, setTrackingId] = useState('');
  const [complaints, setComplaints] = useState([]);

  const fetchComplaints = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (!userInfo) return;
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.get('/api/complaints/mycomplaints', config);
      setComplaints(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (activeTab === 'history') {
      fetchComplaints();
    }
  }, [activeTab]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (!userInfo) {
        alert("Please login first to submit a complaint");
        navigate('/customer/login');
        return;
      }
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      
      const { data } = await axios.post('/api/complaints', {
        relatedId: formData.orderId,
        description: `Subject: ${formData.subject}\nCategory: ${formData.category}\n\n${formData.description}`,
      }, config);
      
      alert(`Complaint registered successfully! ID: ${data._id}`);
      setFormData({ orderId: '', category: 'product', subject: '', description: '' });
    } catch (error) {
      alert("Failed to register complaint.");
    }
  };

  const handleTrack = async (e) => {
    e.preventDefault();
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (!userInfo) {
        alert("Please login first to track your complaint");
        return;
      }
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.get('/api/complaints/mycomplaints', config);
      const complaint = data.find(c => c._id === trackingId);
      if (complaint) {
        alert(`Status: ${complaint.status}\nIssue: ${complaint.description.substring(0,50)}...`);
      } else {
        alert('Complaint not found or does not belong to your account.');
      }
    } catch (err) {
       alert("Error tracking complaint.");
    }
  };

  return (
    <div className="complaints-page">
      <div className="container">
        <h1>Complaints</h1>

        <div className="tabs">
          <button className={`tab ${activeTab === 'register' ? 'active' : ''}`} onClick={() => setActiveTab('register')}>Register Complaint</button>
          <button className={`tab ${activeTab === 'track' ? 'active' : ''}`} onClick={() => setActiveTab('track')}>Track Complaint</button>
          <button className={`tab ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>Complaint History</button>
        </div>

        {activeTab === 'register' && (
          <form onSubmit={handleSubmit} className="complaint-form card">
            <div className="form-group">
              <label className="form-label">Order ID</label>
              <input type="text" className="form-input" value={formData.orderId} onChange={(e) => setFormData({...formData, orderId: e.target.value})} placeholder="Enter order ID" required />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-input" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                <option value="product">Product Issue</option>
                <option value="delivery">Delivery Issue</option>
                <option value="payment">Payment Issue</option>
                <option value="service">Service Issue</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Subject</label>
              <input type="text" className="form-input" value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} placeholder="Brief description of the issue" required />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-input" rows="5" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Provide detailed information about your complaint..." required />
            </div>
            <button type="submit" className="btn btn-primary">Submit Complaint</button>
          </form>
        )}

        {activeTab === 'track' && (
          <div className="track-section card">
            <form onSubmit={handleTrack} className="track-form">
              <div className="form-group">
                <label className="form-label">Complaint ID</label>
                <input type="text" className="form-input" value={trackingId} onChange={(e) => setTrackingId(e.target.value)} placeholder="Enter full complaint ID" required />
              </div>
              <button type="submit" className="btn btn-primary">Track Status</button>
            </form>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="complaints-list">
            {complaints.length === 0 ? <p>No complaints found.</p> : complaints.map(complaint => (
              <div key={complaint._id} className="complaint-item card">
                <div className="complaint-header">
                  <h3>{complaint.description.split('\n')[0].replace('Subject: ', '')}</h3>
                  <span className={`status-badge ${complaint.status.toLowerCase().replace(' ', '-')}`}>
                    {complaint.status}
                  </span>
                </div>
                <div className="complaint-meta">
                  <span>ID: {complaint._id}</span>
                  <span>Date: {new Date(complaint.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Complaints;
