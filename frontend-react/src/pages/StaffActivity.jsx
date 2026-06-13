import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const StaffActivity = () => {
    const { user } = useContext(AuthContext);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                const res = await fetch('/api/staff/activity', {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                const data = await res.json();
                setActivities(Array.isArray(data) ? data : []);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch activity", err);
                setLoading(false);
            }
        };
        fetchActivity();
    }, [user.token]);

    if (loading) return <div className="text-center py-50"><div className="spinner-border text-primary"></div></div>;

    return (
        <div className="staff-activity-container" style={{ background: '#f8fafc', padding: '30px', borderRadius: '12px' }}>
            <div style={{ marginBottom: '30px' }}>
                <h3 style={{ margin: '0 0 5px 0', color: '#1e293b' }}><i className="fas fa-history text-primary"></i> My Work Log & Activity Timeline</h3>
                <p style={{ color: '#64748b', margin: 0 }}>A chronological log of your recent interactions, completed tasks, and system activities.</p>
            </div>

            {activities.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '50px', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <i className="far fa-clock" style={{ fontSize: '40px', color: '#cbd5e1', marginBottom: '15px' }}></i>
                    <p style={{ color: '#64748b' }}>No recent activity found. Your work log is empty.</p>
                </div>
            ) : (
                <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                    <div style={{ position: 'relative', borderLeft: '2px solid #e2e8f0', marginLeft: '20px', paddingLeft: '30px' }}>
                        {activities.map((act, index) => (
                            <div key={act.id || index} style={{ marginBottom: index === activities.length - 1 ? 0 : '30px', position: 'relative' }}>
                                {/* Timeline Dot */}
                                <div style={{ 
                                    position: 'absolute', 
                                    left: '-47px', 
                                    top: '0', 
                                    width: '32px', 
                                    height: '32px', 
                                    borderRadius: '50%', 
                                    background: act.color, 
                                    color: '#fff', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    boxShadow: '0 0 0 4px #fff'
                                }}>
                                    <i className={`fas ${act.icon}`} style={{ fontSize: '14px' }}></i>
                                </div>
                                
                                {/* Activity Content */}
                                <div>
                                    <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
                                        {new Date(act.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                    </span>
                                    <h5 style={{ margin: '0 0 5px 0', color: '#334155', fontSize: '16px' }}>{act.title}</h5>
                                    <span style={{ display: 'inline-block', padding: '2px 8px', background: `${act.color}15`, color: act.color, borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                                        {act.type}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default StaffActivity;
