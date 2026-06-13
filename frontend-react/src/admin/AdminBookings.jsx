import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const AdminBookings = () => {
    const { user } = useContext(AuthContext);
    const [bookings, setBookings] = useState([]);
    const [staffList, setStaffList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [assigning, setAssigning] = useState(null); // bookingId being assigned

    useEffect(() => {
        if (!user?.token) return;
        Promise.all([
            fetch('/api/bookings', { headers: { Authorization: `Bearer ${user.token}` } }).then(r => r.json()),
            fetch('/api/users', { headers: { Authorization: `Bearer ${user.token}` } }).then(r => r.json())
        ]).then(([bookingsData, usersData]) => {
            setBookings(Array.isArray(bookingsData) ? bookingsData : []);
            // Filter only staff users for assigning
            setStaffList(Array.isArray(usersData) ? usersData.filter(u => u.role === 'staff') : []);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, [user]);

    const handleAssignStaff = async (bookingId, staffId) => {
        if (!staffId) return;
        setAssigning(bookingId);
        try {
            const res = await fetch(`/api/bookings/${bookingId}/assign-staff`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                },
                body: JSON.stringify({ staffId: staffId === 'none' ? null : staffId })
            });
            const updated = await res.json();
            if (res.ok) {
                setBookings(bookings.map(b => b._id === bookingId ? { ...b, assignedStaff: updated.assignedStaff } : b));
            } else {
                alert(updated.message || 'Failed to assign staff');
            }
        } catch (e) {
            alert('Error assigning staff');
        }
        setAssigning(null);
    };

    const handleStatusUpdate = async (bookingId, status) => {
        try {
            const res = await fetch(`/api/bookings/${bookingId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
                body: JSON.stringify({ status })
            });
            const updated = await res.json();
            if (res.ok) {
                setBookings(bookings.map(b => b._id === bookingId ? { ...b, status: updated.status } : b));
            }
        } catch (e) {
            alert('Error updating status');
        }
    };

    if (loading) return <div style={{ padding: '30px' }}>Loading bookings...</div>;

    const statusColors = {
        Pending: { bg: '#fff3cd', color: '#856404' },
        Confirmed: { bg: '#d4edda', color: '#155724' },
        Cancelled: { bg: '#f8d7da', color: '#721c24' }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h3 style={{ marginBottom: '5px', color: '#333' }}>Manage Bookings</h3>
            <p style={{ color: '#888', marginBottom: '20px', fontSize: '14px' }}>
                {bookings.length} bookings found — Assign Staff Guides & manage status
            </p>

            {bookings.length === 0 ? (
                <p>No bookings found in the database.</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {bookings.map(b => {
                        const sc = statusColors[b.status] || statusColors.Pending;
                        return (
                            <div key={b._id} style={{ background: '#fff', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 6px rgba(0,0,0,0.08)', borderLeft: '4px solid #0071c2' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                                    <div>
                                        <h4 style={{ margin: '0 0 6px 0', fontSize: '16px', color: '#222' }}>
                                            {b.customerName}
                                            <span style={{ fontSize: '12px', color: '#777', marginLeft: '10px' }}>{b.email}</span>
                                        </h4>
                                        <p style={{ margin: '2px 0', fontSize: '13px', color: '#555' }}>
                                            <strong>Date:</strong> {b.date ? new Date(b.date).toLocaleDateString() : 'N/A'} &nbsp;|&nbsp;
                                            <strong>Guests:</strong> {b.guests} &nbsp;|&nbsp;
                                            <strong>Tour:</strong> {b.tourId?.title || b.destinationId?.name || 'N/A'}
                                        </p>
                                    </div>
                                    <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', background: sc.bg, color: sc.color }}>
                                        {b.status}
                                    </span>
                                </div>

                                <div style={{ marginTop: '15px', display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center' }}>
                                    {/* Staff Assignment */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f0f7ff', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cde4f5' }}>
                                        <i className="fas fa-id-badge" style={{ color: '#0071c2' }}></i>
                                        <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#0071c2', marginBottom: 0 }}>Assign Guide/Driver:</label>
                                        <select
                                            defaultValue={b.assignedStaff?._id || b.assignedStaff || 'none'}
                                            onChange={e => handleAssignStaff(b._id, e.target.value)}
                                            disabled={assigning === b._id}
                                            style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '4px 8px', fontSize: '13px', background: '#fff' }}
                                        >
                                            <option value="none">— None —</option>
                                            {staffList.map(s => (
                                                <option key={s._id} value={s._id}>{s.name} ({s.vehicleNumber || 'No vehicle'})</option>
                                            ))}
                                        </select>
                                        {assigning === b._id && <span style={{ fontSize: '11px', color: '#888' }}>Saving...</span>}
                                        {b.assignedStaff && (
                                            <span style={{ fontSize: '11px', color: '#28a745', fontWeight: 'bold' }}>
                                                ✓ {b.assignedStaff.name || 'Assigned'}
                                            </span>
                                        )}
                                    </div>

                                    {/* Status Update */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#555' }}>Status:</label>
                                        <select
                                            defaultValue={b.status}
                                            onChange={e => handleStatusUpdate(b._id, e.target.value)}
                                            style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '4px 8px', fontSize: '13px' }}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Confirmed">Confirmed</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default AdminBookings;
