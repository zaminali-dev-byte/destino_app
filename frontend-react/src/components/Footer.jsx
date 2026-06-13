import React, { useState } from 'react';

function Footer() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('');

    const handleSubscribe = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5000/api/subscribers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await res.json();
            if (res.ok) {
                setStatus('Subscribed successfully!');
                setEmail('');
                setTimeout(() => setStatus(''), 3000);
            } else {
                setStatus(data.message || 'Error subscribing');
            }
        } catch (err) {
            setStatus('Error subscribing');
        }
    };

    return (
        <>
{/*  footer area start  */}
        <footer className="main-footer bgs-cover overlay rel z-1 pb-25" style={{ backgroundImage: 'url(assets/images/backgrounds/footer.jpg)' }}>
            <div className="container">
                <div className="footer-top pt-100 pb-30">
                    <div className="row justify-content-between">
                        <div className="col-xl-5 col-lg-6" data-aos="fade-up" data-aos-duration="1500" data-aos-offset="50">
                            <div className="footer-widget footer-text">
                                <div className="footer-logo mb-25">
                                    <a href="/index-2"><img src="assets/images/logos/logo.png" alt="Logo" style={{ width: '200px' }} height="150px" /></a>
                                </div>
                                <p>We curate bespoke itineraries tailored to your preferences, ensuring every trip is seamless and enriching hidden gems beaten</p>
                                <div className="social-style-one mt-15">
                                    <a href="/contact"><i className="fab fa-facebook-f"></i></a>
                                    <a href="/contact"><i className="fab fa-youtube"></i></a>
                                    <a href="/contact"><i className="fab fa-pinterest"></i></a>
                                    <a href="/contact"><i className="fab fa-twitter"></i></a>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-5 col-lg-6" data-aos="fade-up" data-aos-delay="50" data-aos-duration="1500" data-aos-offset="50">
                            <div className="section-title counter-text-wrap mb-35">
                                <h2>Subscribe Newsletter</h2>
                                <p>One site <span className="count-text plus" data-speed="3000" data-stop="34500">0</span> most popular experience you’ll remember</p>
                            </div>
                            <form className="newsletter-form mb-50" onSubmit={handleSubscribe}>
                                <input id="news-email" type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                <button type="submit" className="theme-btn bgc-secondary style-two">
                                    <span data-hover="Subscribe">Subscribe</span>
                                    <i className="fal fa-arrow-right"></i>
                                </button>
                            </form>
                            {status && <p style={{ color: status.includes('success') ? '#22c55e' : '#ef4444', marginTop: '-30px', fontSize: '14px' }}>{status}</p>}
                        </div>
                    </div>
                </div>
            </div>
            <div className="widget-area pt-95 pb-45">
                <div className="container">
                    <div className="row row-cols-xl-5 row-cols-lg-4 row-cols-md-3 row-cols-2">
                        <div className="col col-small" data-aos="fade-up" data-aos-duration="1500" data-aos-offset="50">
                            <div className="footer-widget footer-links">
                                <div className="footer-title">
                                    <h5>Services</h5>
                                </div>
                                <ul className="list-style-three">
                                    <li><a href="/destination-details">Best Tour Guide</a></li>
                                    <li><a href="/destination-details">Tour Booking</a></li>
                                    <li><a href="/destination-details">Hotel Booking</a></li>
                                    <li><a href="/destination-details">Ticket Booking</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col col-small" data-aos="fade-up" data-aos-delay="50" data-aos-duration="1500" data-aos-offset="50">
                            <div className="footer-widget footer-links">
                                <div className="footer-title">
                                    <h5>Company</h5>
                                </div>
                                <ul className="list-style-three">
                                    <li><a href="/about">About Company</a></li>
                                    <li><a href="/contact">Jobs and Careers</a></li>
                                    <li><a href="/blog">latest News Blog</a></li>
                                    <li><a href="/contact">Contact Us</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col col-small" data-aos="fade-up" data-aos-delay="100" data-aos-duration="1500" data-aos-offset="50">
                            <div className="footer-widget footer-links">
                                <div className="footer-title">
                                    <h5>Destinations</h5>
                                </div>
                                <ul className="list-style-three">
                                    <li><a href="/destination-details">Hunza Valley </a></li>
                                    <li><a href="/destination-details">Skardu</a></li>
                                    <li><a href="/destination-details">Swat Valley</a></li>
                                    <li><a href="/destination-details">Fairy Meadows</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col col-small" data-aos="fade-up" data-aos-delay="150" data-aos-duration="1500" data-aos-offset="50">
                            <div className="footer-widget footer-links">
                                <div className="footer-title">
                                    <h5>Categories</h5>
                                </div>
                                <ul className="list-style-three">
                                    <li><a href="/contact">Adventure</a></li>
                                    <li><a href="/contact">Hiking & Trekking</a></li>
                                    <li><a href="/contact">Family Tours</a></li>
                                    <li><a href="/contact">Wildlife Tours</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col col-md-6 col-10 col-small" data-aos="fade-up" data-aos-delay="200" data-aos-duration="1500" data-aos-offset="50">
                            <div className="footer-widget footer-contact">
                                <div className="footer-title">
                                    <h5>Get In Touch</h5>
                                </div>
                                <ul className="list-style-one">
                                    <li><i className="fal fa-user"></i> Zamin</li>
                                    <li><i className="fal fa-map-marked-alt"></i> Lahore, Pakistan</li>
                                    <li><i className="fal fa-envelope"></i> <a href="mailto:zamin@destino.com">zamin@destino.com</a></li>
                                    <li><i className="fal fa-clock"></i> Mon - Fri, 08am - 05pm</li>
                                    <li><i className="fal fa-phone-volume"></i> <a href="callto:+92034556821">+92034556821</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="footer-bottom pt-20 pb-5">
                <div className="container">
                    <div className="row">
                       <div className="col-lg-5">
                            <div className="copyright-text text-center text-lg-start">
                                <p><a href="/index-2"></a> &copy; 2024 All rights reserved, <strong>Destino</strong></p>
                            </div>
                       </div>
                       <div className="col-lg-7 text-center text-lg-end">
                           <ul className="footer-bottom-nav">
                               <li><a href="/about">Terms</a></li>
                               <li><a href="/about">Privacy Policy</a></li>
                               <li><a href="/about">Legal notice</a></li>
                               <li><a href="/about">Accessibility</a></li>
                           </ul>
                       </div>
                    </div>
                    {/*  Scroll Top Button  */}
                    <button className="scroll-top scroll-to-target" data-target="html"><img src="assets/images/icons/scroll-up.png" alt="Scroll  Up" /></button>
                </div>
            </div>
        </footer>
        </>
    );
}

export default Footer;
