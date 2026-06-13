import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

import LocationMap from '../components/LocationMap';
import BookingWidget from '../components/BookingWidget';
import WeatherWidget from '../components/WeatherWidget';
import ReviewSection from '../components/ReviewSection';

const TourDetails = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [tour, setTour] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        fetch(`/api/tours/${id}`)
            .then(res => res.json())
            .then(data => {
                setTour(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
            
        if (user && user._id) {
            fetch(`/api/users/${user._id}`)
                .then(res => res.json())
                .then(userData => {
                    if (userData.wishlistTours && userData.wishlistTours.includes(id)) {
                        setIsSaved(true);
                    }
                });
        }
    }, [id, user]);

    const handleWishlist = () => {
        if (!user) {
            alert('Please login to save to your wishlist.');
            return;
        }
        fetch('/api/users/wishlist', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
            body: JSON.stringify({ itemId: id, itemType: 'Tour' })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) setIsSaved(data.isSaved);
        });
    };

    if (loading) return <div className="text-center" style={{ padding: '150px 0' }}><div className="spinner-border" style={{ color: '#0071c2', width: '3rem', height: '3rem' }}></div></div>;
    if (!tour) return <div className="text-center" style={{ padding: '150px 0' }}><h2>Property not found.</h2></div>;

    const getScarcity = (itemId) => {
        if (!itemId) return { left: 2, booked: 10 };
        const num1 = parseInt(itemId.substring(0, 8) || '1', 16) || 1;
        const num2 = parseInt(itemId.substring(8, 16) || '1', 16) || 1;
        return { left: (num1 % 4) + 1, booked: (num2 % 30) + 5 };
    };
    const scarcity = getScarcity(id);

    return (
        <section className="tour-details-area pt-150 pb-100 bgc-lighter" style={{ marginTop: '-100px' }}>
            <div className="container" style={{ maxWidth: '1100px' }}>
                {/* Header Title */}
                <div className="row mb-20 pt-50">
                    <div className="col-12" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <span style={{ background: '#0071c2', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', marginRight: '10px' }}>{tour.category}</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <h1 style={{ margin: '10px 0 5px 0', fontSize: '32px', fontWeight: 'bold', color: '#333' }}>{tour.title}</h1>
                                <button onClick={handleWishlist} style={{ background: 'none', border: 'none', fontSize: '24px', color: isSaved ? '#ef4444' : '#ccc', cursor: 'pointer', transition: 'color 0.2s' }}>
                                    <i className={isSaved ? "fas fa-heart" : "fal fa-heart"}></i>
                                </button>
                            </div>
                            <p style={{ color: '#0071c2', fontSize: '14px', margin: 0, marginBottom: '10px' }}><i className="fal fa-map-marker-alt"></i> {tour.location || 'Northern Pakistan'}</p>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <a href={`https://api.whatsapp.com/send?text=Check out this amazing tour: ${window.location.href}`} target="_blank" rel="noreferrer" style={{ background: '#25D366', color: 'white', padding: '6px 12px', borderRadius: '4px', fontSize: '13px', textDecoration: 'none' }}><i className="fab fa-whatsapp"></i> Share</a>
                                <a href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`} target="_blank" rel="noreferrer" style={{ background: '#1877F2', color: 'white', padding: '6px 12px', borderRadius: '4px', fontSize: '13px', textDecoration: 'none' }}><i className="fab fa-facebook"></i> Share</a>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#222' }}>US${tour.price}</div>
                            <div style={{ fontSize: '13px', color: '#555' }}>per person</div>
                            <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                                <span style={{ fontSize: '13px', color: '#d91e18', fontWeight: 'bold', background: '#fef2f2', padding: '4px 8px', borderRadius: '4px' }}><i className="fas fa-fire-alt"></i> Only {scarcity.left} spots left!</span>
                                <span style={{ fontSize: '12px', color: '#555', fontStyle: 'italic' }}>Booked {scarcity.booked} times today</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Hero Gallery Grid */}
                <div className="row mb-40">
                    <div className="col-lg-8" style={{ paddingRight: '10px' }}>
                        <img src={tour.imageUrl?.startsWith('http') ? tour.imageUrl : `/${tour.imageUrl}`} alt={tour.title} style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '8px 0 0 8px' }} onError={(e) => e.target.src="/assets/images/destinations/destination1.jpg"} />
                    </div>
                    <div className="col-lg-4" style={{ paddingLeft: '0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                         <img src="/assets/images/destinations/destination2.jpg" alt="Gallery" style={{ width: '100%', height: '195px', objectFit: 'cover', borderRadius: '0 8px 0 0' }} />
                         <img src="/assets/images/destinations/destination3.jpg" alt="Gallery" style={{ width: '100%', height: '195px', objectFit: 'cover', borderRadius: '0 0 8px 0' }} />
                    </div>
                </div>

                <div className="row">
                    {/* Main Description */}
                    <div className="col-lg-8">
                        <div className="tour-description-section" style={{ background: '#fff', padding: '30px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '30px' }}>
                            <h3 style={{ fontSize: '22px', borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '20px' }}>Overview</h3>
                            <p style={{ fontSize: '16px', color: '#444', lineHeight: '1.8' }}>{tour.description}</p>
                            
                            <h4 style={{ fontSize: '18px', marginTop: '30px', marginBottom: '15px' }}>What's Included</h4>
                            <ul style={{ listStyleType: 'none', padding: 0, columns: 2 }}>
                                <li style={{ marginBottom: '10px' }}><i className="fal fa-check text-success" style={{ marginRight: '10px' }}></i> Professional Guide</li>
                                <li style={{ marginBottom: '10px' }}><i className="fal fa-check text-success" style={{ marginRight: '10px' }}></i> All Meals</li>
                                <li style={{ marginBottom: '10px' }}><i className="fal fa-check text-success" style={{ marginRight: '10px' }}></i> Transport</li>
                                <li style={{ marginBottom: '10px' }}><i className="fal fa-check text-success" style={{ marginRight: '10px' }}></i> Hotel Accommodation</li>
                            </ul>

                            <h4 style={{ fontSize: '18px', marginTop: '30px', marginBottom: '15px' }}>Location Map</h4>
                            <LocationMap title={tour.title} lat={tour.lat || 33.6844} lng={tour.lng || 73.0479} />
                            
                            <WeatherWidget location={tour.location || tour.title.split(' ')[0]} />

                            {/* FAQs */}
                            <div style={{ marginTop: '40px' }}>
                                <h4 style={{ fontSize: '18px', marginBottom: '15px' }}>Frequently Asked Questions</h4>
                                <div style={{ border: '1px solid #eee', borderRadius: '8px' }}>
                                    <details style={{ padding: '15px', borderBottom: '1px solid #eee', cursor: 'pointer' }}>
                                        <summary style={{ fontWeight: '600' }}>What should I pack?</summary>
                                        <p style={{ marginTop: '10px', color: '#555', fontSize: '14px' }}>Comfortable walking shoes, weather-appropriate clothing, and a good camera!</p>
                                    </details>
                                    <details style={{ padding: '15px', borderBottom: '1px solid #eee', cursor: 'pointer' }}>
                                        <summary style={{ fontWeight: '600' }}>Is food included?</summary>
                                        <p style={{ marginTop: '10px', color: '#555', fontSize: '14px' }}>Yes, all meals are included as per the itinerary.</p>
                                    </details>
                                    <details style={{ padding: '15px', cursor: 'pointer' }}>
                                        <summary style={{ fontWeight: '600' }}>What is the cancellation policy?</summary>
                                        <p style={{ marginTop: '10px', color: '#555', fontSize: '14px' }}>Free cancellation up to 48 hours before the tour starts.</p>
                                    </details>
                                </div>
                            </div>

                            <ReviewSection targetId={id} targetType="Tour" />
                        </div>
                    </div>

                    {/* Right Sticky Booking Box */}
                    <div className="col-lg-4">
                        <BookingWidget type="tour" item={tour} />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TourDetails;
