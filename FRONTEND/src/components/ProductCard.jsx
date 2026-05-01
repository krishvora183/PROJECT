import React from 'react';
import './ProductCard.css';

const ProductCard = ({ product, onAddToCart, onViewDetails }) => {
  if (!product) return null;

  return (
    <div className="product-card card">
      <img src={product.image} alt={product.name} className="product-image" />
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">₹{product.price}</p>
        <div className="product-actions">
          <button onClick={() => onViewDetails(product)} className="btn btn-secondary">
            Details
          </button>
          <button onClick={() => onAddToCart(product)} className="btn btn-primary">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;