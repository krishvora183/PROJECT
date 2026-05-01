import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './ProductDetails.css';

const ProductDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const product = location.state?.product || {
    id: 1,
    name: 'LED Smart Bulb',
    price: 299.99,
    description: 'WiFi enabled RGB LED bulb with voice control. Compatible with Alexa and Google Home. Energy efficient with 25,000 hours lifespan.',
    image: 'https://images.unsplash.com/photo-1550985616-10810253b84d?w=800&h=800&fit=crop',
    features: ['WiFi Enabled', 'RGB Color Control', 'Voice Control', 'Energy Efficient', '25,000 Hours Life'],
    barcode: 'SE-LED-001-2026',
    specifications: {
      'Power': '9W',
      'Voltage': '220-240V',
      'Color Temperature': '2700K-6500K',
      'Connectivity': 'WiFi 2.4GHz',
      'Lifespan': '25,000 hours',
      'Warranty': '2 years'
    }
  };

  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    alert(`Added ${quantity} ${product.name}(s) to cart!`);
    navigate('/customer/cart');
  };

  return (
    <div className="product-details">
      <div className="container">
        <button onClick={() => navigate(-1)} className="btn btn-outline back-btn">
          ← Back to Products
        </button>

        <div className="product-detail-grid">
          <div className="product-image-large">
            <img src={product.image} alt={product.name} />
          </div>

          <div className="product-detail-info">
            <h1>{product.name}</h1>
            {product.barcode && (
              <div className="product-barcode-large">
                <span className="barcode-icon">📊</span>
                <span className="barcode-text">{product.barcode}</span>
              </div>
            )}
            <div className="product-price-large">₹{product.price}</div>
            <p className="product-description-full">{product.description}</p>

            {product.features && (
              <div className="product-features">
                <h3>Features:</h3>
                <ul>
                  {product.features.map((feature, index) => (
                    <li key={index}>✓ {feature}</li>
                  ))}
                </ul>
              </div>
            )}

            {product.specifications && (
              <div className="product-specifications">
                <h3>Specifications:</h3>
                <div className="specs-table">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="spec-row">
                      <span className="spec-label">{key}:</span>
                      <span className="spec-value">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="quantity-selector">
              <label className="form-label">Quantity:</label>
              <div className="quantity-controls">
                <button
                  className="btn btn-outline"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </button>
                <span className="quantity-value">{quantity}</span>
                <button
                  className="btn btn-outline"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>

            <div className="product-actions-large">
              <button onClick={handleAddToCart} className="btn btn-primary">
                Add to Cart
              </button>
              <button className="btn btn-secondary">
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
