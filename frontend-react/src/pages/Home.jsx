import Destinations from '../components/Destinations';
import Hotels from '../components/Hotels';
import ExpenseCalculator from '../components/ExpenseCalculator';
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [inputText, setInputText] = useState('');
    const [checkDate, setCheckDate] = useState('');
    const [guests, setGuests] = useState('1');
    const [dropdownDestinations, setDropdownDestinations] = useState([]);

    React.useEffect(() => {
        fetch('/api/destinations')
            .then(res => res.json())
            .then(data => setDropdownDestinations(data))
            .catch(err => console.error("Failed to load destinations", err));
    }, []);

    const handleSearch = () => {
        navigate(`/search?q=${encodeURIComponent(inputText)}&date=${checkDate}&guests=${guests}`);
    };
  return (
    <div className="page-wrapper">
        
        {/*  Hero Area Start  */}
        <section className="hero-area bgc-black pt-200 rpt-120 rel z-2">
            <div className="container-fluid">
               
                <div className="main-hero-image bgs-cover"
                style={{ backgroundImage: 'url(assets/images/hero/hero1.jpg)', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
               <h6 className="hero-title" style={{ fontSize: '5rem', color: 'white', textAlign: 'center' }} data-aos="flip-up" data-aos-delay="50" data-aos-duration="1500" data-aos-offset="50">
               Explore with Destino
               </h6>
           </div>
           
            </div>
            <div className="container container-1400">
                <div className="search-filter-inner" data-aos="zoom-out-down" style={{ display: 'flex', flexWrap: 'nowrap', background: '#fff', borderRadius: '15px', padding: '15px', boxShadow: '0 15px 40px rgba(0,0,0,0.15)', gap: '15px', margin: '0 auto', maxWidth: '1000px', transform: 'translateY(-50%)' }}>
                    <div className="filter-item" style={{ flex: '2', borderRight: '1px solid #eaeaea', paddingRight: '15px', paddingLeft: '15px' }}>
                        <span className="title" style={{ fontSize: '13px', color: '#555', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>DESTINATION</span>
                        <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
                            <i className="fal fa-map-marker-alt" style={{ color: '#ffb300', marginRight: '15px', fontSize: '22px' }}></i>
                            <input 
                                list="destinations-list"
                                type="text"
                                placeholder="Where to?"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '18px', fontWeight: '500', color: '#222' }}
                            />
                            <datalist id="destinations-list">
                                {dropdownDestinations.map(d => (
                                    <option key={d._id} value={d.name} />
                                ))}
                            </datalist>
                        </div>
                    </div>
                    
                    <div className="filter-item" style={{ flex: '1.5', borderRight: '1px solid #eaeaea', paddingRight: '15px', paddingLeft: '15px' }}>
                        <span className="title" style={{ fontSize: '13px', color: '#555', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>DATES</span>
                        <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
                            <i className="fal fa-calendar-alt" style={{ color: '#ffb300', marginRight: '15px', fontSize: '22px' }}></i>
                            <input 
                                type="date" 
                                style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '16px', color: '#444' }}
                                onChange={(e) => setCheckDate(e.target.value)}
                            />
                        </div>
                    </div>
                    
                    <div className="filter-item" style={{ flex: '1', paddingRight: '15px', paddingLeft: '15px' }}>
                        <span className="title" style={{ fontSize: '13px', color: '#555', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>GUESTS</span>
                        <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
                            <i className="fal fa-user" style={{ color: '#ffb300', marginRight: '15px', fontSize: '22px' }}></i>
                            <input 
                                type="number" 
                                min="1"
                                placeholder="2 Adults"
                                onChange={(e) => setGuests(e.target.value)}
                                style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '18px', color: '#222', fontWeight: '500' }}
                            />
                        </div>
                    </div>

                    <div className="search-button" style={{ flex: '1', paddingLeft: '5px' }}>
                        <button className="theme-btn w-100 style-two" onClick={handleSearch} style={{ height: '100%', padding: '15px 0', borderRadius: '10px', border: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '18px' }}>
                            <span data-hover="Search" style={{ fontWeight: 'bold' }}>Search</span>
                        </button>
                    </div>
                </div>
            </div>
        </section>
        {/*  Hero Area End  */}
        
        <div className="container mt-50">
            <ExpenseCalculator />
        </div>
        
        {/*  Destinations Area start  */}
        <section className="blog-list-page py-100 rel z-1">
            <div className="container">
                <div className="row">
                    <div className="col-lg-8">
                        <div className="blog-item style-three" data-aos="fade-up" data-aos-duration="1500" data-aos-offset="50">
                            <div className="image" style={{ overflow: 'hidden' }}>
                                <Link to="/blog-details" style={{ display: 'block' }}>
                                    <img src="assets/images/blog/blog-list1.jpg" alt="Blog List" style={{ transition: 'transform 0.3s ease' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'} />
                                </Link>
                            </div>
                            <div className="content">
                                <Link to="/blog-details" className="category">Travel</Link>
                                <h5><Link to="/blog-details">Exploring the Scenic Beauty of Hunza Valley</Link></h5>
                                <ul className="blog-meta">
                                    <li><i className="far fa-calendar-alt"></i> <span>10 March 2024</span></li>
                                    <li><i className="far fa-comments"></i> <span>Comments (8)</span></li>
                                </ul>
                                <p>Discover the stunning landscapes, rich culture, and warm hospitality of Hunza Valley.</p>
                                <Link to="/blog-details" className="theme-btn style-two style-three">
                                    <span data-hover="Read More">Read More</span>
                                    <i className="fal fa-arrow-right"></i>
                                </Link>
                            </div>
                        </div>
                        <div className="blog-item style-three" data-aos="fade-up" data-aos-duration="1500" data-aos-offset="50">
                            <div className="image" style={{ overflow: 'hidden' }}>
                                <Link to="/blog-details" style={{ display: 'block' }}>
                                    <img src="assets/images/blog/blog-list2.jpg" alt="Blog List" style={{ transition: 'transform 0.3s ease' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'} />
                                </Link>
                            </div>
                            <div className="content">
                                <Link to="/blog-details" className="category">Travel</Link>
                                <h5><Link to="/blog-details">Top Hiking Trails in Northern Pakistan</Link></h5>
                                <ul className="blog-meta">
                                    <li><i className="far fa-calendar-alt"></i> <span>15 March 2024</span></li>
                                    <li><i className="far fa-comments"></i> <span>Comments (12)</span></li>
                                </ul>
                                <p>Explore the best hiking trails in Northern Pakistan, from easy paths to challenging treks.</p>
                                <Link to="/blog-details" className="theme-btn style-two style-three">
                                    <span data-hover="Read More">Read More</span>
                                    <i className="fal fa-arrow-right"></i>
                                </Link>
                            </div>
                        </div>
                    </div>
        
                    {/*  Sidebar Content remains unchanged  */}
                    <div className="col-lg-4 col-md-8 col-sm-10 rmt-75">
                        <div className="blog-sidebar">
                            {/*  Search Widget  */}
                            <div className="widget widget-search" data-aos="fade-up" data-aos-duration="1500" data-aos-offset="50">
                                <form className="default-search-form" onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
                                    <input type="text" placeholder="Search" value={inputText} onChange={e => setInputText(e.target.value)} required />
                                    <button type="submit" className="searchbutton far fa-search"></button>
                                </form>
                            </div>
        
                            {/*  Category Widget  */}
                            <div className="widget widget-category" data-aos="fade-up" data-aos-duration="1500" data-aos-offset="50">
                                <h5 className="widget-title">Category</h5>
                                <ul className="list-style-three">
                                    <li><Link to="/search">Adventure</Link></li>
                                    <li><Link to="/search">Hiking & Trekking</Link></li>
                                    <li><Link to="/search">Family Tours</Link></li>
                                </ul>
                            </div>
        
                            {/*  Recent News Widget  */}
                            <div className="widget widget-news" data-aos="fade-up" data-aos-duration="1500" data-aos-offset="50">
                                <h5 className="widget-title">Recent News</h5>
                                <ul>
                                    <li>
                                        <div className="image" style={{ overflow: 'hidden', borderRadius: '4px' }}>
                                            <Link to="/blog-details" style={{ display: 'block' }}>
                                                <img src="assets/images/widgets/news1.jpg" alt="News" style={{ transition: 'transform 0.3s ease' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'} />
                                            </Link>
                                        </div>
                                        <div className="content">
                                            <h6><Link to="/blog-details">Northern Pakistan’s Must-Visit Festivals</Link></h6>
                                            <span className="date"><i className="far fa-calendar-alt"></i> 10 March 2024</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        {/*  Destinations Area end  */}
         
        {/*  About Us Area start  */}
        <section className="about-us-area py-100 rpb-90 rel z-1">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-xl-5 col-lg-6">
                        <div className="about-us-content rmb-55" data-aos="fade-left" data-aos-duration="1500" data-aos-offset="50">
                            <div className="section-title mb-25">
                                <h2>Travel with Confidence: Why Choose Us as Your Guide to Pakistan's Wonders</h2>
                            </div>
                            <p>Experience the magic of Pakistan’s northern valleys with confidence! From the breathtaking beauty of Hunza and Swat to the vibrant cultures of Chitral and Skardu, our agency brings you closer to the soul of Pakistan’s most scenic regions.</p>
                            <div className="divider counter-text-wrap mt-45 mb-55"><span>We have <span><span className="count-text plus" data-speed="3000" data-stop="25">0</span> Years</span> of experience</span></div>
                            <div className="row">
                                <div className="col-6">
                                    <div className="counter-item counter-text-wrap">
                                        <span className="count-text k-plus" data-speed="3000" data-stop="3">0</span>
                                        <span className="counter-title">Popular Destination</span>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="counter-item counter-text-wrap">
                                        <span className="count-text m-plus" data-speed="3000" data-stop="9">0</span>
                                        <span className="counter-title">Satisfied Clients</span>
                                    </div>
                                </div>
                            </div>
                            <Link to="/search" className="theme-btn mt-10 style-two">
                                <span data-hover="Explore Destinations">Explore Destinations</span>
                                <i className="fal fa-arrow-right"></i>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        {/*  About Us Area end  */}
         
        <Destinations query={searchQuery} />
        
        {/*  Features Area start  */}
        <section className="features-area pt-100 pb-45 rel z-1">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-xl-6">
                        <div className="features-content-part mb-55" data-aos="fade-left" data-aos-duration="1500" data-aos-offset="50">
                            <div className="section-title mb-60">
                                <h2>The Ultimate Travel Experience Features That Set <span style={{ color: 'rgb(255, 255, 255)' }}>Destino</span> Apart</h2>
                            </div>
                            <div className="features-customer-box">
                                <div className="image">
                                    <img src="assets/images/features/features-box.jpg" alt="Features" />
                                </div>
                                <div className="content">
                                    <div className="feature-authors mb-15">
                                        <img src="assets/images/features/feature-author1.jpg" alt="Author" />
                                    </div>
                                    <h6>850K+ Happy Customer</h6>
                                    <p>We pride ourselves offering personalized itineraries</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-6" data-aos="fade-right" data-aos-duration="1500" data-aos-offset="50">
                        <div className="row pb-25">
                            <div className="col-md-6">
                                <div className="feature-item">
                                    <div className="icon"><i className="flaticon-tent"></i></div>
                                    <div className="content">
                                        <h5><Link to="/search">Tent Camping</Link></h5>
                                        <p>Tent camping is wonderful way to connect with nature</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        {/*  Features Area end  */}
         
        <Hotels />
        
        {/*  Testimonials Area start  */}
        <section className="testimonials-area rel z-1 mt-50">
            <div className="container">
                <div className="testimonials-wrap bgc-lighter" style={{ borderRadius: '15px' }}>
                    <div className="row">
                        <div className="col-lg-5 rel" data-aos="fade-right" data-aos-duration="1500" data-aos-offset="50">
                            <div className="testimonial-left-image rmb-55 ms-3" style={{ backgroundImage: 'url(assets/images/testimonials/testimonial-left.jpg)' }}></div>
                        </div>
                        <div className="col-lg-7">
                            <div className="testimonial-right-content" data-aos="fade-left" data-aos-duration="1500" data-aos-offset="50">
                                <div className="section-title mb-55">
                                    <h2><span>5280</span>Explore Pakistan Like Never Before!</h2>
                                </div>
                                <div className="testimonials-active">
                                    <div className="testimonial-item">
                                        <div className="text">"With Destino, I had the most incredible journey across Pakistan! Everything was well-organized, and we enjoyed top-notch accommodations, delicious local food."</div>
                                        <div className="author">
                                            <div className="image"><img src="assets/images/testimonials/author.jpg" alt="Author" style={{ width: '100px' }} height="100px" /></div>
                                            <div className="content">
                                                <h5>Rizwan Ali</h5>
                                                <span>Graphics Designer</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        {/*  Testimonials Area end  */}
         
        {/*  CTA Area start  */}
        <section className="cta-area pt-100 rel z-1">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-xl-4 col-md-6" data-aos="zoom-in-down" data-aos-duration="1500" data-aos-offset="50">
                        <div className="cta-item" style={{ backgroundImage: 'url(assets/images/cta/cta1.jpg)' }}>
                            <span className="category">Tent Camping</span>
                            <h2>Explore Pakistan’s best tourism</h2>
                            <Link to="/search" className="theme-btn style-two bgc-secondary">
                                <span data-hover="Explore Tours">Explore Tours</span>
                                <i className="fal fa-arrow-right"></i>
                            </Link>
                        </div>
                    </div>
                    <div className="col-xl-4 col-md-6" data-aos="zoom-in-down" data-aos-delay="50" data-aos-duration="1500" data-aos-offset="50">
                        <div className="cta-item" style={{ backgroundImage: 'url(assets/images/cta/cta2.jpg)' }}>
                            <span className="category">Valley</span>
                            <h2>Neelum Valley, Kashmir</h2>
                            <Link to="/search" className="theme-btn style-two">
                                <span data-hover="Explore Tours">Explore Tours</span>
                                <i className="fal fa-arrow-right"></i>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        {/*  CTA Area end  */}
         
        {/*  Blog Area start  */}
        <section className="blog-area py-70 rel z-1">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-12">
                        <div className="section-title text-center counter-text-wrap mb-70" data-aos="fade-up" data-aos-duration="1500" data-aos-offset="50">
                            <h2>Explore Pakistan: Unforgettable Experiences Await</h2>
                            <p>One site <span className="count-text plus bgc-primary" data-speed="3000" data-stop="34500">0</span> most popular experience you’ll remember</p>
                        </div>
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="col-xl-4 col-md-6">
                        <div className="blog-item" data-aos="fade-up" data-aos-duration="1500" data-aos-offset="50">
                            <div className="content">
                                <Link to="/blog-details" className="category">Travel</Link>
                                <h5><Link to="/blog-details">Ultimate Guide to Planning Your Dream Vacation with Destino Travel Agency</Link></h5>
                                <ul className="blog-meta">
                                    <li><i className="far fa-calendar-alt"></i> <span>25 December 2024</span></li>
                                </ul>
                            </div>
                            <div className="image" style={{ overflow: 'hidden' }}>
                                <Link to="/blog-details" style={{ display: 'block' }}>
                                    <img src="assets/images/blog/blog1.jpg" alt="Blog" style={{ transition: 'transform 0.3s ease', width: '100%' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'} />
                                </Link>
                            </div>
                            <Link to="/blog-details" className="theme-btn">
                                <span data-hover="Book Now">Read More</span>
                                <i className="fal fa-arrow-right"></i>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        {/*  Blog Area end  */}

    </div>
  );
}

export default Home;
