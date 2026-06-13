import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Tours = () => {
    const { user } = useContext(AuthContext);
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userWishlist, setUserWishlist] = useState([]);

    useEffect(() => {
        const fetchTours = async () => {
            try {
                const res = await fetch('/api/tours');
                if (!res.ok) throw new Error('Failed to fetch tours');
                const data = await res.json();
                setTours(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };
        fetchTours();
    }, []);

    useEffect(() => {
        if (user && user._id) {
            fetch(`/api/users/${user._id}`)
                .then(res => res.json())
                .then(data => {
                    setUserWishlist(data.wishlistTours || []);
                });
        }
    }, [user]);

    const toggleWishlist = (e, tourId) => {
        e.preventDefault();
        e.stopPropagation();
        if (!user) {
            alert('Please login to save to your wishlist.');
            return;
        }
        fetch('/api/users/wishlist', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
            body: JSON.stringify({ itemId: tourId, itemType: 'Tour' })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                setUserWishlist(prev => data.isSaved ? [...prev, tourId] : prev.filter(id => id !== tourId));
            }
        });
    };

    const getScarcity = (id) => {
        if (!id) return { left: 2, booked: 10 };
        const num1 = parseInt(id.substring(0, 8) || '1', 16) || 1;
        const num2 = parseInt(id.substring(8, 16) || '1', 16) || 1;
        return { left: (num1 % 4) + 1, booked: (num2 % 30) + 5 };
    };

    if (loading) return (
        <div style={{ height: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <div className="spinner" style={{ width: '50px', height: '50px', border: '5px solid #f3f3f3', borderTop: '5px solid #ffb300', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            <h3 style={{ marginTop: '20px' }}>Loading Amazing Tours...</h3>
        </div>
    );
    
    if (error) return <div style={{ height: '50vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'red' }}><h2>Error: {error}</h2></div>;

    return (
        <>
            {/* Page Banner */}
            <section className="page-banner-area pt-200 rpt-140 pb-100 rpb-60 rel z-1 bgs-cover text-center" style={{ backgroundImage: 'url(assets/images/backgrounds/banner.jpg)', backgroundColor: '#333' }}>
                <div className="container">
                    <div className="banner-inner text-white">
                        <h1 className="page-title" data-aos="fade-up" data-aos-duration="1500" data-aos-offset="50" style={{ color: 'white' }}>Tour Packages</h1>
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb justify-content-center" data-aos="fade-up" data-aos-delay="50" data-aos-duration="1500" data-aos-offset="50">
                                <li className="breadcrumb-item"><Link to="/" style={{ color: '#ffb300' }}>Home</Link></li>
                                <li className="breadcrumb-item active" style={{ color: '#ddd' }}>Tours</li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </section>
            
            <section className="tour-list-area py-100 rel z-1">
                <div className="container">
                    <div className="section-title text-center mb-50">
                        <h2>Explore Our Handpicked Tours</h2>
                        <p>Discover the beauty of the world with our tailored experiences.</p>
                    </div>
                    
                    {tours.length === 0 ? (
                        <div className="text-center">
                            <h4>No tours available at the moment. Please check back later!</h4>
                        </div>
                    ) : (
                        <div className="row">
                            {tours.map(tour => {
                                const scarcity = getScarcity(tour._id);
                                const isSaved = userWishlist.includes(tour._id);
                                return (
                                <div key={tour._id} className="col-lg-4 col-md-6 mb-4">
                                    <div className="destination-item style-two" style={{ boxShadow: '0 4px 15px rgba(0,0,0,0.08)', borderRadius: '15px', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                                        <button onClick={(e) => toggleWishlist(e, tour._id)} style={{ position: 'absolute', top: '20px', left: '20px', background: 'rgba(255,255,255,0.9)', border: 'none', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10, boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}>
                                            <i className={isSaved ? "fas fa-heart" : "fal fa-heart"} style={{ color: isSaved ? '#ef4444' : '#555', fontSize: '18px' }}></i>
                                        </button>
                                        <div className="image" style={{ position: 'relative', overflow: 'hidden' }}>
                                            <Link to={`/tour-details/${tour._id}`} style={{ display: 'block' }}>
                                                <img src={tour.imageUrl || "assets/images/destinations/destination1.jpg"} alt={tour.title} style={{ width: '100%', height: '260px', objectFit: 'cover', transition: 'transform 0.3s ease' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'} />
                                            </Link>
                                            <span className="price" style={{ position: 'absolute', top: '20px', right: '20px', background: '#ffb300', padding: '8px 20px', borderRadius: '30px', color: '#fff', fontWeight: 'bold', fontSize: '18px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', pointerEvents: 'none' }}>
                                                ${tour.price}
                                            </span>
                                        </div>
                                        <div className="content" style={{ padding: '30px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                            <h4 style={{ fontSize: '24px', marginBottom: '15px' }}>{tour.title}</h4>
                                            <ul className="list-style-one mb-20" style={{ listStyle: 'none', padding: 0, color: '#666', fontSize: '15px', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
                                                <li><i className="far fa-clock" style={{ color: '#ffb300', marginRight: '5px' }}></i> {tour.duration}</li>
                                                <li><i className="far fa-tag" style={{ color: '#ffb300', marginRight: '5px' }}></i> {tour.category}</li>
                                            </ul>
                                            <p style={{ color: '#777', marginBottom: '10px', flexGrow: 1 }}>{tour.description.length > 100 ? tour.description.substring(0, 100) + '...' : tour.description}</p>
                                            <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                                <span style={{ fontSize: '12px', color: '#d91e18', fontWeight: 'bold' }}><i className="fas fa-fire-alt"></i> Only {scarcity.left} spots left!</span>
                                                <span style={{ fontSize: '12px', color: '#555', fontStyle: 'italic' }}>Booked {scarcity.booked} times today</span>
                                            </div>
                                            <Link to={`/book/${tour._id}`} className="theme-btn style-two w-100" style={{ textAlign: 'center', marginTop: 'auto' }}>
                                                <span data-hover="Book Now">Book Now</span>
                                                <i className="fal fa-arrow-right"></i>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
};

export default Tours;
