import React, { useEffect, useState } from 'react';

const Destinations = () => {
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/api/destinations')
      .then(res => res.json())
      .then(data => setDestinations(data))
      .catch(err => console.error("Error fetching destinations:", err));
  }, []);

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
                                <div className="destination-item style-two" data-aos="flip-up" data-aos-delay={i % 2 === 0 ? "0" : "100"} data-aos-duration="1500" data-aos-offset="50">
                                    <div className="image">
                                        <a href="#" className="heart"><i className="fas fa-heart"></i></a>
                                        <img src={dest.image} alt={dest.name} style={i === 3 ? { width: '600px', height: '350px' } : undefined} />
                                    </div>
                                    <div className="content">
                                        <h6><a href={dest.link}>{dest.name}</a></h6>
                                        <span className="time">{dest.toursCount}+ tours & {dest.activityCount}+ Activity</span>
                                        <a href="#" className="more"><i className="fas fa-chevron-right"></i></a>
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
