import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Hotels = () => {
    const [hotels, setHotels] = useState([]);

    useEffect(() => {
        fetch('/api/hotels')
            .then(res => res.json())
            .then(data => {
                setHotels(data.slice(0, 4)); // Only show top 4 on homepage
                setTimeout(() => window.AOS && window.AOS.refresh(), 100);
            })
            .catch(err => console.error("Error fetching hotels:", err));
    }, []);

    return (
        <section className="hotel-area bgc-black py-100 rel z-1">
            <div className="container-fluid">
                <div className="row justify-content-center">
                    <div className="col-lg-12">
                        <div className="section-title text-white text-center counter-text-wrap mb-70" data-aos="fade-up" data-aos-duration="1500" data-aos-offset="50">
                            <h2>Discover the Top Hotels in Pakistan</h2>
                            <p>One site <span className="count-text plus" data-speed="3000" data-stop="34500">0</span> most popular experience you’ll remember</p>
                        </div>
                    </div>
                </div>
                <div className="row justify-content-center">
                    {hotels.map((hotel, index) => (
                        <div className="col-xxl-6 col-xl-8 col-lg-10" key={hotel._id || index}>
                            <div className="destination-item style-three" data-aos="fade-up" data-aos-delay={hotel.delay} data-aos-duration="1500" data-aos-offset="50">
                                {hotel.imageRight ? (
                                    <>
                                        <div className="content">
                                            <span className="location"><i className="fal fa-map-marker-alt"></i> {hotel.location}</span>
                                            <h5><Link to={`/hotel-details/${hotel._id}`}>{hotel.name}</Link></h5>
                                            <ul className="list-style-one">
                                                <li><i className="fal fa-bed-alt"></i> {hotel.bedrooms} Beds</li>
                                                <li><i className="fal fa-bath"></i> {hotel.bathrooms} Baths</li>
                                                {hotel.amenities && String(hotel.amenities).toLowerCase().includes('pool') && (
                                                    <li><i className="fal fa-swimming-pool text-primary"></i> Pool</li>
                                                )}
                                                {hotel.amenities && (String(hotel.amenities).toLowerCase().includes('breakfast') || String(hotel.amenities).toLowerCase().includes('food')) && (
                                                    <li><i className="fal fa-utensils text-success"></i> Food Included</li>
                                                )}
                                            </ul>
                                            <div className="destination-footer">
                                                <span className="price"><span>{hotel.priceInfo}</span>/per night</span>
                                                <Link to={`/hotel-details/${hotel._id}`} className="read-more">Book Now <i className="fal fa-angle-right"></i></Link>
                                            </div>
                                        </div>
                                        <div className="image">
                                            <div className="ratting"><i className="fas fa-star"></i> {hotel.rating}</div>
                                            <a href="#" className="heart"><i className="fas fa-heart"></i></a>
                                            <Link to={`/hotel-details/${hotel._id}`}>
                                                <img src={hotel.image?.startsWith('http') ? hotel.image : `/${hotel.image}`} alt="Hotel" onError={e => e.target.src='/assets/images/destinations/destination1.jpg'} />
                                            </Link>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="image">
                                            <div className="ratting"><i className="fas fa-star"></i> {hotel.rating}</div>
                                            <a href="#" className="heart"><i className="fas fa-heart"></i></a>
                                            <Link to={`/hotel-details/${hotel._id}`}>
                                                <img src={hotel.image?.startsWith('http') ? hotel.image : `/${hotel.image}`} alt="Hotel" onError={e => e.target.src='/assets/images/destinations/destination1.jpg'} />
                                            </Link>
                                        </div>
                                        <div className="content">
                                            <span className="location"><i className="fal fa-map-marker-alt"></i> {hotel.location}</span>
                                            <h5><Link to={`/hotel-details/${hotel._id}`}>{hotel.name}</Link></h5>
                                            <ul className="list-style-one">
                                                <li><i className="fal fa-bed-alt"></i> {hotel.bedrooms} Beds</li>
                                                <li><i className="fal fa-bath"></i> {hotel.bathrooms} Baths</li>
                                                {hotel.amenities && String(hotel.amenities).toLowerCase().includes('pool') && (
                                                    <li><i className="fal fa-swimming-pool text-primary"></i> Pool</li>
                                                )}
                                                {hotel.amenities && (String(hotel.amenities).toLowerCase().includes('breakfast') || String(hotel.amenities).toLowerCase().includes('food')) && (
                                                    <li><i className="fal fa-utensils text-success"></i> Food Included</li>
                                                )}
                                            </ul>
                                            <div className="destination-footer">
                                                <span className="price"><span>{hotel.priceInfo}</span>/per night</span>
                                                <Link to={`/hotel-details/${hotel._id}`} className="read-more">Book Now <i className="fal fa-angle-right"></i></Link>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="hotel-more-btn text-center mt-40">
                    <Link to="/search" className="theme-btn style-four">
                        <span data-hover="Explore More Hotels">Explore More Hotels</span>
                        <i className="fal fa-arrow-right"></i>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Hotels;
