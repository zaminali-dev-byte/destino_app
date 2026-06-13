import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AdminOverview = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user && user.token) {
            fetch('/api/admin/stats', {
                headers: { 'Authorization': `Bearer ${user.token}` }
            })
            .then(res => res.json())
            .then(data => {
                setStats(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch admin stats", err);
                setLoading(false);
            });
        }
    }, [user]);

    if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading enterprise metrics...</div>;
    if (!stats) return <div style={{ padding: '50px', textAlign: 'center' }}>Failed to load metrics.</div>;

    const topCards = [
        { label: 'Total Revenue', value: `US$${(stats.revenue || 0).toLocaleString()}`, icon: 'fa-dollar-sign', color: '#10b981', bg: '#d1fae5' },
        { label: 'Total Bookings', value: stats.bookings || 0, icon: 'fa-calendar-check', color: '#3b82f6', bg: '#dbeafe' },
        { label: 'Active Users', value: stats.users || 0, icon: 'fa-users', color: '#8b5cf6', bg: '#ede9fe' },
        { label: 'New Complaints', value: stats.complaints || 0, icon: 'fa-exclamation-triangle', color: '#ef4444', bg: '#fee2e2' },
    ];

    const secondaryCards = [
        { label: 'Tours', value: stats.tours || 0, icon: 'fa-map' },
        { label: 'Hotels', value: stats.hotels || 0, icon: 'fa-building' },
        { label: 'Packages', value: stats.packages || 0, icon: 'fa-suitcase' },
        { label: 'Destinations', value: stats.destinations || 0, icon: 'fa-map-marker-alt' },
        { label: 'Staff Members', value: stats.staff || 0, icon: 'fa-id-badge' },
        { label: 'Pending Hires', value: stats.pendingApplications || 0, icon: 'fa-user-tie' },
    ];

    // Mock data for charts - in Phase 2 this will come from the backend
    const revenueData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'Revenue (USD)',
                data: stats.monthlyRevenueData && stats.monthlyRevenueData.length > 0 
                      ? stats.monthlyRevenueData 
                      : [12000, 19000, 15000, 25000, 22000, 30000, 28000, 32000, 29000, 35000, 40000, 45000],
                borderColor: '#4f46e5',
                backgroundColor: 'rgba(79, 70, 229, 0.1)',
                fill: true,
                tension: 0.4,
            }
        ]
    };

    const bookingsData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Total Bookings',
                data: stats.monthlyBookingsData && stats.monthlyBookingsData.length > 0
                      ? stats.monthlyBookingsData
                      : [65, 59, 80, 81, 56, 55],
                backgroundColor: '#3b82f6',
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top' }
        },
        scales: {
            y: { beginAtZero: true, grid: { borderDash: [2, 4] } },
            x: { grid: { display: false } }
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '24px' }}>Business Overview</h3>
                    <p style={{ margin: 0, color: 'var(--admin-text-muted)' }}>Real-time analytics and system metrics.</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn-secondary" onClick={() => window.print()}>
                        <i className="fas fa-print"></i> Export Report
                    </button>
                    <button className="btn-primary">
                        <i className="fas fa-download"></i> Download CSV
                    </button>
                </div>
            </div>

            <div className="overview-grid">
                {topCards.map((card, i) => (
                    <div key={i} className="stat-card">
                        <div className="stat-card-info">
                            <p>{card.label}</p>
                            <h4>{card.value}</h4>
                        </div>
                        <div className="stat-card-icon" style={{ background: card.bg, color: card.color }}>
                            <i className={`fas ${card.icon}`}></i>
                        </div>
                    </div>
                ))}
            </div>

            <div className="charts-grid">
                <div className="chart-card">
                    <div className="chart-header">
                        <h3>Revenue Overview</h3>
                        <select className="form-control" style={{ width: 'auto' }}>
                            <option>Last 7 Months</option>
                            <option>This Year</option>
                        </select>
                    </div>
                    <div className="chart-container">
                        <Line data={revenueData} options={chartOptions} />
                    </div>
                </div>
                <div className="chart-card">
                    <div className="chart-header">
                        <h3>Bookings by Category</h3>
                    </div>
                    <div className="chart-container">
                        <Bar data={bookingsData} options={{...chartOptions, scales: { x: { stacked: true }, y: { stacked: true } }}} />
                    </div>
                </div>
            </div>

            <div className="overview-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
                {secondaryCards.map((card, i) => (
                    <div key={i} className="stat-card" style={{ padding: '16px' }}>
                        <div className="stat-card-info">
                            <p style={{ fontSize: '12px' }}>{card.label}</p>
                            <h4 style={{ fontSize: '20px' }}>{card.value}</h4>
                        </div>
                        <div style={{ fontSize: '24px', color: 'var(--admin-border)' }}>
                            <i className={`fas ${card.icon}`}></i>
                        </div>
                    </div>
                ))}
            </div>

            <div className="chart-card" style={{ marginTop: '32px' }}>
                <div className="chart-header">
                    <h3>Recent System Activity</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {stats.recentActivity && stats.recentActivity.length > 0 ? (
                        stats.recentActivity.map((activity, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', paddingBottom: '16px', borderBottom: idx !== stats.recentActivity.length - 1 ? '1px solid var(--admin-border)' : 'none' }}>
                                <div style={{ 
                                    width: '40px', height: '40px', borderRadius: '50%', 
                                    background: activity.type === 'Booking' ? '#dbeafe' : '#ede9fe',
                                    color: activity.type === 'Booking' ? '#3b82f6' : '#8b5cf6',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <i className={activity.type === 'Booking' ? 'fas fa-calendar-check' : 'fas fa-user'}></i>
                                </div>
                                <div>
                                    <p style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '500', color: 'var(--admin-text-main)' }}>
                                        {activity.message}
                                    </p>
                                    <p style={{ margin: 0, fontSize: '12px', color: 'var(--admin-text-muted)' }}>
                                        {new Date(activity.date).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p style={{ color: 'var(--admin-text-muted)' }}>No recent activity to show.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminOverview;
