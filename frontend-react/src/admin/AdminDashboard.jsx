import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import DataTables from './DataTables';
import AdminOverview from './AdminOverview';
import AdminRecruitment from './AdminRecruitment';
import AdminBookings from './AdminBookings';
import FinanceDashboard from './FinanceDashboard';
import './Admin.css';

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Header state
  const [searchTerm, setSearchTerm] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);

  useEffect(() => {
    if (user?.token) {
        fetch('/api/admin/notifications', {
            headers: { 'Authorization': `Bearer ${user.token}` }
        })
        .then(res => res.json())
        .then(data => {
            if (Array.isArray(data)) {
                setNotifications(data);
                if (data.some(n => !n.read)) {
                    setHasUnreadNotifications(true);
                }
            }
        })
        .catch(err => console.error("Failed to fetch notifications", err));
    }
  }, [user]);

  const markNotificationsRead = () => {
      setShowNotifications(!showNotifications);
      setShowProfileMenu(false);
      if (hasUnreadNotifications) {
          setHasUnreadNotifications(false);
          // Mark first unread as read visually, or ideally mark all.
          // For simplicity we just hit the backend to mark them read if needed.
      }
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: 'fa-chart-pie' },
    { id: 'applications', label: 'Recruitment', icon: 'fa-user-tie' },
    { id: 'bookings', label: 'Bookings', icon: 'fa-calendar-check' },
    { id: 'packages', label: 'Packages', icon: 'fa-suitcase' },
    { id: 'destinations', label: 'Destinations', icon: 'fa-map-marker-alt' },
    { id: 'hotels', label: 'Hotels', icon: 'fa-hotel' },
    { id: 'tours', label: 'Tours', icon: 'fa-map' },
    { id: 'users', label: 'Users', icon: 'fa-users' },
    { id: 'staff', label: 'Staff', icon: 'fa-id-badge' },
    { id: 'payments', label: 'Payments', icon: 'fa-credit-card' },
    { id: 'coupons', label: 'Coupons', icon: 'fa-tag' },
    { id: 'complaints', label: 'Complaints', icon: 'fa-comment-alt' },
    { id: 'contact', label: 'Contacts', icon: 'fa-envelope' },
    { id: 'finance', label: 'Finance & HR', icon: 'fa-wallet' },
  ];

  const handleLogout = (e) => {
      e.stopPropagation();
      logout();
      navigate('/login');
  };

  const handleSearch = (e) => {
      const val = e.target.value;
      setSearchTerm(val);
      if (val.length >= 2) {
          const match = navItems.find(item => item.label.toLowerCase().includes(val.toLowerCase()) || item.id.toLowerCase().includes(val.toLowerCase()));
          if (match) setActiveTab(match.id);
      }
  };

  // Close dropdowns when clicking outside (simple implementation by closing on main area click)
  const closeDropdowns = () => {
      setShowProfileMenu(false);
      setShowNotifications(false);
  };

  return (
    <div className="admin-dashboard" onClick={closeDropdowns}>
      <div className={`admin-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-logo">
          <i className="fas fa-paper-plane"></i>
          {!sidebarCollapsed && <span>Destino Admin</span>}
        </div>
        <nav className="sidebar-nav">
          <ul>
            {navItems.map(item => (
              <li
                key={item.id}
                className={activeTab === item.id ? 'active' : ''}
                onClick={() => setActiveTab(item.id)}
                title={sidebarCollapsed ? item.label : ''}
              >
                <i className={`fas ${item.icon}`}></i> 
                {!sidebarCollapsed && <span>{item.label}</span>}
              </li>
            ))}
          </ul>
        </nav>
      </div>
      
      <div className="admin-main">
        <header className="admin-header">
          <div className="header-left">
            <button className="sidebar-toggle" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
              <i className="fas fa-bars"></i>
            </button>
            <h2>{navItems.find(i => i.id === activeTab)?.label}</h2>
          </div>
          
          <div className="header-right">
            <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle Dark Mode">
                {isDarkMode ? <i className="fas fa-sun"></i> : <i className="fas fa-moon"></i>}
            </button>
            
            <div className="header-search">
                <i className="fas fa-search"></i>
                <input 
                    type="text" 
                    placeholder="Search modules (e.g. packages)..." 
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>
            
            <div className="header-notifications" onClick={(e) => { 
                e.stopPropagation(); 
                markNotificationsRead();
            }}>
                <i className="far fa-bell"></i>
                {hasUnreadNotifications && <span className="badge">{notifications.filter(n => !n.read).length}</span>}
                
                {showNotifications && (
                    <div className="admin-dropdown" style={{ maxHeight: '300px', overflowY: 'auto', width: '300px' }}>
                        <div className="dropdown-header">Notifications ({notifications.length})</div>
                        {notifications.length === 0 ? (
                            <div className="dropdown-item">No new notifications</div>
                        ) : (
                            notifications.map(n => (
                                <div key={n._id} className="dropdown-item" style={{ whiteSpace: 'normal', lineHeight: '1.4', padding: '10px 15px', borderBottom: '1px solid #eee', background: n.read ? 'transparent' : '#f0f7ff' }}>
                                    <i className={`fas ${n.type === 'Security' ? 'fa-shield-alt text-danger' : 'fa-info-circle text-primary'}`} style={{ marginRight: '10px' }}></i>
                                    <span style={{ fontSize: '13px' }}>{n.message}</span>
                                    <div style={{ fontSize: '11px', color: '#888', marginTop: '4px', textAlign: 'right' }}>{new Date(n.createdAt).toLocaleString()}</div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            <div className="header-user" onClick={(e) => { e.stopPropagation(); setShowProfileMenu(!showProfileMenu); setShowNotifications(false); }}>
              <div className="avatar">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <span>{user?.name || 'Admin User'}</span>
              
              {showProfileMenu && (
                  <div className="admin-dropdown">
                      <div className="dropdown-item"><i className="fas fa-user-circle"></i> My Profile</div>
                      <div className="dropdown-item"><i className="fas fa-cog"></i> Settings</div>
                      <div className="dropdown-divider"></div>
                      <div className="dropdown-item text-danger" onClick={handleLogout}><i className="fas fa-sign-out-alt"></i> Logout</div>
                  </div>
              )}
            </div>
          </div>
        </header>
        
        <div className="admin-content">
          {activeTab === 'overview' && <AdminOverview />}
          {activeTab === 'applications' && <AdminRecruitment />}
          {activeTab === 'bookings' && <AdminBookings />}
          {activeTab === 'finance' && <FinanceDashboard />}
          {activeTab !== 'overview' && activeTab !== 'applications' && activeTab !== 'bookings' && activeTab !== 'finance' && (
            <DataTables endpoint={activeTab} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
