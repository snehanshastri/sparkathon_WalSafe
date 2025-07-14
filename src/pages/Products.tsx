

import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, Grid, List } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import axios from 'axios';
import { auth } from '../firebase';
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
  const [challengeQuestion, setChallengeQuestion] = useState('');
  const [challengeAnswer, setChallengeAnswer] = useState('');
  const [showChallenge, setShowChallenge] = useState(false);
  const [challengeError, setChallengeError] = useState('');
  const [challengeAttempts, setChallengeAttempts] = useState(0);
  const trackingRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

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

  useEffect(() => {
    trackingRef.current = setInterval(async () => {
      if (mouseMoves.length === 0 && clicks.length === 0) return;
      const email = localStorage.getItem('userEmail');
      if (!email) return;
      const behaviorData = { mouseMoves, clicks };
      const timestamp = Date.now();
      try {
        await axios.post('http://localhost:5000/api/track', {
          email,
          behaviorData,
          page: 'products',
          timestamp,
        });
        const mlResponse = await axios.post('http://localhost:5000/api/ml-score', {
          email,
          behaviorData,
          timestamp,
          sourcePage: 'products',
        });
        const { trustScore, actionTaken, explanation, challengeQuestion: question } = mlResponse.data;
        console.log(`[ML] Trust Score: ${trustScore}, Action: ${actionTaken}, Reason: ${explanation}`);
        if (actionTaken === 'blocked') {
          alert('⚠️ Suspicious behavior detected. You have been signed out for security reasons.');
          await signOut(auth);
          localStorage.removeItem('userEmail');
          navigate('/login');
        } else if (actionTaken === 'challenged') {
          setChallengeQuestion(question);
          setShowChallenge(true);
        }
        setMouseMoves([]);
        setClicks([]);
      } catch (err) {
        console.error('Behavior tracking or ML evaluation failed:', err);
      }
    }, 10000);
    return () => {
      if (trackingRef.current) clearInterval(trackingRef.current);
    };
  }, [mouseMoves, clicks, navigate]);

  const handleChallengeSubmit = async () => {
    try {
      const email = localStorage.getItem('userEmail');
      const res = await axios.post('http://localhost:5000/api/verify-challenge', {
        email,
        answer: challengeAnswer,
        page: 'products',
      });
      if (res.data.success) {
        setShowChallenge(false);
        setChallengeAttempts(0);
      } else {
        const attempts = challengeAttempts + 1;
        setChallengeAttempts(attempts);
        setChallengeError('Incorrect answer.');
        if (attempts >= 2) {
          alert('Challenge failed multiple times. You have been signed out for security reasons.');
          await signOut(auth);
          localStorage.removeItem('userEmail');
          navigate('/login');
        }
      }
    } catch {
      setChallengeError('Error verifying answer.');
    }
  };

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
        <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
          <button onClick={() => window.location.href = '/dashboard'} style={{ padding: '8px 16px', backgroundColor: '#2563eb', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>View Dashboard</button>
        </div>
        <div style={{ textAlign: 'right', marginBottom: '10px' }}>
          <button onClick={handleSignOut} style={{ padding: '8px 12px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Sign Out</button>
        </div>
        <div className="hero-section">
          <h1>Great Values, Every Day</h1>
          <p>Discover amazing deals on everything you need</p>
        </div>
        <div className="filters-section">
          <div className="search-box">
            <Search className="icon" />
            <input type="text" placeholder="Search products..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="filter-options">
            <div className="category-filter">
              <Filter className="icon" />
              <select aria-label='selected category' value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div className="view-toggle">
              <button aria-label='grid view' onClick={() => setViewMode('grid')} className={viewMode === 'grid' ? 'active' : ''}><Grid /></button>
              <button aria-label='list view' onClick={() => setViewMode('list')} className={viewMode === 'list' ? 'active' : ''}><List /></button>
            </div>
          </div>
        </div>

        <div className="results-info">
          <p>Showing {filteredProducts.length} of {products.length} products</p>
        </div>

        <div className={`product-list ${viewMode}`}>
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="no-results">
            <p>No products found</p>
            <button onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}>Clear filters</button>
          </div>
        )}
      </div>

      {showChallenge && (
        <div className="challenge-modal">
          <div className="modal-content">
            <h3>Security Challenge</h3>
            <p>{challengeQuestion}</p>
            <input type="text" value={challengeAnswer} onChange={(e) => setChallengeAnswer(e.target.value)} placeholder="Your answer" />
            <button onClick={handleChallengeSubmit}>Submit</button>
            {challengeError && <p className="error">{challengeError}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;