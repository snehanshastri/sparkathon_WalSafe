// import React, { useState } from 'react';
// import { Search, Filter, Grid, List } from 'lucide-react';
// import Header from '../components/Header';
// import ProductCard from '../components/ProductCard';

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

//   const products: Product[] = [
//     {
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
//     <div className="min-h-screen bg-gray-50">
//       <Header showCart={true} />
      
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Hero Section */}
//         <div className="bg-walmart-blue rounded-lg p-6 mb-8 text-white">
//           <h1 className="text-3xl font-bold mb-2">Great Values, Every Day</h1>
//           <p className="text-blue-100">Discover amazing deals on everything you need</p>
//         </div>

//         {/* Search and Filters */}
//         <div className="bg-white rounded-lg shadow-md p-6 mb-8">
//           <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
//             <div className="flex-1 max-w-md">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
//                 <input
//                   type="text"
//                   placeholder="Search products..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-walmart-blue focus:border-transparent"
//                 />
//               </div>
//             </div>
            
//             <div className="flex items-center gap-4">
//               <div className="flex items-center gap-2">
//                 <Filter className="h-5 w-5 text-gray-600" />
//                 <select
//                   value={selectedCategory}
//                   onChange={(e) => setSelectedCategory(e.target.value)}
//                   className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-walmart-blue"
//                 >
//                   {categories.map(category => (
//                     <option key={category} value={category}>{category}</option>
//                   ))}
//                 </select>
//               </div>
              
//               <div className="flex border border-gray-300 rounded-lg overflow-hidden">
//                 <button
//                   onClick={() => setViewMode('grid')}
//                   className={`p-2 ${viewMode === 'grid' ? 'bg-walmart-blue text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
//                 >
//                   <Grid className="h-5 w-5" />
//                 </button>
//                 <button
//                   onClick={() => setViewMode('list')}
//                   className={`p-2 ${viewMode === 'list' ? 'bg-walmart-blue text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
//                 >
//                   <List className="h-5 w-5" />
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Results Info */}
//         <div className="mb-6">
//           <p className="text-gray-600">
//             Showing {filteredProducts.length} of {products.length} products
//             {selectedCategory !== 'All' && ` in ${selectedCategory}`}
//             {searchTerm && ` for "${searchTerm}"`}
//           </p>
//         </div>

//         {/* Products Grid */}
//         <div className={`grid gap-6 ${
//           viewMode === 'grid' 
//             ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
//             : 'grid-cols-1'
//         }`}>
//           {filteredProducts.map(product => (
//             <ProductCard key={product.id} product={product} />
//           ))}
//         </div>

//         {/* No Results */}
//         {filteredProducts.length === 0 && (
//           <div className="text-center py-12">
//             <p className="text-gray-500 text-lg mb-4">No products found</p>
//             <button
//               onClick={() => {
//                 setSearchTerm('');
//                 setSelectedCategory('All');
//               }}
//               className="text-walmart-blue hover:text-blue-700 font-medium"
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

import React, { useState } from 'react';
import { Search, Filter, Grid, List } from 'lucide-react';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';

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
