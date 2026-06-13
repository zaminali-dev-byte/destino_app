import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '20px' }}>
      <h1 style={{ fontSize: '5rem', fontWeight: 'bold', color: '#333' }}>404</h1>
      <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>Page Not Found</h2>
      <p style={{ fontSize: '1.2rem', color: '#666', maxWidth: '600px', marginBottom: '40px' }}>
        The page you are looking for does not exist or has not been built yet. Let's get you back on track!
      </p>
      <Link to="/" className="theme-btn style-two">
        <span data-hover="Return to Homepage">Return to Homepage</span>
        <i className="fal fa-arrow-right"></i>
      </Link>
    </div>
  );
};

export default NotFound;
