import React from 'eact';
import { Link } from 'eact-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/circles">Circles</Link>
        </li>
        <li>
          <Link to="/transactions">Transactions</Link>
        </li>
        <li>
          <Link to="/wallets">Wallets</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;