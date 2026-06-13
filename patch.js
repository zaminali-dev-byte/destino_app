const fs = require('fs');

const p = 'c:\\Users\\ELITE BOOK\\Desktop\\html\\frontend-react\\src\\pages\\Home.jsx';
let content = fs.readFileSync(p, 'utf8');

// 1. Add useState
content = content.replace(
    "import Hotels from '../components/Hotels';\r\nimport React from 'react';\r\n\r\nfunction Home() {",
    "import Hotels from '../components/Hotels';\r\nimport React, { useState } from 'react';\r\n\r\nfunction Home() {\r\n  const [searchQuery, setSearchQuery] = useState('');\r\n  const [inputText, setInputText] = useState('');"
);

// 2. Replace Destinations
content = content.replace("<Destinations />", "<Destinations query={searchQuery} />");

// 3. Replace the search filter inner
const searchFilterOriginal = `                <div className="search-filter-inner" data-aos="zoom-out-down" data-aos-duration="1500" data-aos-offset="50">
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
                </div>`;

const searchFilterNew = `                <div className="search-filter-inner" data-aos="zoom-out-down" data-aos-duration="1500" data-aos-offset="50">
                    <div className="filter-item clearfix" style={{ flexGrow: 1 }}>
                        <div className="icon"><i className="fal fa-search"></i></div>
                        <span className="title">Search Destinations</span>
                        <input 
                            type="text" 
                            placeholder="Where are you going?" 
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '18px', paddingTop: '10px' }}
                        />
                    </div>
                    <div className="search-button">
                        <button className="theme-btn" onClick={() => setSearchQuery(inputText)}>
                            <span data-hover="Search">Search</span>
                            <i className="far fa-search"></i>
                        </button>
                    </div>
                </div>`;

const lines = content.split('\n');
lines.splice(183, 44, searchFilterNew);

fs.writeFileSync(p, lines.join('\n'));
console.log('patched');
