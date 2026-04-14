import React from 'react';
import { ShoppingCart, User, Search } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="navbar">
      {/* <div className="logo">QuickServe</div>
      <div className="search-bar">
        <input type="text" placeholder="Search for services..." />
        <Search size={18} />
      </div> */}
      <ul className="nav-links">
        <li>Home</li>
        <li>Services</li>
        <li>About</li>
        <li>Contact</li>
      </ul>
      <div className="nav-icons">
        <ShoppingCart size={22} />
        <User size={22} />
      </div>
    </nav>
  );
};

export default Navbar;