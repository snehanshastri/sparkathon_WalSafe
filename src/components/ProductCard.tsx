// import React from 'react';
// import { Star, Plus } from 'lucide-react';

// interface Product {
//   id: number;
//   name: string;
//   price: number;
//   originalPrice?: number;
//   rating: number;
//   reviewCount: number;
//   image: string;
//   badge?: string;
// }

// interface ProductCardProps {
//   product: Product;
// }

// const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
//   const savings = product.originalPrice ? product.originalPrice - product.price : 0;
//   const savingsPercentage = product.originalPrice 
//     ? Math.round((savings / product.originalPrice) * 100) 
//     : 0;

//   return (
//     <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden group">
//       <div className="relative overflow-hidden">
//         <img
//           src={product.image}
//           alt={product.name}
//           className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
//         />
//         {product.badge && (
//           <div className="absolute top-2 left-2 bg-walmart-yellow text-walmart-blue text-xs font-bold px-2 py-1 rounded">
//             {product.badge}
//           </div>
//         )}
//         {savingsPercentage > 0 && (
//           <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
//             -{savingsPercentage}%
//           </div>
//         )}
//       </div>
      
//       <div className="p-4">
//         <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem]">
//           {product.name}
//         </h3>
        
//         <div className="flex items-center mb-2">
//           <div className="flex items-center">
//             {[...Array(5)].map((_, i) => (
//               <Star
//                 key={i}
//                 className={`h-4 w-4 ${
//                   i < Math.floor(product.rating)
//                     ? 'text-walmart-yellow fill-current'
//                     : 'text-gray-300'
//                 }`}
//               />
//             ))}
//           </div>
//           <span className="text-sm text-gray-600 ml-2">({product.reviewCount})</span>
//         </div>
        
//         <div className="flex items-center justify-between mb-3">
//           <div className="flex items-center space-x-2">
//             <span className="text-lg font-bold text-gray-900">
//               ${product.price.toFixed(2)}
//             </span>
//             {product.originalPrice && (
//               <span className="text-sm text-gray-500 line-through">
//                 ${product.originalPrice.toFixed(2)}
//               </span>
//             )}
//           </div>
//           {savings > 0 && (
//             <span className="text-sm text-green-600 font-medium">
//               Save ${savings.toFixed(2)}
//             </span>
//           )}
//         </div>
        
//         <button className="w-full bg-walmart-blue text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center group">
//           <Plus className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
//           Add to Cart
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ProductCard;

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
