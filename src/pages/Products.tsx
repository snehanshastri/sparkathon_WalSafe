

// import React, { useState, useEffect } from 'react';
// import { Search, Filter, Grid, List } from 'lucide-react';
// import Header from '../components/Header';
// import ProductCard from '../components/ProductCard';
// import axios from 'axios'; // 🆕 Import axios


// interface Product {
//   id: number;
//   name: string;
//   price: number;
//   originalPrice?: number;
//   rating: number;
//   reviewCount: number;
//   image: string;
//   badge?: string;
//   category: string;
// }

// const Products: React.FC = () => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('All');
//   const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

//   // 🆕 Behavior tracking state
//   const [mouseMoves, setMouseMoves] = useState<{ x: number; y: number; time: number }[]>([]);
//   const [clicks, setClicks] = useState<number[]>([]);

//   // 🆕 Capture behavior events
//   useEffect(() => {
//     const handleMouseMove = (e: MouseEvent) => {
//       setMouseMoves(prev => [...prev, { x: e.clientX, y: e.clientY, time: Date.now() }]);
//     };
//     const handleClick = () => {
//       setClicks(prev => [...prev, Date.now()]);
//     };

//     window.addEventListener('mousemove', handleMouseMove);
//     window.addEventListener('click', handleClick);

//     return () => {
//       window.removeEventListener('mousemove', handleMouseMove);
//       window.removeEventListener('click', handleClick);
//     };
//   }, []);

//   // 🆕 Send behavior data every 10 seconds
//   useEffect(() => {
//     const intervalId = setInterval(async () => {
//       if (mouseMoves.length === 0 && clicks.length === 0) return;

//       const email = localStorage.getItem('userEmail') || 'anonymous';

//       try {
//         await axios.post('http://localhost:5000/api/track', {
//           email,
//           behaviorData: { mouseMoves, clicks },
//           page: 'products',
//           timestamp: Date.now()
//         });

//         // Clear after sending
//         setMouseMoves([]);
//         setClicks([]);
//       } catch (err) {
//         console.error('Failed to send behavior data:', err);
//       }
//     }, 10000); // every 10 sec

//     return () => clearInterval(intervalId);
//   }, [mouseMoves, clicks]);

//   const products: Product[] = [
//     //... (your product array remains unchanged)
//         {
//       id: 1,
//       name: "Samsung 65\" 4K UHD Smart TV with HDR",
//       price: 497.99,
//       originalPrice: 699.99,
//       rating: 4.5,
//       reviewCount: 1247,
//       image: "https://images.pexels.com/photos/1444416/pexels-photo-1444416.jpeg?auto=compress&cs=tinysrgb&w=400",
//       badge: "Rollback",
//       category: "Electronics"
//     },
//     {
//       id: 2,
//       name: "Apple iPhone 15 Pro 128GB - Natural Titanium",
//       price: 999.99,
//       rating: 4.8,
//       reviewCount: 892,
//       image: "https://images.pexels.com/photos/887751/pexels-photo-887751.jpeg?auto=compress&cs=tinysrgb&w=400",
//       category: "Electronics"
//     },
//     {
//       id: 3,
//       name: "Nike Air Max 270 Running Shoes - Men's",
//       price: 89.99,
//       originalPrice: 130.00,
//       rating: 4.3,
//       reviewCount: 2156,
//       image: "https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?auto=compress&cs=tinysrgb&w=400",
//       badge: "Best Seller",
//       category: "Clothing"
//     },
//     {
//       id: 4,
//       name: "KitchenAid Stand Mixer 5-Qt Artisan Series",
//       price: 279.99,
//       originalPrice: 349.99,
//       rating: 4.7,
//       reviewCount: 845,
//       image: "https://images.pexels.com/photos/4226896/pexels-photo-4226896.jpeg?auto=compress&cs=tinysrgb&w=400",
//       category: "Home & Kitchen"
//     },
//     {
//       id: 5,
//       name: "Instant Pot Duo 7-in-1 Electric Pressure Cooker",
//       price: 79.95,
//       originalPrice: 119.99,
//       rating: 4.6,
//       reviewCount: 3421,
//       image: "https://images.pexels.com/photos/4198015/pexels-photo-4198015.jpeg?auto=compress&cs=tinysrgb&w=400",
//       badge: "Top Rated",
//       category: "Home & Kitchen"
//     },
//     {
//       id: 6,
//       name: "Levi's 501 Original Fit Jeans - Men's",
//       price: 49.99,
//       originalPrice: 69.99,
//       rating: 4.2,
//       reviewCount: 1567,
//       image: "https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=400",
//       category: "Clothing"
//     },
//     {
//       id: 7,
//       name: "HP Pavilion 15.6\" Laptop - Intel Core i5",
//       price: 449.99,
//       originalPrice: 599.99,
//       rating: 4.1,
//       reviewCount: 723,
//       image: "https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=400",
//       category: "Electronics"
//     },
//     {
//       id: 8,
//       name: "Ninja Foodi Personal Blender with 18oz Cup",
//       price: 39.99,
//       originalPrice: 59.99,
//       rating: 4.4,
//       reviewCount: 1891,
//       image: "https://images.pexels.com/photos/616401/pexels-photo-616401.jpeg?auto=compress&cs=tinysrgb&w=400",
//       badge: "Great Value",
//       category: "Home & Kitchen"
//     }
//   ];

