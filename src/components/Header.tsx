

import React from 'react';
import { ShoppingCart } from 'lucide-react';

interface HeaderProps {
  showCart?: boolean;
}

const Header: React.FC<HeaderProps> = ({ showCart = false }) => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <div className="logo-icon">
            <ShoppingCart size={24} color="#0071ce" />
          </div>
          <h1 className="logo-text">WalSafe</h1>
        </div>
        {showCart && (
          <div className="header-right">
            <button className="cart-button">
              <ShoppingCart size={24} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;


