import React, { useState, useEffect, useContext } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png'
});

const SearchResults = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialQuery = queryParams.get('q') || '';
    const dateQuery = queryParams.get('date') || '';
    const guestsQuery = queryParams.get('guests') || '1';

    const { user } = useContext(AuthContext);
    const [allProperties, setAllProperties] = useState([]);
    const [filteredProperties, setFilteredProperties] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedKinds, setSelectedKinds] = useState([]);
    const [priceFilter, setPriceFilter] = useState('');
    const [starFilter, setStarFilter] = useState(0);
    const [viewMode, setViewMode] = useState('list');
    const [userWishlist, setUserWishlist] = useState({ tours: [], hotels: [] });

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const [resTours, resHotels] = await Promise.all([
                    fetch('/api/tours'),
                    fetch('/api/hotels')
                ]);
                const tours = await resTours.json();
                const hotels = await resHotels.json();
                
                const toursMap = tours.map(t => ({ ...t, kind: 'Travel Package', displayId: t._id, img: t.imageUrl, title: t.title, price: t.price || 0, desc: t.description, categoryLabel: t.location || t.category, routeTarget: `/search` })); // Fallback if tour details not built
                const hotelsMap = hotels.map(h => ({ ...h, kind: 'Hotel', displayId: h._id, img: h.image, title: h.name, price: parseInt(String(h.priceInfo || '0').replace(/[^0-9]/g, '')) || 0, desc: h.amenities, categoryLabel: h.location, routeTarget: `/hotel-details/${h._id}` }));
                
                // Wait actually tour-details is built! Let's map it.
                toursMap.forEach(t => t.routeTarget = `/tour-details/${t._id}`);

                setAllProperties([...toursMap, ...hotelsMap]);
                setLoading(false);
            } catch(err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchResults();
    }, []);

    useEffect(() => {
        let results = [...allProperties];

        if (initialQuery) {
            const queryLower = initialQuery.toLowerCase();
            results = results.filter(t => 
                (t.title || '').toLowerCase().includes(queryLower) || 
                (t.desc || '').toLowerCase().includes(queryLower) ||
                (t.categoryLabel || '').toLowerCase().includes(queryLower) ||
                queryLower.includes((t.categoryLabel || '').toLowerCase())
            );
        }

        if (selectedKinds.length > 0) {
            results = results.filter(t => selectedKinds.includes(t.kind));
        }

        if (priceFilter === 'low') results = results.filter(t => t.price < 200);
        if (priceFilter === 'medium') results = results.filter(t => t.price >= 200 && t.price <= 500);
        if (priceFilter === 'high') results = results.filter(t => t.price > 500);

        if (starFilter > 0) {
            results = results.filter(t => (t.rating || 4) >= starFilter);
        }

        setFilteredProperties(results);
    }, [allProperties, initialQuery, selectedKinds, priceFilter, starFilter]);

    useEffect(() => {
        if (user && user._id) {
            fetch(`/api/users/${user._id}`)
                .then(res => res.json())
                .then(data => {
                    setUserWishlist({
                        tours: data.wishlistTours || [],
                        hotels: data.wishlistHotels || []
                    });
                });
        }
    }, [user]);

    const toggleWishlist = (e, item) => {
        e.preventDefault();
        e.stopPropagation();
        if (!user) {
            alert('Please login to save to your wishlist.');
            return;
        }
        const itemType = item.kind === 'Hotel' ? 'Hotel' : 'Tour';
        fetch('/api/users/wishlist', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
            body: JSON.stringify({ itemId: item.displayId, itemType })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                if (itemType === 'Hotel') {
                    setUserWishlist(prev => ({ ...prev, hotels: data.isSaved ? [...prev.hotels, item.displayId] : prev.hotels.filter(id => id !== item.displayId) }));
                } else {
                    setUserWishlist(prev => ({ ...prev, tours: data.isSaved ? [...prev.tours, item.displayId] : prev.tours.filter(id => id !== item.displayId) }));
                }
            }
        });
    };

    const getScarcity = (id) => {
        if (!id) return { left: 2, booked: 10 };
        const num1 = parseInt(id.substring(0, 8) || '1', 16) || 1;
        const num2 = parseInt(id.substring(8, 16) || '1', 16) || 1;
        return {
            left: (num1 % 4) + 1,
            booked: (num2 % 30) + 5
        };
    };

    const handleKindChange = (e) => {
        const val = e.target.value;
        if (e.target.checked) setSelectedKinds([...selectedKinds, val]);
        else setSelectedKinds(selectedKinds.filter(c => c !== val));
    };

    const getMiniWeather = (loc) => {
        const temps = [22, 28, 32, 15, 10, 5, 25, 30];
        const icons = ['fa-sun text-warning', 'fa-cloud-sun text-secondary', 'fa-cloud-rain text-primary', 'fa-moon text-dark'];
        let hash = 0;
        for (let i = 0; i < (loc || '').length; i++) hash += loc.charCodeAt(i);
        return { temp: temps[hash % temps.length], icon: icons[hash % icons.length] };
    };

    if (loading) return <div className="text-center" style={{ padding: '150px 0' }}><div className="spinner-border" style={{ color: '#0071c2', width: '3rem', height: '3rem' }}></div><h3 style={{ marginTop: '20px' }}>Searching 500+ properties...</h3></div>;

    return (
        <section className="search-results-area pt-150 pb-100 bgc-lighter" style={{ minHeight: '80vh', marginTop: '-100px' }}>
            <div className="container" style={{ maxWidth: '1300px' }}>
                <div className="row mb-30 pt-50 text-start align-items-center">
                    <div className="col-md-8">
                        <h2 style={{ fontSize: '28px' }}>{initialQuery ? `Properties in ${initialQuery}: ` : ''}{filteredProperties.length} matches found</h2>
                        <p style={{ color: '#555' }}>For {guestsQuery} guests • {dateQuery ? `Dates: ${dateQuery}` : 'Any dates'}</p>
                    </div>
                    <div className="col-md-4 text-md-end mt-3 mt-md-0">
                        <div className="btn-group" role="group" style={{ background: '#fff', padding: '5px', borderRadius: '8px', border: '1px solid #ddd' }}>
                            <button type="button" className="btn" style={{ background: viewMode === 'list' ? '#0071c2' : 'transparent', color: viewMode === 'list' ? '#fff' : '#333', fontWeight: 'bold', borderRadius: '6px' }} onClick={() => setViewMode('list')}><i className="fas fa-list"></i> List View</button>
                            <button type="button" className="btn" style={{ background: viewMode === 'map' ? '#0071c2' : 'transparent', color: viewMode === 'map' ? '#fff' : '#333', fontWeight: 'bold', borderRadius: '6px' }} onClick={() => setViewMode('map')}><i className="fas fa-map-marked-alt"></i> Map View</button>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-lg-3">
                        <div className="filter-sidebar" style={{ background: '#fff', padding: '25px', borderRadius: '10px', border: '1px solid #ddd' }}>
                            <h4 style={{ fontSize: '18px', borderBottom: '1px solid #ddd', paddingBottom: '10px', marginBottom: '15px' }}>Filter by:</h4>
                            
                            <div className="filter-group mb-30">
                                <h6 style={{ fontWeight: 'bold', marginBottom: '15px' }}>Property Type</h6>
                                {['Hotel', 'Travel Package'].map(cat => (
                                    <div className="form-check" key={cat} style={{ marginBottom: '10px' }}>
                                        <input className="form-check-input" type="checkbox" value={cat} id={`cat-${cat}`} onChange={handleKindChange} />
                                        <label className="form-check-label" htmlFor={`cat-${cat}`} style={{ color: '#555', cursor: 'pointer' }}>{cat}</label>
                                    </div>
                                ))}
                            </div>

                            <div className="filter-group">
                                <h6 style={{ fontWeight: 'bold', marginBottom: '15px' }}>Your Budget</h6>
                                <div className="form-check" style={{ marginBottom: '10px' }}>
                                    <input className="form-check-input" type="radio" name="price" id="p1" value="low" onChange={(e) => setPriceFilter(e.target.value)} />
                                    <label className="form-check-label" htmlFor="p1" style={{ color: '#555', cursor: 'pointer' }}>Less than US$200</label>
                                </div>
                                <div className="form-check" style={{ marginBottom: '10px' }}>
                                    <input className="form-check-input" type="radio" name="price" id="p2" value="medium" onChange={(e) => setPriceFilter(e.target.value)} />
                                    <label className="form-check-label" htmlFor="p2" style={{ color: '#555', cursor: 'pointer' }}>US$200 - US$500</label>
                                </div>
                                <div className="form-check" style={{ marginBottom: '10px' }}>
                                    <input className="form-check-input" type="radio" name="price" id="p3" value="high" onChange={(e) => setPriceFilter(e.target.value)} />
                                    <label className="form-check-label" htmlFor="p3" style={{ color: '#555', cursor: 'pointer' }}>Above US$500</label>
                                </div>
                                <div className="form-check" style={{ marginBottom: '10px' }}>
                                    <input className="form-check-input" type="radio" name="price" id="pall" value="" onChange={(e) => setPriceFilter('')} defaultChecked />
                                    <label className="form-check-label" htmlFor="pall" style={{ color: '#555', cursor: 'pointer' }}>Any Price</label>
                                </div>
                            </div>

                            <div className="filter-group">
                                <h6 style={{ fontWeight: 'bold', marginBottom: '15px' }}>Star Rating</h6>
                                {[5, 4, 3].map(star => (
                                    <div className="form-check" key={star} style={{ marginBottom: '10px' }}>
                                        <input className="form-check-input" type="radio" name="star" id={`star-${star}`} value={star} onChange={(e) => setStarFilter(Number(e.target.value))} checked={starFilter === star} />
                                        <label className="form-check-label" htmlFor={`star-${star}`} style={{ color: '#555', cursor: 'pointer' }}>
                                            {Array(star).fill(0).map((_, i) => <i key={i} className="fas fa-star text-warning" style={{ fontSize: '12px' }}></i>)} & Up
                                        </label>
                                    </div>
                                ))}
                                <div className="form-check" style={{ marginBottom: '10px' }}>
                                    <input className="form-check-input" type="radio" name="star" id="star-all" value={0} onChange={() => setStarFilter(0)} checked={starFilter === 0} />
                                    <label className="form-check-label" htmlFor="star-all" style={{ color: '#555', cursor: 'pointer' }}>Any Rating</label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-9">
                        {filteredProperties.length === 0 ? (
                            <div style={{ background: '#fff', padding: '50px', borderRadius: '10px', textAlign: 'center', border: '1px solid #ddd' }}>
                                <h4>No properties found matching your criteria.</h4>
                                <p>Try adjusting your search or clearing filters.</p>
                            </div>
                        ) : (
                            <div>
                                {filteredProperties.map((item) => {
                                    const scarcity = getScarcity(item.displayId);
                                    const isSaved = item.kind === 'Hotel' ? userWishlist.hotels.includes(item.displayId) : userWishlist.tours.includes(item.displayId);
                                    return (
                                    <div key={`${item.kind}-${item.displayId}`} className="result-card d-flex" style={{ background: '#fff', borderRadius: '10px', border: '1px solid #ccc', marginBottom: '20px', overflow: 'hidden', padding: '15px', gap: '20px', transition: 'box-shadow 0.3s', position: 'relative' }} onMouseOver={e => e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)'} onMouseOut={e => e.currentTarget.style.boxShadow = 'none'}>
                                        <button onClick={(e) => toggleWishlist(e, item)} style={{ position: 'absolute', top: '25px', right: '25px', background: 'rgba(255,255,255,0.9)', border: 'none', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10, boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}>
                                            <i className={isSaved ? "fas fa-heart" : "fal fa-heart"} style={{ color: isSaved ? '#ef4444' : '#555', fontSize: '18px' }}></i>
                                        </button>
                                        <div className="img-wrap" style={{ flex: '0 0 250px', height: '220px', borderRadius: '8px', overflow: 'hidden' }}>
                                            <Link to={`${item.routeTarget}?date=${dateQuery}&guests=${guestsQuery}`} style={{ display: 'block', height: '100%' }}>
                                                <img src={item.img?.startsWith('http') ? item.img : `/${item.img}`} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'} onError={(e) => e.target.src="/assets/images/destinations/destination1.jpg"} />
                                            </Link>
                                        </div>
                                        <div className="content-wrap" style={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                                        <span style={{ fontSize: '11px', background: item.kind === 'Hotel' ? '#e1f4e5' : '#fdf2d2', color: item.kind === 'Hotel' ? '#008234' : '#b27b00', padding: '3px 8px', borderRadius: '4px', fontWeight: 'bold', textTransform: 'uppercase' }}>{item.kind}</span>
                                                        <div style={{ color: '#febb02', fontSize: '12px' }}>
                                                            <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i>{item.rating && item.rating > 3 && <><i className="fas fa-star"></i><i className="fas fa-star"></i></>}
                                                        </div>
                                                    </div>
                                                    <h3 style={{ fontSize: '22px', color: '#0071c2', margin: '0 0 2px 0', fontWeight: 'bold' }}>{item.title}</h3>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                        <span style={{ fontSize: '12px', color: '#0071c2', textDecoration: 'underline', cursor: 'pointer' }}><i className="fal fa-map-marker-alt"></i> {item.categoryLabel} - Show on map</span>
                                                        <span style={{ fontSize: '12px', color: '#555', background: '#f5f5f5', padding: '2px 8px', borderRadius: '12px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                                                            <i className={`fas ${getMiniWeather(item.categoryLabel).icon}`}></i> {getMiniWeather(item.categoryLabel).temp}°C
                                                        </span>
                                                    </div>
                                                </div>
                                                <div style={{ textAlign: 'right', display: 'flex', gap: '10px', alignItems: 'center' }}>
                                                    <div style={{ textAlign: 'right' }}>
                                                        <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#333' }}>Excellent</div>
                                                        <div style={{ fontSize: '12px', color: '#777' }}>{Math.floor(Math.random()*500)+50} reviews</div>
                                                    </div>
                                                    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#003580', color: '#fff', width: '35px', height: '35px', borderRadius: '6px', fontWeight: 'bold', fontSize: '16px' }}>9.5</div>
                                                </div>
                                            </div>
                                            <div style={{ margin: '15px 0', display: 'flex', flexDirection: 'column', gap: '5px', flex: '1' }}>
                                                <p style={{ margin: 0, fontSize: '13px', fontWeight: 'bold', color: '#333' }}>Recommended for your group</p>
                                                <p style={{ margin: 0, fontSize: '13px', color: '#008234', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '350px' }}>{item.desc}</p>
                                                <p style={{ margin: 0, fontSize: '12px', color: '#d91e18', fontWeight: 'bold' }}><i className="fas fa-fire-alt"></i> Only {scarcity.left} spots left at this price!</p>
                                                <p style={{ margin: 0, fontSize: '12px', color: '#555', fontStyle: 'italic' }}>Booked {scarcity.booked} times today</p>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', marginTop: 'auto' }}>
                                                <div style={{ textAlign: 'right' }}>
                                                    <p style={{ margin: '0 0 2px 0', fontSize: '12px', color: '#555' }}>{guestsQuery} {parseInt(guestsQuery) > 1 ? 'nights' : 'night'}, {guestsQuery} adults</p>
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                                                        <span style={{ textDecoration: 'line-through', color: '#d91e18', fontSize: '14px' }}>US${Math.floor(item.price * parseInt(guestsQuery) * 1.4)}</span>
                                                        <h4 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#333' }}>US${item.price * parseInt(guestsQuery || 1)}</h4>
                                                    </div>
                                                    <p style={{ margin: '2px 0 10px 0', fontSize: '12px', color: '#777' }}>+US${Math.floor(item.price * .15)} taxes and charges</p>
                                                    <Link to={`${item.routeTarget}?date=${dateQuery}&guests=${guestsQuery}`} className="theme-btn" style={{ padding: '8px 16px', background: '#0071c2', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', fontSize: '16px' }}>
                                                        <span data-hover="See availability">See availability <i className="fal fa-chevron-right" style={{ fontSize: '12px', marginLeft: '5px' }}></i></span>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    );
                                })}
                            </div>
                        )}
                        {viewMode === 'map' && filteredProperties.length > 0 && (
                            <div style={{ height: '800px', width: '100%', borderRadius: '10px', overflow: 'hidden', border: '1px solid #ccc', marginTop: '20px' }}>
                                <MapContainer center={[33.6844, 73.0479]} zoom={6} style={{ height: '100%', width: '100%' }}>
                                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors' />
                                    {filteredProperties.map(item => (
                                        <Marker key={`map-${item.displayId}`} position={[item.lat || 33.6844 + (Math.random()*4 - 2), item.lng || 73.0479 + (Math.random()*4 - 2)]}>
                                            <Popup>
                                                <img src={item.img?.startsWith('http') ? item.img : `/${item.img}`} alt={item.title} style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '6px', marginBottom: '10px' }} />
                                                <h6 style={{ margin: '0 0 5px 0', fontSize: '14px' }}>{item.title}</h6>
                                                <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', color: '#0071c2' }}>US${item.price}</p>
                                                <Link to={`${item.routeTarget}?date=${dateQuery}&guests=${guestsQuery}`} style={{ display: 'block', background: '#0071c2', color: '#fff', textAlign: 'center', padding: '5px', borderRadius: '4px', textDecoration: 'none' }}>View Details</Link>
                                            </Popup>
                                        </Marker>
                                    ))}
                                </MapContainer>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SearchResults;
