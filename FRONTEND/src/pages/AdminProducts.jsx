import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Sidebar from '../components/Sidebar';
import './AdminDashboard.css';
import './AdminProducts.css';

const AdminProducts = () => {
  const sidebarItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/admin/products', label: 'Products', icon: '📦' },
    { path: '/admin/orders', label: 'Orders', icon: '🛒' },
    { path: '/admin/users', label: 'Users', icon: '👥' },
    { path: '/admin/services', label: 'Services', icon: '🔧' },
    { path: '/admin/complaints', label: 'Complaints', icon: '📝' },
    { path: '/admin/reports', label: 'Reports', icon: '📈' }
  ];

  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '', price: '', stock: '', category: '', barcode: '', description: '', image: ''
  });
  const [uploading, setUploading] = useState(false);

  const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};
  const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/api/products');
      setProducts(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const generateBarcode = () => {
    const prefix = 'SE';
    const cat = formData.category.substring(0, 3).toUpperCase() || 'PRD';
    const random = Math.floor(Math.random() * 900) + 100;
    const year = new Date().getFullYear();
    return `${prefix}-${cat}-${random}-${year}`;
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setFormData({ name: '', price: '', stock: '', category: '', barcode: '', description: '', image: '' });
    setShowModal(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      stock: product.countInStock,
      category: product.category,
      barcode: product.barcode || '',
      description: product.description || '',
      image: product.image || ''
    });
    setShowModal(true);
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formDataObj = new FormData();
    formDataObj.append('image', file);
    setUploading(true);
    try {
      const configUpload = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await api.post('/api/upload', formDataObj, configUpload);
      
      setFormData({ ...formData, image: data });
      setUploading(false);
    } catch (error) {
      alert('Error uploading file');
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/api/products/${id}`, config);
        fetchProducts();
      } catch (error) {
        alert('Error deleting product');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const payload = {
      name: formData.name,
      price: parseFloat(formData.price),
      countInStock: parseInt(formData.stock),
      category: formData.category,
      barcode: formData.barcode || generateBarcode(),
      description: formData.description || 'No description provided',
      image: formData.image || '/images/sample.jpg'
    };
    
    try {
      if (editingProduct) {
        await api.put(`/api/products/${editingProduct._id}`, payload, config);
      } else {
        const { data: newProd } = await api.post('/api/products', {}, config);
        await api.put(`/api/products/${newProd._id}`, payload, config);
      }
      setShowModal(false);
      fetchProducts();
    } catch (error) {
      alert('Error saving product');
    }
  };

  return (
    <div className="admin-layout">
      <Sidebar items={sidebarItems} />
      
      <div className="admin-content">
        <div className="admin-header">
          <h1>Product Management</h1>
          <button onClick={handleAdd} className="btn btn-primary">
            ➕ Add Product
          </button>
        </div>

        <div className="card">
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Category</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product._id}>
                    <td>
                      <img src={product.image} alt={product.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                    </td>
                    <td>{product.name}</td>
                    <td>₹{product.price}</td>
                    <td>{product.countInStock}</td>
                    <td>{product.category}</td>
                    <td>
                      <div className="action-buttons">
                        <button onClick={() => handleEdit(product)} className="btn-icon edit">
                          ✏️
                        </button>
                        <button onClick={() => handleDelete(product._id)} className="btn-icon delete">
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content card" onClick={(e) => e.stopPropagation()}>
              <h2>{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Product Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-input"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Lighting">Lighting</option>
                    <option value="Tools">Tools</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Appliances">Appliances</option>
                    <option value="Switches">Switches</option>
                    <option value="Wiring">Wiring</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-input"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-row" style={{ display: 'flex', gap: '15px' }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Price (₹)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-input"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Stock</label>
                    <input
                      type="number"
                      className="form-input"
                      value={formData.stock}
                      onChange={(e) => setFormData({...formData, stock: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Product Image</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <input
                      type="file"
                      className="form-input"
                      onChange={uploadFileHandler}
                      style={{padding: '8px', cursor: 'pointer', flex: 1}}
                      accept="image/*"
                    />
                    {formData.image && (
                      <img src={formData.image} alt="Preview" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                    )}
                  </div>
                  {uploading && <span style={{fontSize: '13px', color: '#4f46e5', marginTop: '5px', display: 'block', fontWeight: 'bold'}}>⏳ Uploading Image... Please wait</span>}
                </div>
                
                <div className="modal-actions">
                  <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={uploading}>
                    {editingProduct ? 'Update' : 'Add'} Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
