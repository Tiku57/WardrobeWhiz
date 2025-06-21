import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // We'll create this CSS file next

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/">WardrobeWhiz</Link>
            </div>
            <ul className="navbar-nav">
                <li className="nav-item">
                    <Link to="/add-item" className="nav-link">Add Item</Link>
                </li>
                <li className="nav-item">
                    <Link to="/view-items" className="nav-link">View Items</Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;