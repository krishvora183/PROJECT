import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ isAdmin, isLoggedIn, onLogout }) => {
  return (
    <nav className="navbar">
      <Link to="/">Home</Link>
      {isLoggedIn ? (
        <>
          {!isAdmin && <Link to="/customer/home">My Account</Link>}
          {isAdmin && <Link to="/admin/dashboard">Admin Dashboard</Link>}
          <button onClick={onLogout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/customer/login">Login</Link>
          <Link to="/customer/register">Register</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;
