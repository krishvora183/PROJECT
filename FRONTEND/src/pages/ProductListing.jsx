import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import './ProductListing.css';

const ProductListing = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/api/products');
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products', error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'all' || product.category === category;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (product) => {
    addToCart(product);
    alert(`${product.name} added to cart!`);
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  if (loading) return <div className="product-listing container"><h2>Loading products...</h2></div>;

  return (
    <div className="product-listing">
      <div className="container">
        <h1>Browse Products</h1>
        
        <div className="filters-section">
          <input
            type="text"
            className="form-input search-input"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <select
            className="form-input category-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="Lighting">Lighting</option>
            <option value="Tools">Tools</option>
            <option value="Accessories">Accessories</option>
            <option value="Appliances">Appliances</option>
            <option value="Switches">Switches</option>
            <option value="Wiring">Wiring</option>
          </select>
        </div>

        <div className="products-grid">
          {filteredProducts.map(product => (
            <ProductCard
              key={product._id}
              product={{...product, id: product._id}}
              onAddToCart={handleAddToCart}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="no-products">
            <p>No products found matching your criteria</p>
          </div>
        )}

        {selectedProduct && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content card product-info-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Product Information</h2>
                <button onClick={closeModal} className="close-btn">✕</button>
              </div>
              
              <div className="product-modal-content">
                <div className="product-modal-image">
                  <img src={selectedProduct.image || 'https://images.unsplash.com/photo-1550985616-10810253b84d?w=500&h=500&fit=crop'} alt={selectedProduct.name} />
                </div>
                
                <div className="product-modal-info">
                  <h3>{selectedProduct.name}</h3>
                  <div className="product-barcode-modal">
                    <span className="barcode-icon">📊</span>
                    <span className="barcode-text">{selectedProduct.barcode || 'N/A'}</span>
                  </div>
                  <div className="product-price-modal">₹{selectedProduct.price}</div>
                  <p className="product-description-modal">{selectedProduct.description}</p>
                  
                  <div className="product-specifications">
                    <h4>Specifications</h4>
                    <div className="specs-grid">
                      {selectedProduct.specifications ? Object.entries(selectedProduct.specifications).map(([key, value]) => (
                        <div key={key} className="spec-item">
                          <span className="spec-label">{key}:</span>
                          <span className="spec-value">{value}</span>
                        </div>
                      )) : <p>No specifications listed.</p>}
                    </div>
                  </div>
                  
                  <div className="product-features-modal">
                    <h4>Key Features</h4>
                    <ul className="features-list">
                      {selectedProduct.features ? selectedProduct.features.map((feature, index) => (
                        <li key={index}>✓ {feature}</li>
                      )) : <li>Standard Product</li>}
                    </ul>
                  </div>
                  
                  <div className="modal-actions">
                    <button onClick={() => handleAddToCart(selectedProduct)} className="btn btn-primary">
                      Add to Cart
                    </button>
                    <button onClick={() => navigate(`/customer/products/${selectedProduct._id}`, { state: { product: selectedProduct } })} className="btn btn-secondary">
                      View Full Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductListing;
