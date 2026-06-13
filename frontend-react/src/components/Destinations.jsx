import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Destinations = ({ query = '' }) => {
  const [destinations, setDestinations] = useState([]);

    useEffect(() => {
        fetch(`/api/destinations${query ? `?q=${query}` : ''}`)
            .then(res => res.json())
            .then(data => setDestinations(data))
            .catch(err => console.error("Error fetching destinations:", err));
    }, [query]);

  return (
    <section className="popular-destinations-area rel z-1">
        <div className="container-fluid">
            <div className="popular-destinations-wrap br-20 bgc-lighter pt-100 pb-70">
                <div className="row justify-content-center">
                    <div className="col-lg-12">
                        <div className="section-title text-center counter-text-wrap mb-70" data-aos="fade-up" data-aos-duration="1500" data-aos-offset="50">
                            <h2>Explore Popular Destinations</h2>
                            <p>One site <span className="count-text plus" data-speed="3000" data-stop="345">0</span> most popular experience</p>
                        </div>
                    </div>
                </div>
                <div className="container">
                    <div className="row justify-content-center">
                        {destinations.map((dest, i) => (
                            <div className={i === 2 || i === 3 ? "col-md-6" : "col-xl-3 col-md-6"} key={dest._id || i}>
                                <div className="destination-item style-two">
                                    <div className="image" style={{ overflow: 'hidden', borderRadius: '8px' }}>
                                        <Link to={`/search?q=${dest.name}`} className="heart" style={{ zIndex: 10 }}><i className="fas fa-heart"></i></Link>
                                        <Link to={`/search?q=${dest.name}`} style={{ display: 'block' }}>
                                            <img src={`/${dest.image}`} alt={dest.name} style={{ width: '100%', height: '350px', objectFit: 'cover', transition: 'transform 0.3s ease' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'} />
                                        </Link>
                                    </div>
                                    <div className="content">
                                        <h6><Link to={`/search?q=${dest.name}`}>{dest.name}</Link></h6>
                                        <span className="time">{dest.toursCount} properties & {dest.activityCount} Activities</span>
                                        <Link to={`/search?q=${dest.name}`} className="more"><i className="fas fa-chevron-right"></i></Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
};

export default Destinations;
