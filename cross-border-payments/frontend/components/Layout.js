import React from 'eact';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div className="container">
      <Navbar />
      <main>{children}</main>
    </div>
  );
};

export default Layout;