//   const categories = ['All', 'Electronics', 'Clothing', 'Home & Kitchen'];

//   const filteredProducts = products.filter(product => {
//     const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
//     return matchesSearch && matchesCategory;
//   });

//   return (
//     <div className="products-page">
//       <Header showCart={true} />

//       <div className="products-container">
//         <div className="hero-section">
//           <h1>Great Values, Every Day</h1>
//           <p>Discover amazing deals on everything you need</p>
//         </div>

//         <div className="filters-section">
//           <div className="search-box">
//             <Search className="icon" />
//             <input
//               type="text"
//               placeholder="Search products..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>

//           <div className="filter-options">
//             <div className="category-filter">
//               <Filter className="icon" />
//               <select
//                 value={selectedCategory}
//                 onChange={(e) => setSelectedCategory(e.target.value)}
//               >
//                 {categories.map(category => (
//                   <option key={category} value={category}>{category}</option>
//                 ))}
//               </select>
//             </div>

//             <div className="view-toggle">
//               <button
//                 onClick={() => setViewMode('grid')}
//                 className={viewMode === 'grid' ? 'active' : ''}
//               >
//                 <Grid />
//               </button>
//               <button
//                 onClick={() => setViewMode('list')}
//                 className={viewMode === 'list' ? 'active' : ''}
//               >
//                 <List />
//               </button>
//             </div>
//           </div>
//         </div>

//         <div className="results-info">
//           <p>
//             Showing {filteredProducts.length} of {products.length} products
//             {selectedCategory !== 'All' && ` in ${selectedCategory}`}
//             {searchTerm && ` for "${searchTerm}"`}
//           </p>
//         </div>

//         <div className={`product-list ${viewMode}`}>
//           {filteredProducts.map(product => (
//             <ProductCard key={product.id} product={product} />
//           ))}
//         </div>

//         {filteredProducts.length === 0 && (
//           <div className="no-results">
//             <p>No products found</p>
//             <button
//               onClick={() => {
//                 setSearchTerm('');
//                 setSelectedCategory('All');
//               }}
//             >
//               Clear filters
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Products;
import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, Grid, List } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import axios from 'axios';
import { auth } from '../firebase'; // Make sure this is correctly exported
import { signOut } from 'firebase/auth';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  badge?: string;
  category: string;
}

