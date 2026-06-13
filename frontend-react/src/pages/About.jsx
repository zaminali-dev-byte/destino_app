import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <>
      {/* Page Banner */}
      <section className="page-banner-area pt-200 rpt-140 pb-100 rpb-60 rel z-1 bgs-cover text-center" style={{ backgroundImage: 'url(assets/images/backgrounds/banner.jpg)', backgroundColor: '#333' }}>
          <div className="container">
              <div className="banner-inner text-white">
                  <h1 className="page-title" style={{ color: 'white' }}>About Us</h1>
                  <nav aria-label="breadcrumb">
                      <ol className="breadcrumb justify-content-center">
                          <li className="breadcrumb-item"><Link to="/" style={{ color: '#ffb300' }}>Home</Link></li>
                          <li className="breadcrumb-item active" style={{ color: '#ddd' }}>About</li>
                      </ol>
                  </nav>
              </div>
          </div>
      </section>

      {/* About Section */}
      <section className="about-us-area py-100 rpb-90 rel z-1">
          <div className="container">
              <div className="row align-items-center">
                  <div className="col-xl-5 col-lg-6">
                      <div className="about-us-content rmb-55">
                          <div className="section-title mb-25">
                              <h2>Travel with Confidence: Why Choose Us as Your Guide</h2>
                          </div>
                          <p>Welcome to Destino, where your journey begins! We are extremely passionate about delivering world-class premium travel experiences tailored just for you. With over a decade of experience, we guarantee safety, luxury, and memories that will last a lifetime.</p>
                          <div className="divider counter-text-wrap mt-45 mb-55"><span>We have <span><span className="count-text" style={{ fontWeight: 'bold', color: '#ffb300' }}>10</span> Years</span> of experience</span></div>
                          <div className="row">
                              <div className="col-6">
                                  <div className="counter-item counter-text-wrap">
                                      <span className="count-text k-plus" style={{ fontSize: '30px', fontWeight: 'bold' }}>50+</span>
                                      <span className="counter-title d-block">Popular Destinations</span>
                                  </div>
                              </div>
                              <div className="col-6">
                                  <div className="counter-item counter-text-wrap">
                                      <span className="count-text m-plus" style={{ fontSize: '30px', fontWeight: 'bold' }}>10K+</span>
                                      <span className="counter-title d-block">Satisfied Clients</span>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
                  <div className="col-xl-7 col-lg-6">
                      <div className="about-us-image text-center">
                          <img src="/assets/images/about/about.png" alt="About" style={{ maxWidth: '100%', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
                      </div>
                  </div>
              </div>
          </div>
      </section>
    </>
  );
};

export default About;
