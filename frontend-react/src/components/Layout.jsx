import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
  const location = useLocation();
  const isAdminOrStaffRoute = location.pathname.startsWith('/admin') || location.pathname.startsWith('/staff');

  return (
    <div className="page-wrapper">
      {!isAdminOrStaffRoute && <Header />}
      {children}
      {!isAdminOrStaffRoute && <Footer />}
    </div>
  );
};

export default Layout;
