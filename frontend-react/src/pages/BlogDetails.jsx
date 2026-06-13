import React from 'react';
import { Link } from 'react-router-dom';

const BlogDetails = () => {
    return (
        <section className="blog-details-area pt-150 pb-100 bgc-lighter" style={{ marginTop: '-100px' }}>
            <div className="container" style={{ maxWidth: '900px' }}>
                <div style={{ background: '#fff', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}>
                    <img src="/assets/images/blog/blog-list1.jpg" alt="Travel Guide" style={{ width: '100%', height: '450px', objectFit: 'cover' }} onError={(e) => e.target.src="/assets/images/destinations/destination1.jpg"} />
                    
                    <div style={{ padding: '50px' }}>
                        <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', fontSize: '14px' }}>
                            <span style={{ color: '#0071c2', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Destino Exclusives</span>
                            <span style={{ color: '#777' }}><i className="fal fa-calendar-alt"></i> March 30, 2024</span>
                            <span style={{ color: '#777' }}><i className="fal fa-clock"></i> 5 min read</span>
                        </div>

                        <h1 style={{ fontSize: '38px', fontWeight: 'bold', color: '#222', marginBottom: '30px', lineHeight: '1.3' }}>Unlocking Northern Pakistan: A Guide to the Majestic Valleys</h1>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '40px', paddingBottom: '30px', borderBottom: '1px solid #eee' }}>
                            <img src="/assets/images/testimonials/author.jpg" alt="Author" style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
                            <div>
                                <h6 style={{ margin: 0, fontWeight: 'bold', fontSize: '16px' }}>Written by Editorial Staff</h6>
                                <p style={{ margin: 0, fontSize: '13px', color: '#555' }}>Expert Travelers at Destino</p>
                            </div>
                        </div>

                        <div className="article-body" style={{ fontSize: '18px', lineHeight: '1.9', color: '#444' }}>
                            <p>Hidden amidst the towering peaks of the Karakoram and Himalayan ranges lies Northern Pakistan, a region of unparalleled, raw beauty. For decades, it was a well-kept secret among mountaineers, but today, its gates are wide open for adventurers and peace-seekers alike.</p>
                            
                            <h3 style={{ fontSize: '28px', color: '#222', marginTop: '40px', marginBottom: '20px' }}>The Magic of Hunza</h3>
                            <p>Very few places on earth command the kind of awe that Hunza Valley does. Stepping into the valley feels like entering an ancient kingdom where time stands still. From the historic Baltit Fort overlooking the expanse to the shimmering turquoise waters of Attabad Lake, every corner of Hunza looks like it was painted by a master artist.</p>
                            
                            <div style={{ padding: '30px', background: '#f8f9fa', borderLeft: '4px solid #0071c2', margin: '40px 0', fontSize: '20px', fontStyle: 'italic', fontWeight: '500' }}>
                                "To travel in Pakistan is to witness the absolute limit of human hospitality and natural grandeur simultaneously."
                            </div>

                            <h3 style={{ fontSize: '28px', color: '#222', marginTop: '40px', marginBottom: '20px' }}>Navigating the Peaks</h3>
                            <p>If you prefer a rugged challenge over serene valley walks, Skardu and the Fairy Meadows offer treks that will test your mettle. Getting to the base camps of mountains like Nanga Parbat and K2 is no small feat, but the staggering views of ice and rock piercing the sky make every aching muscle worth the climb.</p>

                            <p>Ready to embark on this journey? You no longer need to figure it all out yourself. With Destino, booking your hotels, transport, and expert guides is seamless. Head over to our Search Portal to start planning the expedition of your life.</p>
                        </div>

                        <div style={{ marginTop: '50px', padding: '30px', background: '#003580', color: '#fff', borderRadius: '10px', textAlign: 'center' }}>
                            <h3 style={{ color: '#fff', marginBottom: '15px' }}>Start your adventure today</h3>
                            <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '20px' }}>Search hundreds of vetted properties and tours instantly.</p>
                            <Link to="/search" className="theme-btn" style={{ background: '#fff', color: '#003580', border: 'none', padding: '12px 30px', borderRadius: '4px', fontWeight: 'bold' }}>Go to Search Portal</Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BlogDetails;
