

import React from 'react';
import { Star, Plus } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  badge?: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const savings = product.originalPrice ? product.originalPrice - product.price : 0;
  const savingsPercentage = product.originalPrice 
    ? Math.round((savings / product.originalPrice) * 100) 
    : 0;

  return (
    <div className="product-card">
      <div className="image-wrapper">
        <img
          src={product.image}
          alt={product.name}
          className="product-image"
        />
        {product.badge && (
          <div className="badge">{product.badge}</div>
        )}
        {savingsPercentage > 0 && (
          <div className="discount">-{savingsPercentage}%</div>
        )}
      </div>
      
      <div className="product-content">
        <h3 className="product-title">{product.name}</h3>

        <div className="rating-row">
          <div className="stars">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`star-icon ${i < Math.floor(product.rating) ? 'filled' : ''}`}
              />
            ))}
          </div>
          <span className="review-count">({product.reviewCount})</span>
        </div>

        <div className="price-row">
          <div className="price-details">
            <span className="current-price">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="original-price">${product.originalPrice.toFixed(2)}</span>
            )}
          </div>
          {savings > 0 && (
            <span className="savings">Save ${savings.toFixed(2)}</span>
          )}
        </div>

        <button className="add-to-cart-btn">
          <Plus className="plus-icon" />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
