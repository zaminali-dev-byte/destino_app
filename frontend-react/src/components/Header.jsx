import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import './Header.css';

function Header() {
    const { user, logout } = useContext(AuthContext);
    const { isDarkMode, toggleTheme } = useContext(ThemeContext);
    const location = useLocation();
    
    const [tours, setTours] = useState([]);
    const [destinations, setDestinations] = useState([]);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [resTours, resDest] = await Promise.all([
                    fetch('/api/tours'),
                    fetch('/api/destinations')
                ]);
                
                if (resTours.ok) {
                    const toursData = await resTours.json();
                    setTours(toursData.slice(0, 6)); // Top 6 active tours
                }
                
                if (resDest.ok) {
                    const destData = await resDest.json();
                    setDestinations(destData.slice(0, 6)); // Top 6 active destinations
                }
            } catch (err) {
                console.error("Failed to fetch dynamic header data", err);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        setIsMobileMenuOpen(false); // Close menu on route change
    }, [location]);

    return (
        <header className="custom-app-header">
            <div className="header-pill">
                <div className="logo-container">
                    <a href="/">
                        <img src="/assets/images/logos/logo.png" alt="Destino" className="header-logo" style={{ filter: isDarkMode ? 'brightness(0) invert(1)' : 'none' }}/>
                    </a>
                </div>

                <button className="mobile-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    <i className={isMobileMenuOpen ? "fal fa-times" : "fal fa-bars"}></i>
                </button>

                <nav className={`header-nav ${isMobileMenuOpen ? 'open' : ''}`}>
                    <ul className="nav-list">
                        <li><a href="/" className={location.pathname === '/' ? 'active' : ''}>Home</a></li>
                        <li><a href="/about" className={location.pathname === '/about' ? 'active' : ''}>About</a></li>
                        
                        <li className="nav-dropdown">
                            <a href="/tours" className="dropdown-label">Tours <i className="fal fa-chevron-down dropdown-arrow"></i></a>
                            <ul className="dropdown-menu">
                                {tours.map(t => (
                                    <li key={t._id}><Link to={`/tour-details/${t._id}`}>{t.title}</Link></li>
                                ))}
                                <li><Link to="/search" className="view-all-link">View All Tours</Link></li>
                            </ul>
                        </li>

                        <li className="nav-dropdown">
                            <a href="/destinations" className="dropdown-label">Destinations <i className="fal fa-chevron-down dropdown-arrow"></i></a>
                            <ul className="dropdown-menu">
                                {destinations.map(d => (
                                    <li key={d._id}><Link to={`/search?q=${d.name}`}>{d.name}</Link></li>
                                ))}
                                <li><Link to="/destinations" className="view-all-link">Explore the World</Link></li>
                            </ul>
                        </li>

                        <li>
                            <Link to="/ai-builder" className={location.pathname === '/ai-builder' ? 'active' : ''}>
                                <i className="fas fa-magic text-warning me-1"></i> AI Builder
                            </Link>
                        </li>

                        <li><a href="/blog" className={location.pathname === '/blog' ? 'active' : ''}>Blog</a></li>
                        <li><a href="/contact" className={location.pathname === '/contact' ? 'active' : ''}>Contact</a></li>
                    </ul>

                    <div className="header-actions">
                        <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle Dark Mode">
                            {isDarkMode ? <i className="fas fa-sun"></i> : <i className="fas fa-moon"></i>}
                        </button>

                        {user ? (
                            <>
                                <Link to={user.role === 'admin' ? '/admin' : user.role === 'staff' ? '/staff' : '/dashboard'} className="auth-btn dashboard-btn">
                                    Dashboard
                                </Link>
                                <button onClick={logout} className="auth-btn logout-btn">Logout</button>
                            </>
                        ) : (
                            <>
                                <a href="/login" className="auth-btn login-btn">Login</a>
                                <a href="/register" className="auth-btn register-btn">Register</a>
                            </>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    );
}

export default Header;
