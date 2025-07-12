import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Products from './pages/Products';
import Dashboard from './pages/Dashboard';
import { ProtectedRoute } from './ProtectedRoute';
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/signup" replace />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/products" element={<Products />} />
          <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
      </div>
    </Router>
  );
}

export default App;