const Products: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [mouseMoves, setMouseMoves] = useState<{ x: number; y: number; time: number }[]>([]);
  const [clicks, setClicks] = useState<number[]>([]);

  const trackingRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  // Mouse + click tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouseMoves(prev => [...prev, { x: e.clientX, y: e.clientY, time: Date.now() }]);
    };
    const handleClick = () => {
      setClicks(prev => [...prev, Date.now()]);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  // Send data every 10s
  useEffect(() => {
    trackingRef.current = setInterval(async () => {
      if (mouseMoves.length === 0 && clicks.length === 0) return;

      const email = localStorage.getItem('userEmail') || 'anonymous';

      try {
        await axios.post('http://localhost:5000/api/track', {
          email,
          behaviorData: { mouseMoves, clicks },
          page: 'products',
          timestamp: Date.now()
        });

        setMouseMoves([]);
        setClicks([]);
      } catch (err) {
        console.error('Failed to send behavior data:', err);
      }
    }, 10000);

    return () => {
      if (trackingRef.current) clearInterval(trackingRef.current);
    };
  }, [mouseMoves, clicks]);

  const handleSignOut = async () => {
    try {
      if (trackingRef.current) clearInterval(trackingRef.current);
      await signOut(auth);
      localStorage.removeItem('userEmail');
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const products: Product[] = [
    {
      id: 1,
      name: "Samsung 65\" 4K UHD Smart TV with HDR",
      price: 497.99,
      originalPrice: 699.99,
      rating: 4.5,
      reviewCount: 1247,
      image: "https://images.pexels.com/photos/1444416/pexels-photo-1444416.jpeg?auto=compress&cs=tinysrgb&w=400",
      badge: "Rollback",
      category: "Electronics"
    },
    {
      id: 2,
      name: "Apple iPhone 15 Pro 128GB - Natural Titanium",
      price: 999.99,
      rating: 4.8,
      reviewCount: 892,
      image: "https://images.pexels.com/photos/887751/pexels-photo-887751.jpeg?auto=compress&cs=tinysrgb&w=400",
      category: "Electronics"
    },
    {
      id: 3,
      name: "Nike Air Max 270 Running Shoes - Men's",
      price: 89.99,
      originalPrice: 130.00,
      rating: 4.3,
      reviewCount: 2156,
      image: "https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?auto=compress&cs=tinysrgb&w=400",
      badge: "Best Seller",
      category: "Clothing"
    },
    {
      id: 4,
      name: "KitchenAid Stand Mixer 5-Qt Artisan Series",
      price: 279.99,
      originalPrice: 349.99,
      rating: 4.7,
      reviewCount: 845,
      image: "https://images.pexels.com/photos/4226896/pexels-photo-4226896.jpeg?auto=compress&cs=tinysrgb&w=400",
      category: "Home & Kitchen"
    },
    {
      id: 5,
      name: "Instant Pot Duo 7-in-1 Electric Pressure Cooker",
      price: 79.95,
      originalPrice: 119.99,
      rating: 4.6,
      reviewCount: 3421,
      image: "https://images.pexels.com/photos/4198015/pexels-photo-4198015.jpeg?auto=compress&cs=tinysrgb&w=400",
      badge: "Top Rated",
      category: "Home & Kitchen"
    },
    {
      id: 6,
      name: "Levi's 501 Original Fit Jeans - Men's",
      price: 49.99,
      originalPrice: 69.99,
      rating: 4.2,
      reviewCount: 1567,
      image: "https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=400",
      category: "Clothing"
    },
    {
      id: 7,
      name: "HP Pavilion 15.6\" Laptop - Intel Core i5",
      price: 449.99,
      originalPrice: 599.99,
      rating: 4.1,
      reviewCount: 723,
      image: "https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=400",
      category: "Electronics"
    },
    {
      id: 8,
      name: "Ninja Foodi Personal Blender with 18oz Cup",
      price: 39.99,
      originalPrice: 59.99,
      rating: 4.4,
      reviewCount: 1891,
      image: "https://images.pexels.com/photos/616401/pexels-photo-616401.jpeg?auto=compress&cs=tinysrgb&w=400",
      badge: "Great Value",
      category: "Home & Kitchen"
    }
  ];

  const categories = ['All', 'Electronics', 'Clothing', 'Home & Kitchen'];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="products-page">
      <Header showCart={true} />

      <div className="products-container">
        {/* ✅ Sign Out Button */}
        <div style={{ textAlign: 'right', marginBottom: '10px' }}>
          <button
            onClick={handleSignOut}
            style={{
              padding: '8px 12px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Sign Out
          </button>
        </div>

        <div className="hero-section">
          <h1>Great Values, Every Day</h1>
          <p>Discover amazing deals on everything you need</p>
        </div>

        <div className="filters-section">
          <div className="search-box">
            <Search className="icon" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-options">
            <div className="category-filter">
              <Filter className="icon" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="view-toggle">
              <button
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? 'active' : ''}
              >
                <Grid />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? 'active' : ''}
              >
                <List />
              </button>
            </div>
          </div>
        </div>

        <div className="results-info">
          <p>
            Showing {filteredProducts.length} of {products.length} products
            {selectedCategory !== 'All' && ` in ${selectedCategory}`}
            {searchTerm && ` for "${searchTerm}"`}
          </p>
        </div>

        <div className={`product-list ${viewMode}`}>
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="no-results">
            <p>No products found</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
              }}
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
