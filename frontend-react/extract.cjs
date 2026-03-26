const fs = require('fs');
const path = require('path');

let appJsx = fs.readFileSync('src/App.jsx', 'utf8');

// The replacement ranges
const destStartStr = '{/*  Popular Destinations Area start  */}';
const destEndStr = '{/*  Popular Destinations Area end  */}';
const hotelStartStr = '{/*  Hotel Area start  */}';
const hotelEndStr = '{/*  Hotel Area end  */}';

const destStart = appJsx.indexOf(destStartStr);
const destEnd = appJsx.indexOf(destEndStr) + destEndStr.length;

const hotelStart = appJsx.indexOf(hotelStartStr);
const hotelEnd = appJsx.indexOf(hotelEndStr) + hotelEndStr.length;

const destinationsHtml = appJsx.substring(destStart, destEnd);
const hotelsHtml = appJsx.substring(hotelStart, hotelEnd);

appJsx = appJsx.substring(0, destStart) + '\n        <Destinations />\n' + appJsx.substring(destEnd, hotelStart) + '\n        <Hotels />\n' + appJsx.substring(hotelEnd);

// Write components
const destComponent = `import React, { useEffect, useState } from 'react';

const Destinations = () => {
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/api/destinations')
      .then(res => res.json())
      .then(data => setDestinations(data))
      .catch(err => console.error("Error fetching destinations:", err));
  }, []);

  return (
    <section className="popular-destinations-area rel z-1">
        <div className="container-fluid">
            <div className="popular-destinations-wrap br-20 bgc-lighter pt-100 pb-70">
                <div className="row justify-content-center">
                    <div className="col-lg-12">
                        <div className="section-title text-center counter-text-wrap mb-70" data-aos="fade-up" data-aos-duration="1500" data-aos-offset="50">
                            <h2>Explore Popular Destinations</h2>
                            <p>One site <span className="count-text plus" data-speed="3000" data-stop="345">0</span> most popular experience</p>
                        </div>
                    </div>
                </div>
                <div className="container">
                    <div className="row justify-content-center">
                        {destinations.map((dest, i) => (
                            <div className={i === 2 || i === 3 ? "col-md-6" : "col-xl-3 col-md-6"} key={dest._id || i}>
                                <div className="destination-item style-two" data-aos="flip-up" data-aos-delay={i % 2 === 0 ? "0" : "100"} data-aos-duration="1500" data-aos-offset="50">
                                    <div className="image">
                                        <a href="#" className="heart"><i className="fas fa-heart"></i></a>
                                        <img src={dest.image} alt={dest.name} style={i === 3 ? { width: '600px', height: '350px' } : undefined} />
                                    </div>
                                    <div className="content">
                                        <h6><a href={dest.link}>{dest.name}</a></h6>
                                        <span className="time">{dest.toursCount}+ tours & {dest.activityCount}+ Activity</span>
                                        <a href="#" className="more"><i className="fas fa-chevron-right"></i></a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
};

export default Destinations;
`;

const hotelComponent = `import React, { useEffect, useState } from 'react';

const Hotels = () => {
    const [hotels, setHotels] = useState([]);

    useEffect(() => {
        fetch('http://localhost:4000/api/hotels')
            .then(res => res.json())
            .then(data => setHotels(data))
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
                                            <h5><a href={"#"}>{hotel.name}</a></h5>
                                            <ul className="list-style-one">
                                                <li><i className="fal fa-bed-alt"></i> {hotel.bedrooms}</li>
                                                <li><i className="fal fa-hat-chef"></i> {hotel.kitchens}</li>
                                                <li><i className="fal fa-bath"></i> {hotel.bathrooms}</li>
                                                <li><i className="fal fa-router"></i> {hotel.amenities}</li>
                                            </ul>
                                            <div className="destination-footer">
                                                <span className="price"><span>{hotel.priceInfo}</span>/per night</span>
                                                <a href="#" className="read-more">Book Now <i className="fal fa-angle-right"></i></a>
                                            </div>
                                        </div>
                                        <div className="image">
                                            <div className="ratting"><i className="fas fa-star"></i> {hotel.rating}</div>
                                            <a href="#" className="heart"><i className="fas fa-heart"></i></a>
                                            <img src={hotel.image} alt="Hotel" />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="image">
                                            <div className="ratting"><i className="fas fa-star"></i> {hotel.rating}</div>
                                            <a href="#" className="heart"><i className="fas fa-heart"></i></a>
                                            <img src={hotel.image} alt="Hotel" />
                                        </div>
                                        <div className="content">
                                            <span className="location"><i className="fal fa-map-marker-alt"></i> {hotel.location}</span>
                                            <h5><a href="destination-details.html">{hotel.name}</a></h5>
                                            <ul className="list-style-one">
                                                <li><i className="fal fa-bed-alt"></i> {hotel.bedrooms}</li>
                                                <li><i className="fal fa-hat-chef"></i> {hotel.kitchens}</li>
                                                <li><i className="fal fa-bath"></i> {hotel.bathrooms}</li>
                                                <li><i className="fal fa-router"></i> {hotel.amenities}</li>
                                            </ul>
                                            <div className="destination-footer">
                                                <span className="price"><span>{hotel.priceInfo}</span>/per night</span>
                                                <a href="#" className="read-more">Book Now <i className="fal fa-angle-right"></i></a>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="hotel-more-btn text-center mt-40">
                    <a href="destination2.html" className="theme-btn style-four">
                        <span data-hover="Explore More Hotel">Explore More Hotel</span>
                        <i className="fal fa-arrow-right"></i>
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Hotels;
`;

// Make sure components directory exists
if (!fs.existsSync('src/components')){
    fs.mkdirSync('src/components');
}

fs.writeFileSync('src/components/Destinations.jsx', destComponent);
fs.writeFileSync('src/components/Hotels.jsx', hotelComponent);

// Inject Imports into App.jsx
appJsx = "import Destinations from './components/Destinations';\nimport Hotels from './components/Hotels';\n" + appJsx;

fs.writeFileSync('src/App.jsx', appJsx);
console.log("Components extracted successfully.");
