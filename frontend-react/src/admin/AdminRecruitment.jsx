import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const AdminRecruitment = () => {
    const { user } = useContext(AuthContext);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user && user.token) {
            fetch('/api/applications', {
                headers: { 'Authorization': `Bearer ${user.token}` }
            })
            .then(res => res.json())
            .then(data => {
                setApplications(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch applications", err);
                setLoading(false);
            });
        }
    }, [user]);

    const handleAction = (id, actionType) => {
        const actionText = actionType === 'hire' ? 'Hire this applicant? They will be granted an active Staff account.' : 'Reject this applicant?';
        if (!window.confirm(actionText)) return;

        fetch(`/api/applications/${id}/${actionType}`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${user.token}` }
        })
        .then(res => res.json())
        .then(data => {
            alert(data.message);
            // Update local state
            setApplications(applications.map(app => {
                if (app._id === id) {
                    return { ...app, status: actionType === 'hire' ? 'Hired' : 'Rejected' };
                }
                return app;
            }));
        })
        .catch(err => alert("Action failed"));
    };

    if (loading) return <div style={{ padding: '20px' }}>Loading applications...</div>;

    return (
        <div style={{ padding: '20px' }}>
            <h3 style={{ marginBottom: '20px', color: '#333' }}>Staff Recruitment Center</h3>

            {applications.length === 0 ? (
                <p>No job applications found.</p>
            ) : (
                <div style={{ display: 'grid', gap: '20px' }}>
                    {applications.map(app => (
                        <div key={app._id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', background: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '15px' }}>
                                <div>
                                    <h4 style={{ margin: '0 0 5px 0', fontSize: '20px' }}>{app.name}</h4>
                                    <p style={{ margin: 0, color: '#666' }}>{app.email} &nbsp;|&nbsp; {app.phone}</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{ 
                                        display: 'inline-block', padding: '5px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold',
                                        background: app.status === 'Pending' ? '#fff3cd' : (app.status === 'Hired' ? '#d4edda' : '#f8d7da'),
                                        color: app.status === 'Pending' ? '#856404' : (app.status === 'Hired' ? '#155724' : '#721c24')
                                    }}>
                                        {app.status}
                                    </span>
                                    <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#999' }}>Applied: {new Date(app.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                                <div>
                                    <strong style={{ display: 'block', fontSize: '13px', color: '#777', textTransform: 'uppercase' }}>Education</strong>
                                    <p style={{ margin: '5px 0 0 0' }}>{app.education}</p>
                                </div>
                                <div>
                                    <strong style={{ display: 'block', fontSize: '13px', color: '#777', textTransform: 'uppercase' }}>Licenses / Certifications</strong>
                                    <p style={{ margin: '5px 0 0 0' }}>{app.license || 'N/A'}</p>
                                </div>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <strong style={{ display: 'block', fontSize: '13px', color: '#777', textTransform: 'uppercase' }}>CNIC</strong>
                                    <p style={{ margin: '5px 0 0 0', fontFamily: 'monospace', fontSize: '15px' }}>{app.cnic}</p>
                                </div>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <strong style={{ display: 'block', fontSize: '13px', color: '#777', textTransform: 'uppercase' }}>Cover Letter / Experience</strong>
                                    <p style={{ margin: '5px 0 0 0', background: '#f9f9f9', padding: '15px', borderRadius: '4px', fontStyle: 'italic', fontSize: '14px' }}>
                                        {app.coverLetter || 'No cover letter provided.'}
                                    </p>
                                </div>
                            </div>

                            {app.status === 'Pending' && (
                                <div style={{ display: 'flex', gap: '10px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                                    <button onClick={() => handleAction(app._id, 'hire')} className="theme-btn style-zero" style={{ background: '#28a745', color: 'white', padding: '8px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                                        <i className="fas fa-check-circle" style={{ marginRight: '5px' }}></i> HIRE APPLICANT
                                    </button>
                                    <button onClick={() => handleAction(app._id, 'reject')} className="theme-btn style-zero" style={{ background: '#dc3545', color: 'white', padding: '8px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                        <i className="fas fa-times-circle" style={{ marginRight: '5px' }}></i> Reject
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminRecruitment;
