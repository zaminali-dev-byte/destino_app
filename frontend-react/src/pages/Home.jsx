import Destinations from '../components/Destinations';
import Hotels from '../components/Hotels';
import React from 'react';

function Home() {
  return (
    <div className="page-wrapper">

        {/*  Preloader  */}
        <div className="preloader"><div className="custom-loader"></div></div>

        {/*  main header  */}
        <header className="main-header header-one white-menu menu-absolute">
            {/* Header-Upper */}
            <div className="header-upper py-30 rpy-0">
                <div className="container-fluid clearfix">

                    <div className="header-inner rel d-flex align-items-center">
                        <div className="logo-outer">
                            <div className="logo"><a href="index-2.html"><img src="assets/images/logos/logo.png" alt="Logo" title="Logo" style={{ width: '150px', height: '100px' }} /></a></div>
                        </div>

                        <div className="nav-outer mx-lg-auto ps-xxl-5 clearfix">
                            {/*  Main Menu  */}
                            <nav className="main-menu navbar-expand-lg">
                                <div className="navbar-header">
                                   <div className="mobile-logo">
                                       <a href="index-2.html">
                                        <img src="assets/images/logos/logo1.png" alt="Logo" title="Logo" /></a>
                                   </div>
                                   
                                    {/*  Toggle Button  */}
                                    <button type="button" className="navbar-toggle" data-bs-toggle="collapse" data-bs-target=".navbar-collapse">
                                        <span className="icon-bar"></span>
                                        <span className="icon-bar"></span>
                                        <span className="icon-bar"></span>
                                    </button>
                                </div>

                                <div className="navbar-collapse collapse clearfix">
                                    <ul className="navigation clearfix">
                                        <li className=""><a href="#">Home</a>
                                            {/* <ul>
                                                <li><a href="index-2.html">Travel Agency</a></li>
                                                <li><a href="index2.html">City Tour</a></li>
                                                <li><a href="index3.html">Tour Package</a></li>
                                            </ul> */}
                                        </li>
                                        <li><a href="about.html">About</a></li>
                                        <li className="dropdown"><a href="#">Tours</a>
                                            <ul>
                                                <li><a href="tour-list.html">Family and Friend Tours</a></li>
                                                <li><a href="tour-grid.html">Hicking & Camping Tours</a></li>
                                                <li><a href="tour-sidebar.html">Public group Tours</a></li>
                                                <li><a href="tour-details.html">Wildlife & Safari</a></li>
                                                <li><a href="tour-guide.html">Cultural & Historical Tours</a></li>
                                            </ul>
                                        </li>
                                        <li className="dropdown"><a href="#">Destinations</a>
                                            <ul>
                                                <li><a href="destination1.html">Hunza Valley</a></li>   
                                                <li><a href="destination2.html">Skardu</a></li>
                                                <li><a href="destination-details.html">Swat Valley</a></li>
                                                <li><a href="destination-details.html">Fairy Meadows</a></li>
                                            </ul>
                                        </li>
                                        <li><a href="blog.html">blog</a>
                                        <li><a href="contact.html">Contact</a></li>
                                        </li>
                                    </ul>
                                </div>

                            </nav>
                            {/*  Main Menu End */}
                        </div>
                        
                        {/*  Nav Search  */}
                        <div className="nav-search">
                            <button className="far fa-search"></button>
                            <form action="#" className="hide">
                                <input type="text" placeholder="Search" className="searchbox" required />
                                <button type="submit" className="searchbutton far fa-search"></button>
                            </form>
                        </div>
                        
                        {/*  Menu Button  */}
                        <div className="menu-btns py-10">
                            {/* <a href="contact.html" className="theme-btn style-two bgc-secondary">
                                <span data-hover="Book Now">Book Now</span>
                                <i className="fal fa-arrow-right"></i>
                            </a> */}
                            {/*  menu sidbar  */}
                            <div className="menu-sidebar">
                                <button className="bg-transparent">
                                    <span className="icon-bar"></span>
                                    <span className="icon-bar"></span>
                                    <span className="icon-bar"></span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* End Header Upper */}
        </header>
       

        {/* Form Back Drop */}
        <div className="form-back-drop"></div>
        
        {/*  Hidden Sidebar  */}
        <section className="hidden-bar">
            <div className="inner-box text-center">
                <div className="cross-icon"><span className="fa fa-times"></span></div>
                <div className="title">
                    <h4>Get Appointment</h4>
                </div>

                {/* Appointment Form */}
                <div className="appointment-form">
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        const data = {
                            name: e.target.text.value,
                            email: e.target.email.value,
                            message: e.target.message.value
                        };
                        fetch('http://localhost:4000/api/contact', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(data)
                        })
                        .then(res => res.json())
                        .then(() => {
                            alert('Message sent successfully!');
                            e.target.reset();
                        });
                    }}>
                        <div className="form-group">
                            <input type="text" name="text" defaultValue="" placeholder="Name" required />
                        </div>
                        <div className="form-group">
                            <input type="email" name="email" defaultValue="" placeholder="Email Address" required />
                        </div>
                        <div className="form-group">
                            <textarea name="message" placeholder="Message" rows="5" required></textarea>
                        </div>
                        <div className="form-group">
                            <button type="submit" className="theme-btn style-two">
                                <span data-hover="Submit now">Submit now</span>
                                <i className="fal fa-arrow-right"></i>
                            </button>
                        </div>
                    </form>
                </div>

                {/* Social Icons */}
                <div className="social-style-one">
                    <a href="contact.html"><i className="fab fa-twitter"></i></a>
                    <a href="contact.html"><i className="fab fa-facebook-f"></i></a>
                    <a href="contact.html"><i className="fab fa-instagram"></i></a>
                    <a href="#"><i className="fab fa-pinterest-p"></i></a>
                </div>
            </div>
        </section>
        {/* End Hidden Sidebar  */}
       
        
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
                <div className="search-filter-inner" data-aos="zoom-out-down" data-aos-duration="1500" data-aos-offset="50">
                    <div className="filter-item clearfix">
                        <div className="icon"><i className="fal fa-map-marker-alt"></i></div>
                        <span className="title">Destinations</span>
                        <select name="city" id="city">
                            <option value="value1">City or Region</option>
                            <option value="value2">City</option>
                            <option value="value2">Region</option>
                        </select>
                    </div>
                    <div className="filter-item clearfix">
                        <div className="icon"><i className="fal fa-flag"></i></div>
                        <span className="title">All Activity</span>
                        <select name="activity" id="activity">
                            <option value="value1">Choose Activity</option>
                            <option value="value2">Daily</option>
                            <option value="value2">Monthly</option>
                        </select>
                    </div>
                    <div className="filter-item clearfix">
                        <div className="icon"><i className="fal fa-calendar-alt"></i></div>
                        <span className="title">Departure Date</span>
                        <select name="date" id="date">
                            <option value="value1">Date from</option>
                            <option value="value2">10</option>
                            <option value="value2">20</option>
                        </select>
                    </div>
                    <div className="filter-item clearfix">
                        <div className="icon"><i className="fal fa-users"></i></div>
                        <span className="title">Guests</span>
                        <select name="cuests" id="cuests">
                            <option value="value1">0</option>
                            <option value="value2">1</option>
                            <option value="value2">2</option>
                        </select>
                    </div>
                    <div className="search-button">
                        <button className="theme-btn">
                            <span data-hover="Search">Search</span>
                            <i className="far fa-search"></i>
                        </button>
                    </div>
                </div>
            </div>
        </section>
        {/*  Hero Area End  */}
        
        
        {/*  Destinations Area start  */}
        <section className="blog-list-page py-100 rel z-1">
            <div className="container">
                <div className="row">
                    <div className="col-lg-8">
                        <div className="blog-item style-three" data-aos="fade-up" data-aos-duration="1500" data-aos-offset="50">
                            <div className="image">
                                <img src="assets/images/blog/blog-list1.jpg" alt="Blog List" />
                            </div>
                            <div className="content">
                                <a href="blog.html" className="category">Travel</a>
                                <h5><a href="blog-details.html">Exploring the Scenic Beauty of Hunza Valley</a></h5>
                                <ul className="blog-meta">
                                    <li><i className="far fa-calendar-alt"></i> <a href="#">10 March 2024</a></li>
                                    <li><i className="far fa-comments"></i> <a href="#">Comments (8)</a></li>
                                </ul>
                                <p>Discover the stunning landscapes, rich culture, and warm hospitality of Hunza Valley.</p>
                                <a href="blog-details.html" className="theme-btn style-two style-three">
                                    <span data-hover="Read More">Read More</span>
                                    <i className="fal fa-arrow-right"></i>
                                </a>
                            </div>
                        </div>
                        <div className="blog-item style-three" data-aos="fade-up" data-aos-duration="1500" data-aos-offset="50">
                            <div className="image">
                                <img src="assets/images/blog/blog-list2.jpg" alt="Blog List" />
                            </div>
                            <div className="content">
                                <a href="blog.html" className="category">Travel</a>
                                <h5><a href="blog-details.html">Top Hiking Trails in Northern Pakistan</a></h5>
                                <ul className="blog-meta">
                                    <li><i className="far fa-calendar-alt"></i> <a href="#">15 March 2024</a></li>
                                    <li><i className="far fa-comments"></i> <a href="#">Comments (12)</a></li>
                                </ul>
                                <p>Explore the best hiking trails in Northern Pakistan, from easy paths to challenging treks.</p>
                                <a href="blog-details.html" className="theme-btn style-two style-three">
                                    <span data-hover="Read More">Read More</span>
                                    <i className="fal fa-arrow-right"></i>
                                </a>
                            </div>
                        </div>
                        <div className="blog-item style-three" data-aos="fade-up" data-aos-duration="1500" data-aos-offset="50">
                            <div className="image">
                                <img src="assets/images/blog/blog-list3.jpg" alt="Blog List" />
                            </div>
                            <div className="content">
                                <a href="blog.html" className="category">Travel</a>
                                <h5><a href="blog-details.html">Guide to Skardu: The Jewel of Gilgit-Baltistan</a></h5>
                                <ul className="blog-meta">
                                    <li><i className="far fa-calendar-alt"></i> <a href="#">20 March 2024</a></li>
                                    <li><i className="far fa-comments"></i> <a href="#">Comments (5)</a></li>
                                </ul>
                                <p>Everything you need to know for an unforgettable journey to Skardu, a top travel destination.</p>
                                <a href="blog-details.html" className="theme-btn style-two style-three">
                                    <span data-hover="Read More">Read More</span>
                                    <i className="fal fa-arrow-right"></i>
                                </a>
                            </div>
                        </div>
                        <div className="blog-item style-three" data-aos="fade-up" data-aos-duration="1500" data-aos-offset="50">
                            <div className="image">
                                <img src="assets/images/blog/blog-list4.jpg" alt="Blog List" />
                            </div>
                            <div className="content">
                                <a href="blog.html" className="category">Travel</a>
                                <h5><a href="blog-details.html">Cultural Festivals in Northern Pakistan You Can't Miss</a></h5>
                                <ul className="blog-meta">
                                    <li><i className="far fa-calendar-alt"></i> <a href="#">25 March 2024</a></li>
                                    <li><i className="far fa-comments"></i> <a href="#">Comments (6)</a></li>
                                </ul>
                                <p>Join the vibrant celebrations and experience the rich cultural heritage of the region.</p>
                                <a href="blog-details.html" className="theme-btn style-two style-three">
                                    <span data-hover="Read More">Read More</span>
                                    <i className="fal fa-arrow-right"></i>
                                </a>
                            </div>
                        </div>
                        <div className="blog-item style-three" data-aos="fade-up" data-aos-duration="1500" data-aos-offset="50">
                            <div className="image">
                                <img src="assets/images/blog/blog-list5.jpg" alt="Blog List" />
                            </div>
                            <div className="content">
                                <a href="blog.html" className="category">Travel</a>
                                <h5><a href="blog-details.html">A Journey through the Valleys of Northern Pakistan</a></h5>
                                <ul className="blog-meta">
                                    <li><i className="far fa-calendar-alt"></i> <a href="#">30 March 2024</a></li>
                                    <li><i className="far fa-comments"></i> <a href="#">Comments (10)</a></li>
                                </ul>
                                <p>Experience the breathtaking valleys and the majestic mountains of Northern Pakistan.</p>
                                <a href="blog-details.html" className="theme-btn style-two style-three">
                                    <span data-hover="Read More">Read More</span>
                                    <i className="fal fa-arrow-right"></i>
                                </a>
                            </div>
                        </div>
        
                        {/*  Pagination remains unchanged  */}
                        <ul className="pagination pt-15 flex-wrap" data-aos="fade-up" data-aos-duration="1500" data-aos-offset="50">
                            <li className="page-item disabled">
                                <span className="page-link"><i className="far fa-chevron-left"></i></span>
                            </li>
                            <li className="page-item active">
                                <span className="page-link">1 <span className="sr-only">(current)</span></span>
                            </li>
                            <li className="page-item"><a className="page-link" href="#">2</a></li>
                            <li className="page-item"><a className="page-link" href="#">3</a></li>
                            <li className="page-item"><a className="page-link" href="#">...</a></li>
                            <li className="page-item"><a className="page-link" href="#"><i className="far fa-chevron-right"></i></a></li>
                        </ul>
                    </div>
        
                    {/*  Sidebar Content remains unchanged  */}
                    <div className="col-lg-4 col-md-8 col-sm-10 rmt-75">
                        <div className="blog-sidebar">
                            {/*  Search Widget  */}
                            <div className="widget widget-search" data-aos="fade-up" data-aos-duration="1500" data-aos-offset="50">
                                <form action="#" className="default-search-form">
                                    <input type="text" placeholder="Search" required />
                                    <button type="submit" className="searchbutton far fa-search"></button>
                                </form>
                            </div>
        
                            {/*  Category Widget  */}
                            <div className="widget widget-category" data-aos="fade-up" data-aos-duration="1500" data-aos-offset="50">
                                <h5 className="widget-title">Category</h5>
                                <ul className="list-style-three">
                                    <li><a href="blog.html">Adventure</a></li>
                                    <li><a href="blog.html">Hiking & Trekking</a></li>
                                    <li><a href="blog.html">Cycling Tours</a></li>
                                    <li><a href="blog.html">Family Tours</a></li>
                                    <li><a href="blog.html">Mountain Hiking</a></li>
                                    <li><a href="blog.html">Rafting Excursion</a></li>
                                    <li><a href="blog.html">Coastal Paragliding</a></li>
                                </ul>
                            </div>
        
                            {/*  Recent News Widget  */}
                            <div className="widget widget-news" data-aos="fade-up" data-aos-duration="1500" data-aos-offset="50">
                                <h5 className="widget-title">Recent News</h5>
                                <ul>
                                    <li>
                                        <div className="image">
                                            <img src="assets/images/widgets/news1.jpg" alt="News" />
                                        </div>
                                        <div className="content">
                                            <h6><a href="blog-details.html">Northern Pakistan’s Must-Visit Festivals</a></h6>
                                            <span className="date"><i className="far fa-calendar-alt"></i> 10 March 2024</span>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="image">
                                            <img src="assets/images/widgets/news2.jpg" alt="News" />
                                        </div>
                                        <div className="content">
                                            <h6><a href="blog-details.html">Hidden Gems of Gilgit-Baltistan</a></h6>
                                            <span className="date"><i className="far fa-calendar-alt"></i> 15 March 2024</span>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="image">
                                            <img src="assets/images/widgets/news3.jpg" alt="News" />
                                        </div>
                                        <div className="content">
                                            <h6><a href="blog-details.html">Top 5 Trekking Trails in Pakistan</a></h6>
                                            <span className="date"><i className="far fa-calendar-alt"></i> 20 March 2024</span>
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
                            <a href="destination1.html" className="theme-btn mt-10 style-two">
                                <span data-hover="Explore Destinations">Explore Destinations</span>
                                <i className="fal fa-arrow-right"></i>
                            </a>
                        </div>
                    </div>
                    <div className="col-xl-7 col-lg-6" data-aos="fade-right" data-aos-duration="1500" data-aos-offset="50">
                        <div className="about-us-image">
                            <div className="shape"><img src="assets/images/about/shape1.png" alt="Shape" /></div>
                            <div className="shape"><img src="assets/images/about/shape2.png" alt="Shape" /></div>
                            <div className="shape"><img src="assets/images/about/shape3.png" alt="Shape" /></div>
                            <div className="shape"><img src="assets/images/about/shape4.png" alt="Shape" /></div>
                            <div className="shape"><img src="assets/images/about/shape5.png" alt="Shape" /></div>
                            <div className="shape"><img src="assets/images/about/shape6.png" alt="Shape" /></div>
                            <div className="shape"><img src="assets/images/about/shape7.png" alt="Shape" /></div>
                            <img src="assets/images/about/about.png" alt="About" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
        {/*  About Us Area end  */}
         
         
        
        <Destinations />

        
        
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
                                        <img src="assets/images/features/feature-author2.jpg" alt="Author" />
                                        <img src="assets/images/features/feature-author3.jpg" alt="Author" />
                                        <span>4k+</span>
                                    </div>
                                    <h6>850K+ Happy Customer</h6>
                                    <div className="divider style-two counter-text-wrap my-25"><span><span className="count-text plus" data-speed="3000" data-stop="25">0</span> Years</span></div>
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
                                        <h5><a href="tour-details.html">Tent Camping</a></h5>
                                        <p>Tent camping is wonderful way to connect with nature</p>
                                    </div>
                                </div>
                                <div className="feature-item">
                                    <div className="icon"><i className="flaticon-tent"></i></div>
                                    <div className="content">
                                        <h5><a href="tour-details.html">Kayaking</a></h5>
                                        <p>Kayaking is a thrilling outdoor activity that adventure</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="feature-item mt-20">
                                    <div className="icon"><i className="flaticon-tent"></i></div>
                                    <div className="content">
                                        <h5><a href="tour-details.html">Mountain Biking</a></h5>
                                        <p>Mountain biking is exhilarating sport that physical fitness</p>
                                    </div>
                                </div>
                                <div className="feature-item">
                                    <div className="icon"><i className="flaticon-tent"></i></div>
                                    <div className="content">
                                        <h5><a href="tour-details.html">Fishing & Boat</a></h5>
                                        <p>Fishing and boat bring joy quintessential activities that</p>
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

         
         
        {/*  Mobile App Area start  */}
        <section className="mobile-app-area py-100 rel z-1">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-5">
                        <div className="mobile-app-content rmb-55" data-aos="fade-left" data-aos-duration="1500" data-aos-offset="50">
                            <div className="section-title mb-30">
                                <h2>Get Our Mobile App – Available Now in the Store</h2>
                            </div>
                            <p>Our mission is to turn your travel aspirations into unforgettable experiences. With our mobile app, planning and booking your dream trip is easier than ever. From seamless navigation to tailored travel options, everything you need is just a tap away.</p>
                            <ul className="list-style-two mt-35 mb-30">
                                <li>Experience Agency</li>
                                <li>Professional Team</li>
                                <li>Low Cost Travel</li>
                                <li>Online Support 24/7</li>
                            </ul>
                            <div className="google-play-app-store">
                                <a href="#"><img src="assets/images/mobile-app/g-play.jpg" alt="Google Play" /></a>
                                <a href="#"><img src="assets/images/mobile-app/a-store.jpg" alt="App Store" /></a>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-7">
                        <div className="mobile-app-images">
                            <div className="bg"><img src="assets/images/mobile-app/phone-bg.png" alt="BG" /></div>
                            <div className="images">
                                <img src="assets/images/mobile-app/phone2.png" alt="Phone" data-aos="fade-down-left" data-aos-duration="1500" data-aos-offset="50" />
                                <img src="assets/images/mobile-app/phone.png" alt="Phone" />
                                <img src="assets/images/mobile-app/phone3.png" alt="Phone" data-aos="fade-up-right" data-aos-duration="1500" data-aos-offset="50" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        {/*  Mobile App Area end  */}
        
        
        {/*  Testimonials Area start  */}
        <section className="testimonials-area rel z-1">
            <div className="container">
                <div className="testimonials-wrap bgc-lighter">
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
                                        <div className="testi-header">
                                            <div className="quote"><i className="flaticon-double-quotes"></i></div>
                                            <h4>Quality Services</h4>
                                            <div className="ratting">
                                                <i className="fas fa-star"></i>
                                                <i className="fas fa-star"></i>
                                                <i className="fas fa-star"></i>
                                                <i className="fas fa-star"></i>
                                                <i className="fas fa-star"></i>
                                            </div>
                                        </div>
                                        <div className="text">"With Destino, I had the most incredible journey across Pakistan! From the stunning mountains to historic cities, everything was well-organized, and we enjoyed top-notch accommodations, delicious local food, and friendly guides who went above and beyond."</div>
                                        <div className="author">
                                            <div className="image"><img src="assets/images/testimonials/author.jpg" alt="Author" style={{ width: '100px' }} height="100px" /></div>
                                            <div className="content">
                                                <h5>Rizwan Ali</h5>
                                                <span>Graphics Designer</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="testimonial-item">
                                        <div className="testi-header">
                                            <div className="quote"><i className="flaticon-double-quotes"></i></div>
                                            <h4>Quality Services</h4>
                                            <div className="ratting">
                                                <i className="fas fa-star"></i>
                                                <i className="fas fa-star"></i>
                                                <i className="fas fa-star"></i>
                                                <i className="fas fa-star"></i>
                                                <i className="fas fa-star"></i>
                                            </div>
                                        </div>
                                        <div className="text">"Our trip was absolutely a perfect, thanks this travel agency! They took care of every detail, from to accommodations, and even suggested incredible experiences"</div>
                                        <div className="author">
                                            <div className="image"><img src="assets/images/testimonials/author.jpg" alt="Author" /></div>
                                            <div className="content">
                                                <h5>Randall V. Vasquez</h5>
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
                            <a href="tour-details.html" className="theme-btn style-two bgc-secondary">
                                <span data-hover="Explore Tours">Explore Tours</span>
                                <i className="fal fa-arrow-right"></i>
                            </a>
                        </div>
                    </div>
                    <div className="col-xl-4 col-md-6" data-aos="zoom-in-down" data-aos-delay="50" data-aos-duration="1500" data-aos-offset="50">
                        <div className="cta-item" style={{ backgroundImage: 'url(assets/images/cta/cta2.jpg)' }}>
                            <span className="category">Valley</span>
                            <h2>Neelum Valley, Kashmir</h2>
                            <a href="tour-details.html" className="theme-btn style-two">
                                <span data-hover="Explore Tours">Explore Tours</span>
                                <i className="fal fa-arrow-right"></i>
                            </a>
                        </div>
                    </div>
                    <div className="col-xl-4 col-md-6" data-aos="zoom-in-down" data-aos-delay="100" data-aos-duration="1500" data-aos-offset="50">
                        <div className="cta-item" style={{ backgroundImage: 'url(assets/images/cta/cta3.jpg)' }}>
                            <span className="category">Water Falls</span>
                            <h2>Shigar Valley Waterfalls, Skardu</h2>
                            <a href="tour-details.html" className="theme-btn style-two bgc-secondary">
                                <span data-hover="Explore Tours">Explore Tours</span>
                                <i className="fal fa-arrow-right"></i>
                            </a>
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
                                <a href="blog.html" className="category">Travel</a>
                                <h5><a href="blog-details.html">Ultimate Guide to Planning Your Dream Vacation with Destino Travel Agency</a></h5>
                                <ul className="blog-meta">
                                    <li><i className="far fa-calendar-alt"></i> <a href="#">25 December 2024</a></li>
                                    <li><i className="far fa-comments"></i> <a href="#">Comments (5)</a></li>
                                </ul>
                            </div>
                            <div className="image">
                                <img src="assets/images/blog/blog1.jpg" alt="Blog" />
                            </div>
                            <a href="blog-details.html" className="theme-btn">
                                <span data-hover="Book Now">Read More</span>
                                <i className="fal fa-arrow-right"></i>
                            </a>
                        </div>
                    </div>
                    <div className="col-xl-4 col-md-6">
                        <div className="blog-item" data-aos="fade-up" data-aos-delay="50" data-aos-duration="1500" data-aos-offset="50">
                            <div className="content">
                                <a href="blog.html" className="category">Travel</a>
                                <h5><a href="blog-details.html">Unforgettable Adventures Travel Agency Destino Bucket List Experiences</a></h5>
                                <ul className="blog-meta">
                                    <li><i className="far fa-calendar-alt"></i> <a href="#">25 December 2024</a></li>
                                    <li><i className="far fa-comments"></i> <a href="#">Comments (5)</a></li>
                                </ul>
                            </div>
                            <div className="image">
                                <img src="assets/images/blog/blog2.jpg" alt="Blog" />
                            </div>
                            <a href="blog-details.html" className="theme-btn">
                                <span data-hover="Book Now">Read More</span>
                                <i className="fal fa-arrow-right"></i>
                            </a>
                        </div>
                    </div>
                    <div className="col-xl-4 col-md-6">
                        <div className="blog-item" data-aos="fade-up" data-aos-delay="100" data-aos-duration="1500" data-aos-offset="50">
                            <div className="content">
                                <a href="blog.html" className="category">Travel</a>
                                <h5><a href="blog-details.html">Exploring Culture and way Cuisine Travel Agency's they Best Foodie Destinations</a></h5>
                                <ul className="blog-meta">
                                    <li><i className="far fa-calendar-alt"></i> <a href="#">25 December 2024</a></li>
                                    <li><i className="far fa-comments"></i> <a href="#">Comments (5)</a></li>
                                </ul>
                            </div>
                            <div className="image">
                                <img src="assets/images/blog/blog3.jpg" alt="Blog" />
                            </div>
                            <a href="blog-details.html" className="theme-btn">
                                <span data-hover="Book Now">Read More</span>
                                <i className="fal fa-arrow-right"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        {/*  Blog Area end  */}
          
           
        {/*  footer area start  */}
        <footer className="main-footer bgs-cover overlay rel z-1 pb-25" style={{ backgroundImage: 'url(assets/images/backgrounds/footer.jpg)' }}>
            <div className="container">
                <div className="footer-top pt-100 pb-30">
                    <div className="row justify-content-between">
                        <div className="col-xl-5 col-lg-6" data-aos="fade-up" data-aos-duration="1500" data-aos-offset="50">
                            <div className="footer-widget footer-text">
                                <div className="footer-logo mb-25">
                                    <a href="index-2.html"><img src="assets/images/logos/logo.png" alt="Logo" style={{ width: '200px' }} height="150px" /></a>
                                </div>
                                <p>We curate bespoke itineraries tailored to your preferences, ensuring every trip is seamless and enriching hidden gems beaten</p>
                                <div className="social-style-one mt-15">
                                    <a href="contact.html"><i className="fab fa-facebook-f"></i></a>
                                    <a href="contact.html"><i className="fab fa-youtube"></i></a>
                                    <a href="contact.html"><i className="fab fa-pinterest"></i></a>
                                    <a href="contact.html"><i className="fab fa-twitter"></i></a>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-5 col-lg-6" data-aos="fade-up" data-aos-delay="50" data-aos-duration="1500" data-aos-offset="50">
                            <div className="section-title counter-text-wrap mb-35">
                                <h2>Subscribe Newsletter</h2>
                                <p>One site <span className="count-text plus" data-speed="3000" data-stop="34500">0</span> most popular experience you’ll remember</p>
                            </div>
                            <form className="newsletter-form mb-50" action="#">
                                <input id="news-email" type="email" placeholder="Email Address" required />
                                <button type="submit" className="theme-btn bgc-secondary style-two">
                                    <span data-hover="Subscribe">Subscribe</span>
                                    <i className="fal fa-arrow-right"></i>
                                </button>
                            </form>
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
                                    <li><a href="destination-details.html">Best Tour Guide</a></li>
                                    <li><a href="destination-details.html">Tour Booking</a></li>
                                    <li><a href="destination-details.html">Hotel Booking</a></li>
                                    <li><a href="destination-details.html">Ticket Booking</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col col-small" data-aos="fade-up" data-aos-delay="50" data-aos-duration="1500" data-aos-offset="50">
                            <div className="footer-widget footer-links">
                                <div className="footer-title">
                                    <h5>Company</h5>
                                </div>
                                <ul className="list-style-three">
                                    <li><a href="about.html">About Company</a></li>
                                    <li><a href="contact.html">Jobs and Careers</a></li>
                                    <li><a href="blog.html">latest News Blog</a></li>
                                    <li><a href="contact.html">Contact Us</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col col-small" data-aos="fade-up" data-aos-delay="100" data-aos-duration="1500" data-aos-offset="50">
                            <div className="footer-widget footer-links">
                                <div className="footer-title">
                                    <h5>Destinations</h5>
                                </div>
                                <ul className="list-style-three">
                                    <li><a href="destination-details.html">Hunza Valley </a></li>
                                    <li><a href="destination-details.html">Skardu</a></li>
                                    <li><a href="destination-details.html">Swat Valley</a></li>
                                    <li><a href="destination-details.html">Fairy Meadows</a></li>

                                </ul>
                            </div>
                        </div>
                        <div className="col col-small" data-aos="fade-up" data-aos-delay="150" data-aos-duration="1500" data-aos-offset="50">
                            <div className="footer-widget footer-links">
                                <div className="footer-title">
                                    <h5>Categories</h5>
                                </div>
                                <ul className="list-style-three">
                                    <li><a href="contact.html">Adventure</a></li>
                                    <li><a href="contact.html">Hiking & Trekking</a></li>
                                    <li><a href="contact.html">Family Tours</a></li>
                                    <li><a href="contact.html">Wildlife Tours</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col col-md-6 col-10 col-small" data-aos="fade-up" data-aos-delay="200" data-aos-duration="1500" data-aos-offset="50">
                            <div className="footer-widget footer-contact">
                                <div className="footer-title">
                                    <h5>Get In Touch</h5>
                                </div>
                                <ul className="list-style-one">
                                    <li><i className="fal fa-map-marked-alt"></i> 578 Level, D-block 45 Street Lahore, Pakistan</li>
                                    <li><i className="fal fa-envelope"></i> <a href="ainazahid69@gmail.com">ainazahid69@gmail.com"</a></li>
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
                                <p><a href="index-2.html"></a> &copy; 2024 All rights reserved, <strong>Destino</strong></p>
                            </div>
                       </div>
                       <div className="col-lg-7 text-center text-lg-end">
                           <ul className="footer-bottom-nav">
                               <li><a href="about.html">Terms</a></li>
                               <li><a href="about.html">Privacy Policy</a></li>
                               <li><a href="about.html">Legal notice</a></li>
                               <li><a href="about.html">Accessibility</a></li>
                           </ul>
                       </div>
                    </div>
                    {/*  Scroll Top Button  */}
                    <button className="scroll-top scroll-to-target" data-target="html"><img src="assets/images/icons/scroll-up.png" alt="Scroll  Up" /></button>
                </div>
            </div>
        </footer>
        {/*  footer area end  */}

    </div>
    
  );
}

export default Home;
