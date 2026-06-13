import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Packages = () => {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        fetch('/api/packages')
            .then(res => res.json())
            .then(data => {
                setPackages(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const categories = ['All', ...new Set(packages.map(p => p.category))];
    const filtered = filter === 'All' ? packages : packages.filter(p => p.category === filter);

    return (
        <section className="pt-150 pb-100 bgc-lighter" style={{ minHeight: '80vh' }}>
            <div className="container" style={{ maxWidth: '1200px' }}>
                {/* Header */}
                <div className="text-center mb-50 pt-30">
                    <span style={{ color: '#0071c2', fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '2px' }}>Our Offerings</span>
                    <h2 style={{ fontSize: '36px', marginTop: '10px', marginBottom: '15px', color: '#222' }}>Explore Our Travel Packages</h2>
                    <p style={{ color: '#666', fontSize: '16px', maxWidth: '600px', margin: '0 auto' }}>
                        Choose from our carefully curated packages designed to give you the best of Pakistan's breathtaking landscapes.
                    </p>
                </div>

                {/* Category Filters */}
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '40px' }}>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            style={{
                                padding: '8px 20px',
                                borderRadius: '25px',
                                border: '1px solid #0071c2',
                                background: filter === cat ? '#0071c2' : '#fff',
                                color: filter === cat ? '#fff' : '#0071c2',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                transition: 'all 0.2s'
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="text-center py-100">
                        <div className="spinner-border" style={{ color: '#0071c2', width: '3rem', height: '3rem' }}></div>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-100">
                        <i className="fas fa-suitcase" style={{ fontSize: '60px', color: '#ccc', marginBottom: '20px', display: 'block' }}></i>
                        <h3 style={{ color: '#555' }}>No packages found</h3>
                        <p style={{ color: '#888' }}>The admin hasn't added any packages yet. Check back later!</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '25px' }}>
                        {filtered.map(pkg => (
                            <div key={pkg._id} style={{
                                background: '#fff',
                                borderRadius: '12px',
                                overflow: 'hidden',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                                transition: 'transform 0.3s, box-shadow 0.3s'
                            }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)'; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.08)'; }}
                            >
                                {/* Package Image */}
                                <div style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
                                    <img
                                        src={pkg.imageUrl ? (pkg.imageUrl.startsWith('http') ? pkg.imageUrl : `/${pkg.imageUrl}`) : '/assets/images/destinations/destination1.jpg'}
                                        alt={pkg.title}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        onError={e => { e.target.src = '/assets/images/destinations/destination1.jpg'; }}
                                    />
                                    {pkg.featured && (
                                        <span style={{ position: 'absolute', top: '12px', left: '12px', background: '#ffc107', color: '#333', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                                            ⭐ Featured
                                        </span>
                                    )}
                                    <span style={{ position: 'absolute', bottom: '12px', right: '12px', background: '#0071c2', color: '#fff', padding: '4px 10px', borderRadius: '4px', fontSize: '12px' }}>
                                        {pkg.category}
                                    </span>
                                </div>

                                {/* Package Info */}
                                <div style={{ padding: '20px' }}>
                                    <h3 style={{ fontSize: '18px', color: '#222', marginBottom: '8px', fontWeight: 'bold' }}>{pkg.title}</h3>
                                    <p style={{ color: '#666', fontSize: '14px', marginBottom: '15px', lineHeight: '1.6' }}>
                                        {pkg.description?.substring(0, 100)}...
                                    </p>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                        <div style={{ display: 'flex', gap: '15px', fontSize: '13px', color: '#777' }}>
                                            <span><i className="fas fa-clock" style={{ color: '#0071c2', marginRight: '4px' }}></i>{pkg.durationDays} Days</span>
                                        </div>
                                        <div>
                                            <span style={{ fontSize: '22px', fontWeight: 'bold', color: '#0071c2' }}>US${pkg.price}</span>
                                            <span style={{ fontSize: '12px', color: '#888' }}>/person</span>
                                        </div>
                                    </div>

                                    <Link to="/search" className="theme-btn style-two w-100" style={{ display: 'block', textAlign: 'center', padding: '10px 0' }}>
                                        <span data-hover="Book This Package">Book This Package</span>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Packages;
