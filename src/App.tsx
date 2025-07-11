import React from 'react';
import { Link } from 'react-router-dom';

const App: React.FC = () => {
  return (
    <div className="p-6 text-center">
      <h1 className="text-3xl font-bold mb-4">Welcome to WalSafe 🛡️</h1>
      <p className="mb-4">Choose a path to explore the app:</p>
      <div className="space-x-4">
        <Link to="/login" className="text-blue-600 underline">Login</Link>
        <Link to="/dashboard" className="text-green-600 underline">Dashboard</Link>
        <Link to="/products" className="text-purple-600 underline">Products</Link>
      </div>
    </div>
  );
};

export default App;
