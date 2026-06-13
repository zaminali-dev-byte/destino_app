import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import BookingWidget from '../components/BookingWidget';
import LocationMap from '../components/LocationMap';
import WeatherWidget from '../components/WeatherWidget';
import ReviewSection from '../components/ReviewSection';

const HotelDetails = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [hotel, setHotel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        fetch(`/api/hotels/${id}`)
            .then(res => res.json())
            .then(data => {
                setHotel(data);
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
                    if (userData.wishlistHotels && userData.wishlistHotels.includes(id)) {
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
            body: JSON.stringify({ itemId: id, itemType: 'Hotel' })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) setIsSaved(data.isSaved);
        });
    };

    if (loading) return <div className="text-center" style={{ padding: '150px 0' }}><div className="spinner-border" style={{ color: '#0071c2', width: '3rem', height: '3rem' }}></div></div>;
    if (!hotel) return <div className="text-center" style={{ padding: '150px 0' }}><h2>Property not found.</h2></div>;

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
                <div className="row mb-20 pt-50">
                    <div className="col-12" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <div style={{ display: 'flex', gap: '5px', color: '#febb02', fontSize: '14px', marginBottom: '5px' }}>
                                <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <h1 style={{ margin: '0 0 5px 0', fontSize: '32px', fontWeight: 'bold', color: '#333' }}>{hotel.name}</h1>
                                <button onClick={handleWishlist} style={{ background: 'none', border: 'none', fontSize: '24px', color: isSaved ? '#ef4444' : '#ccc', cursor: 'pointer', transition: 'color 0.2s' }}>
                                    <i className={isSaved ? "fas fa-heart" : "fal fa-heart"}></i>
                                </button>
                            </div>
                            <p style={{ color: '#0071c2', fontSize: '14px', margin: 0, marginBottom: '10px' }}><i className="fal fa-map-marker-alt"></i> {hotel.location} - Excellent location</p>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <a href={`https://api.whatsapp.com/send?text=Check out this amazing hotel: ${window.location.href}`} target="_blank" rel="noreferrer" style={{ background: '#25D366', color: 'white', padding: '6px 12px', borderRadius: '4px', fontSize: '13px', textDecoration: 'none' }}><i className="fab fa-whatsapp"></i> Share</a>
                                <a href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`} target="_blank" rel="noreferrer" style={{ background: '#1877F2', color: 'white', padding: '6px 12px', borderRadius: '4px', fontSize: '13px', textDecoration: 'none' }}><i className="fab fa-facebook"></i> Share</a>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right', display: 'flex', gap: '10px' }}>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#333' }}>Excellent</div>
                                <div style={{ fontSize: '13px', color: '#555' }}>read all 400 reviews</div>
                                <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                                    <span style={{ fontSize: '13px', color: '#d91e18', fontWeight: 'bold', background: '#fef2f2', padding: '4px 8px', borderRadius: '4px' }}><i className="fas fa-fire-alt"></i> Only {scarcity.left} rooms left!</span>
                                    <span style={{ fontSize: '12px', color: '#555', fontStyle: 'italic' }}>Booked {scarcity.booked} times today</span>
                                </div>
                            </div>
                            <div style={{ background: '#003580', color: '#fff', borderRadius: '8px 8px 8px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '50px', height: '50px', fontSize: '20px', fontWeight: 'bold' }}>9.5</div>
                        </div>
                    </div>
                </div>

                <div className="row mb-40">
                    <div className="col-lg-8" style={{ paddingRight: '10px' }}>
                        <img src={`/${hotel.image}`} alt={hotel.name} style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '8px 0 0 8px' }} onError={(e) => e.target.src="/assets/images/destinations/destination1.jpg"} />
                    </div>
                    <div className="col-lg-4" style={{ paddingLeft: '0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                         <img src="/assets/images/destinations/destination2.jpg" alt="Gallery" style={{ width: '100%', height: '195px', objectFit: 'cover', borderRadius: '0 8px 0 0' }} />
                         <img src="/assets/images/destinations/destination3.jpg" alt="Gallery" style={{ width: '100%', height: '195px', objectFit: 'cover', borderRadius: '0 0 8px 0' }} />
                    </div>
                </div>

                <div className="row">
                    <div className="col-lg-8">
                        <div style={{ background: '#fff', padding: '30px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '30px' }}>
                            <p style={{ fontSize: '16px', color: '#444', lineHeight: '1.8' }}>
                                You're eligible for a Genius discount at {hotel.name}! To save at this property, all you have to do is sign in.<br/><br/>
                                Situated perfectly in {hotel.location}, {hotel.name} features expansive, air-conditioned rooms with free WiFi, free private parking and room service. Offering a restaurant, the property also has a lush garden and terrace.
                            </p>
                            
                            <h4 style={{ fontSize: '18px', marginTop: '30px', marginBottom: '15px', fontWeight: 'bold' }}>Property Highlights</h4>
                            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '30px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f8f9fa', padding: '10px 15px', borderRadius: '8px', border: '1px solid #eee', flex: '1 1 min-content' }}>
                                    <i className="fal fa-bed" style={{ fontSize: '20px', color: '#0071c2' }}></i>
                                    <div>
                                        <div style={{ fontSize: '12px', color: '#777', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Bedrooms</div>
                                        <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{hotel.bedrooms || 1}</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f8f9fa', padding: '10px 15px', borderRadius: '8px', border: '1px solid #eee', flex: '1 1 min-content' }}>
                                    <i className="fal fa-bath" style={{ fontSize: '20px', color: '#0071c2' }}></i>
                                    <div>
                                        <div style={{ fontSize: '12px', color: '#777', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Bathrooms</div>
                                        <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{hotel.bathrooms || 1}</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f8f9fa', padding: '10px 15px', borderRadius: '8px', border: '1px solid #eee', flex: '1 1 min-content' }}>
                                    <i className="fal fa-utensils" style={{ fontSize: '20px', color: '#0071c2' }}></i>
                                    <div>
                                        <div style={{ fontSize: '12px', color: '#777', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Kitchens</div>
                                        <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{hotel.kitchens || 1}</div>
                                    </div>
                                </div>
                                {hotel.amenities && hotel.amenities.toLowerCase().includes('pool') && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#e0f2fe', padding: '10px 15px', borderRadius: '8px', border: '1px solid #bae6fd', flex: '1 1 min-content' }}>
                                        <i className="fal fa-swimmer" style={{ fontSize: '20px', color: '#0284c7' }}></i>
                                        <div>
                                            <div style={{ fontSize: '12px', color: '#0284c7', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Swimming Pool</div>
                                            <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#0369a1' }}>Available</div>
                                        </div>
                                    </div>
                                )}
                                {hotel.amenities && (hotel.amenities.toLowerCase().includes('breakfast') || hotel.amenities.toLowerCase().includes('food')) && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#dcfce7', padding: '10px 15px', borderRadius: '8px', border: '1px solid #bbf7d0', flex: '1 1 min-content' }}>
                                        <i className="fal fa-utensils-alt" style={{ fontSize: '20px', color: '#15803d' }}></i>
                                        <div>
                                            <div style={{ fontSize: '12px', color: '#15803d', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Dining</div>
                                            <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#166534' }}>Food Included</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            <h4 style={{ fontSize: '18px', marginTop: '10px', marginBottom: '15px', fontWeight: 'bold' }}>Most popular facilities</h4>
                            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', color: '#008234', fontWeight: 'bold', fontSize: '14px' }}>
                                {hotel.amenities.split(',').map((am, i) => (
                                    <span key={i}><i className="fal fa-check-circle" style={{ marginRight: '5px' }}></i> {am.trim()}</span>
                                ))}
                            </div>
                            
                            <h4 style={{ fontSize: '18px', marginTop: '30px', marginBottom: '15px', fontWeight: 'bold' }}>Location Map</h4>
                            <LocationMap title={hotel.name} lat={hotel.lat || 33.6844} lng={hotel.lng || 73.0479} />
                            
                            <WeatherWidget location={hotel.location || hotel.name.split(' ')[0]} />
                            <ReviewSection targetId={id} targetType="Hotel" />
                        </div>
                    </div>

                    <div className="col-lg-4">
                        <BookingWidget type="hotel" item={hotel} />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HotelDetails;
