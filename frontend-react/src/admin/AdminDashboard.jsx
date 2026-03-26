import React, { useState } from 'react';
import DataTables from './DataTables';
import './Admin.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('packages');

  const navItems = [
    { id: 'packages', label: 'Packages', icon: 'fa-suitcase' },
    { id: 'destinations', label: 'Destinations', icon: 'fa-map-marker-alt' },
    { id: 'hotels', label: 'Hotels', icon: 'fa-hotel' },
    { id: 'bookings', label: 'Bookings', icon: 'fa-calendar-check' },
    { id: 'users', label: 'Users', icon: 'fa-users' },
  ];

  return (
    <div className="admin-dashboard">
      <div className="admin-sidebar">
        <div className="sidebar-logo">
          <h2>Destino Admin</h2>
        </div>
        <nav className="sidebar-nav">
          <ul>
            {navItems.map(item => (
              <li 
                key={item.id} 
                className={activeTab === item.id ? 'active' : ''}
                onClick={() => setActiveTab(item.id)}
              >
                <i className={`fas ${item.icon}`}></i> {item.label}
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="admin-main">
        <header className="admin-header">
          <h2>Dashboard / {navItems.find(i => i.id === activeTab).label}</h2>
          <div className="header-user">
            <span>Admin User</span>
            <div className="avatar"><i className="fas fa-user-circle"></i></div>
          </div>
        </header>
        <div className="admin-content">
          <DataTables endpoint={activeTab} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
