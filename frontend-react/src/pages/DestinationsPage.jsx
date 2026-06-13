import React from 'react';
import { Link } from 'react-router-dom';
import Destinations from '../components/Destinations';

const DestinationsPage = () => {
  return (
    <>
      {/* Page Banner */}
      <section className="page-banner-area pt-200 rpt-140 pb-100 rpb-60 rel z-1 bgs-cover text-center" style={{ backgroundImage: 'url(assets/images/backgrounds/banner.jpg)', backgroundColor: '#333' }}>
          <div className="container">
              <div className="banner-inner text-white">
                  <h1 className="page-title" style={{ color: 'white' }}>Our Destinations</h1>
                  <nav aria-label="breadcrumb">
                      <ol className="breadcrumb justify-content-center">
                          <li className="breadcrumb-item"><Link to="/" style={{ color: '#ffb300' }}>Home</Link></li>
                          <li className="breadcrumb-item active" style={{ color: '#ddd' }}>Destinations</li>
                      </ol>
                  </nav>
              </div>
          </div>
      </section>

      {/* Injecting the Existing Destinations Component */}
      <Destinations />
    </>
  );
};

export default DestinationsPage;
