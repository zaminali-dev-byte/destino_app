import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, Navigate } from 'react-router-dom';

const CustomerDashboard = () => {
    const { user } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('bookings');
    const [bookings, setBookings] = useState([]);
    const [payments, setPayments] = useState([]);
    const [complaints, setComplaints] = useState([]);
    const [fullProfile, setFullProfile] = useState(null);
    const [wishlists, setWishlists] = useState({ tours: [], hotels: [] });
    const [loading, setLoading] = useState(true);

    const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            return alert("New passwords do not match!");
        }
        setIsUpdatingPassword(true);
        try {
            const res = await fetch('/api/users/profile/password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword })
            });
            const data = await res.json();
            if (res.ok) {
                alert("Password changed successfully!");
                setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                alert(data.message || "Failed to update password.");
            }
        } catch (err) {
            alert("Error updating password.");
        } finally {
            setIsUpdatingPassword(false);
        }
    };

    useEffect(() => {
        if (user && user.email) {
            Promise.all([
                fetch(`/api/bookings/my/${user.email}`).then(res => res.json()),
                fetch('/api/payments/my', { headers: { 'Authorization': `Bearer ${user.token}` } }).then(res => res.json()),
                fetch('/api/complaints/my', { headers: { 'Authorization': `Bearer ${user.token}` } }).then(res => res.json()),
                fetch(`/api/users/${user._id}`).then(res => res.json())
            ])
            .then(([bookingsData, paymentsData, complaintsData, profileData]) => {
                setBookings(Array.isArray(bookingsData) ? bookingsData : []);
                setPayments(Array.isArray(paymentsData) ? paymentsData : []);
                setComplaints(Array.isArray(complaintsData) ? complaintsData : []);
                
                if (profileData && profileData._id) {
                    setFullProfile(profileData);
                    // In a real app we'd populate the wishlist array via an API call or Mongoose populate
                    // For now, we'll store the object IDs
                    setWishlists({
                        tours: profileData.wishlistTours || [],
                        hotels: profileData.wishlistHotels || []
                    });
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch dashboard data", err);
                setLoading(false);
            });
        }
    }, [user]);

    if (!user) {
        return <Navigate to="/login" />;
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'Confirmed': return { bg: '#e1f4e5', color: '#008234' };
            case 'Pending':   return { bg: '#fff4e5', color: '#b05d00' };
            case 'Cancelled': return { bg: '#fdecea', color: '#c0392b' };
            default:          return { bg: '#f5f5f5', color: '#666' };
        }
    };

    return (
        <section className="dashboard-area pt-150 pb-100 bgc-lighter" style={{ minHeight: '80vh', marginTop: '-100px' }}>
            <div className="container" style={{ maxWidth: '1000px' }}>
                <div className="row pt-50 mb-30">
                    <div className="col-12" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#003580', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: 'bold' }}>
                            {user.name.charAt(0)}
                        </div>
                        <div>
                            <h2 style={{ margin: '0 0 5px 0', fontSize: '28px' }}>Welcome back, {user.name}</h2>
                            <p style={{ color: '#555', margin: 0 }}>Manage your trips, properties, payments, and settings here.</p>
                            {fullProfile && (
                                <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                                    <span style={{ background: '#fef3c7', color: '#b45309', padding: '4px 10px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' }}>
                                        <i className="fas fa-star text-warning"></i> {fullProfile.loyaltyPoints || 0} Points
                                    </span>
                                    <span style={{ background: '#dbeafe', color: '#1e3a8a', padding: '4px 10px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' }}>
                                        <i className="fas fa-wallet"></i> US${fullProfile.walletBalance || 0}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-lg-3">
                        {/* Sidebar */}
                        <div style={{ background: '#fff', border: '1px solid #ddd', borderRadius: '8px', padding: '20px' }}>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                <li style={{ marginBottom: '10px' }}><button onClick={() => setActiveTab('bookings')} style={{ border: 'none', background: 'none', padding: 0, color: activeTab === 'bookings' ? '#0071c2' : '#555', fontWeight: activeTab === 'bookings' ? 'bold' : 'normal', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}><i className="fal fa-suitcase"></i> My Bookings</button></li>
                                <li style={{ marginBottom: '10px' }}><button onClick={() => setActiveTab('wallet')} style={{ border: 'none', background: 'none', padding: 0, color: activeTab === 'wallet' ? '#0071c2' : '#555', fontWeight: activeTab === 'wallet' ? 'bold' : 'normal', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}><i className="fal fa-wallet"></i> Wallet & Rewards</button></li>
                                <li style={{ marginBottom: '10px' }}><button onClick={() => setActiveTab('wishlist')} style={{ border: 'none', background: 'none', padding: 0, color: activeTab === 'wishlist' ? '#0071c2' : '#555', fontWeight: activeTab === 'wishlist' ? 'bold' : 'normal', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}><i className="fal fa-heart"></i> My Wishlist</button></li>
                                <li style={{ marginBottom: '10px' }}><button onClick={() => setActiveTab('payments')} style={{ border: 'none', background: 'none', padding: 0, color: activeTab === 'payments' ? '#0071c2' : '#555', fontWeight: activeTab === 'payments' ? 'bold' : 'normal', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}><i className="fal fa-credit-card"></i> Payment History</button></li>
                                <li style={{ marginBottom: '10px' }}><button onClick={() => setActiveTab('complaints')} style={{ border: 'none', background: 'none', padding: 0, color: activeTab === 'complaints' ? '#0071c2' : '#555', fontWeight: activeTab === 'complaints' ? 'bold' : 'normal', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}><i className="fal fa-comment-alt"></i> Support Tickets</button></li>
                                <li style={{ marginBottom: '10px' }}><button onClick={() => setActiveTab('account')} style={{ border: 'none', background: 'none', padding: 0, color: activeTab === 'account' ? '#0071c2' : '#555', fontWeight: activeTab === 'account' ? 'bold' : 'normal', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}><i className="fal fa-user"></i> Manage Account</button></li>
                            </ul>
                        </div>
                    </div>

                    <div className="col-lg-9">
                        <div style={{ background: '#fff', border: '1px solid #ddd', borderRadius: '8px', padding: '30px' }}>
                            {activeTab === 'bookings' && (
                                <>
                                    <h3 style={{ fontSize: '24px', borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '20px' }}>Your Upcoming Trips</h3>
                                    
                                    {loading ? (
                                        <div className="text-center py-50"><div className="spinner-border" style={{ color: '#0071c2' }}></div></div>
                                    ) : bookings.length === 0 ? (
                                        <div className="text-center py-50">
                                            <h4 style={{ color: '#555' }}>You have no upcoming trips.</h4>
                                            <p style={{ color: '#777', marginBottom: '20px' }}>Start exploring hundreds of properties and make your next memory.</p>
                                            <Link to="/search" className="theme-btn style-two"><span data-hover="Start Browsing">Start Browsing</span></Link>
                                        </div>
                                    ) : (
                                        <div className="bookings-list" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                            {bookings.map((b, i) => {
                                                const sColors = getStatusColor(b.status);
                                                const itemImg = b.tourId?.imageUrl || b.hotelId?.image || b.destinationId?.image || "assets/images/destinations/destination1.jpg";
                                                const itemName = b.tourId?.title || b.hotelId?.name || (b.destinationId ? `Trip to ${b.destinationId.name}` : 'Reservation');

                                                return (
                                                <div key={b._id || i} style={{ border: '1px solid #eee', borderRadius: '8px', padding: '15px', display: 'flex', gap: '20px' }}>
                                                    <img src={itemImg?.startsWith('http') ? itemImg : `/${itemImg}`} alt="Trip" style={{ width: '120px', height: '120px', borderRadius: '8px', objectFit: 'cover' }} onError={(e) => e.target.src="/assets/images/destinations/destination1.jpg"} />
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                                            <span style={{ padding: '3px 8px', background: sColors.bg, color: sColors.color, borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                                                                {b.status}
                                                            </span>
                                                            {b.paymentStatus === 'Paid' && (
                                                                <span style={{ padding: '3px 8px', background: '#e1f4e5', color: '#008234', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>PAID</span>
                                                            )}
                                                        </div>
                                                        <h4 style={{ margin: '0 0 5px 0', fontSize: '18px' }}>{itemName}</h4>
                                                        <p style={{ margin: 0, color: '#555', fontSize: '14px' }}>
                                                            <i className="fal fa-calendar-alt"></i> <span style={{ fontWeight: 'bold' }}>{new Date(b.date).toLocaleDateString()}</span> &bull; 
                                                            <i className="fal fa-user" style={{ marginLeft: '10px' }}></i> <span style={{ fontWeight: 'bold' }}>{b.guests} Guests</span>
                                                        </p>
                                                        
                                                        {b.assignedStaff && b.assignmentStatus === 'Accepted' && (
                                                            <div style={{ marginTop: '15px', background: '#f8fafc', border: '1px solid #e2e8f0', padding: '0', borderRadius: '8px', overflow: 'hidden' }}>
                                                                <div style={{ background: '#f1f5f9', padding: '10px 15px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                    <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                                        <i className="fas fa-shield-check" style={{ color: '#10b981' }}></i> Verified Security Profile
                                                                    </span>
                                                                    <span style={{ fontSize: '11px', background: '#10b981', color: '#fff', padding: '2px 8px', borderRadius: '30px', fontWeight: 'bold' }}>Assigned</span>
                                                                </div>
                                                                <div style={{ padding: '15px' }}>
                                                                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '15px' }}>
                                                                        <div style={{ width: '50px', height: '50px', background: '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', color: '#64748b' }}>
                                                                            <i className="fas fa-user-tie"></i>
                                                                        </div>
                                                                        <div style={{ flex: 1 }}>
                                                                            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a', marginBottom: '2px' }}>{b.assignedStaff.name}</div>
                                                                            <div style={{ fontSize: '13px', color: '#64748b', display: 'flex', gap: '15px' }}>
                                                                                <span><i className="fal fa-phone-alt"></i> {b.assignedStaff.phone || 'Contact via App'}</span>
                                                                                {b.assignedStaff.experience && <span><i className="fal fa-star"></i> {b.assignedStaff.experience} Exp.</span>}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    
                                                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', background: '#fff', padding: '12px', borderRadius: '6px', border: '1px dashed #cbd5e1' }}>
                                                                        <div>
                                                                            <div style={{ color: '#64748b', textTransform: 'uppercase', fontSize: '10px', fontWeight: 'bold', marginBottom: '2px' }}>Driver CNIC</div>
                                                                            <div style={{ fontSize: '13px', fontWeight: '500', color: '#334155' }}><i className="fal fa-id-card text-muted" style={{ marginRight: '4px' }}></i> {b.assignedStaff.cnic || 'Pending Verification'}</div>
                                                                        </div>
                                                                        <div>
                                                                            <div style={{ color: '#64748b', textTransform: 'uppercase', fontSize: '10px', fontWeight: 'bold', marginBottom: '2px' }}>Driving License</div>
                                                                            <div style={{ fontSize: '13px', fontWeight: '500', color: '#334155' }}><i className="fal fa-id-badge text-muted" style={{ marginRight: '4px' }}></i> {b.assignedStaff.license || 'Pending Verification'}</div>
                                                                        </div>
                                                                        <div>
                                                                            <div style={{ color: '#64748b', textTransform: 'uppercase', fontSize: '10px', fontWeight: 'bold', marginBottom: '2px' }}>Vehicle Model</div>
                                                                            <div style={{ fontSize: '13px', fontWeight: '500', color: '#334155' }}><i className="fal fa-car text-muted" style={{ marginRight: '4px' }}></i> {b.assignedStaff.vehicleModel || 'Standard'}</div>
                                                                        </div>
                                                                        <div>
                                                                            <div style={{ color: '#64748b', textTransform: 'uppercase', fontSize: '10px', fontWeight: 'bold', marginBottom: '2px' }}>License Plate</div>
                                                                            <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#0f172a', background: '#f1f5f9', display: 'inline-block', padding: '1px 6px', borderRadius: '4px' }}>{b.assignedStaff.vehicleNumber || 'TBA'}</div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                        
                                                        {b.assignedStaff && b.assignmentStatus === 'Assigned' && (
                                                            <div style={{ marginTop: '10px', background: '#f8f9fa', padding: '10px', borderRadius: '6px', fontSize: '12px', color: '#666' }}>
                                                                <i className="fas fa-sync fa-spin"></i> Finalizing guide assignment for your safety...
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                                        <div style={{ fontSize: '18px', fontWeight: 'bold' }}>US${b.totalAmount || 0}</div>
                                                        {b.status !== 'Cancelled' && (
                                                            <button 
                                                                className="theme-btn style-three" 
                                                                style={{ padding: '6px 12px', fontSize: '12px', borderColor: '#ccc' }}
                                                                onClick={() => {
                                                                    if (window.confirm('Are you sure you want to cancel this booking?')) {
                                                                        fetch(`/api/bookings/my/${b._id}`, {
                                                                            method: 'DELETE',
                                                                            headers: { 'Authorization': `Bearer ${user.token}` }
                                                                        })
                                                                        .then(res => {
                                                                            if (res.ok) window.location.reload();
                                                                            else alert('Failed to cancel booking.');
                                                                        });
                                                                    }
                                                                }}
                                                            >
                                                                <span data-hover="Cancel Trip">Cancel Trip</span>
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            )})}
                                        </div>
                                    )}
                                </>
                            )}

                            {activeTab === 'wallet' && (
                                <>
                                    <h3 style={{ fontSize: '24px', borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '20px' }}>Wallet & Rewards</h3>
                                    
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                                        <div style={{ background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)', color: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                                            <div style={{ fontSize: '14px', opacity: 0.8, marginBottom: '5px' }}>Current Balance</div>
                                            <div style={{ fontSize: '36px', fontWeight: 'bold' }}>US${fullProfile?.walletBalance || 0}.00</div>
                                            <div style={{ marginTop: '15px', fontSize: '13px' }}><i className="fal fa-info-circle"></i> Can be used for any booking</div>
                                        </div>
                                        <div style={{ background: 'linear-gradient(135deg, #b45309, #f59e0b)', color: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                                            <div style={{ fontSize: '14px', opacity: 0.8, marginBottom: '5px' }}>Loyalty Points</div>
                                            <div style={{ fontSize: '36px', fontWeight: 'bold' }}>{fullProfile?.loyaltyPoints || 0}</div>
                                            <div style={{ marginTop: '15px', fontSize: '13px' }}><i className="fal fa-gift"></i> Earn more by traveling with us</div>
                                        </div>
                                    </div>
                                    
                                    <h4 style={{ fontSize: '18px', marginBottom: '15px' }}>Recent Activity</h4>
                                    <p style={{ color: '#666' }}>No recent wallet activity.</p>
                                </>
                            )}

                            {activeTab === 'wishlist' && (
                                <>
                                    <h3 style={{ fontSize: '24px', borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '20px' }}>My Wishlist</h3>
                                    <div className="mb-4">
                                        <h5 className="text-primary mb-3">Saved Tours ({wishlists.tours.length})</h5>
                                        {wishlists.tours.length === 0 ? (
                                            <p className="text-muted">You haven't saved any tours yet. <Link to="/tours">Explore tours</Link></p>
                                        ) : (
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                                {wishlists.tours.map(id => (
                                                    <div key={id} style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <Link to={`/tour-details/${id}`} style={{ fontWeight: 'bold' }}>View Tour Details</Link>
                                                        <i className="fas fa-heart text-danger"></i>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h5 className="text-primary mb-3">Saved Hotels ({wishlists.hotels.length})</h5>
                                        {wishlists.hotels.length === 0 ? (
                                            <p className="text-muted">You haven't saved any hotels yet. <Link to="/search">Find hotels</Link></p>
                                        ) : (
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                                {wishlists.hotels.map(id => (
                                                    <div key={id} style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <Link to={`/hotel-details/${id}`} style={{ fontWeight: 'bold' }}>View Hotel Details</Link>
                                                        <i className="fas fa-heart text-danger"></i>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}

                            {activeTab === 'payments' && (
                                <>
                                    <h3 style={{ fontSize: '24px', borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '20px' }}>Payment History</h3>
                                    {payments.length === 0 ? <p>No payment records found.</p> : (
                                        <div style={{ overflowX: 'auto' }}>
                                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                                                <thead>
                                                    <tr style={{ background: '#f8f9fa', textAlign: 'left' }}>
                                                        <th style={{ padding: '12px', borderBottom: '2px solid #eee' }}>Date</th>
                                                        <th style={{ padding: '12px', borderBottom: '2px solid #eee' }}>Transaction ID</th>
                                                        <th style={{ padding: '12px', borderBottom: '2px solid #eee' }}>Method</th>
                                                        <th style={{ padding: '12px', borderBottom: '2px solid #eee' }}>Amount</th>
                                                        <th style={{ padding: '12px', borderBottom: '2px solid #eee' }}>Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {payments.map(p => (
                                                        <tr key={p._id}>
                                                            <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{new Date(p.createdAt).toLocaleDateString()}</td>
                                                            <td style={{ padding: '12px', borderBottom: '1px solid #eee', fontFamily: 'monospace' }}>{p.transactionId}</td>
                                                            <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{p.paymentMethod}</td>
                                                            <td style={{ padding: '12px', borderBottom: '1px solid #eee', fontWeight: 'bold' }}>US${p.amount}</td>
                                                            <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                                                                <span style={{ color: '#008234', fontWeight: 'bold' }}>{p.status}</span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </>
                            )}

                            {activeTab === 'complaints' && (
                                <>
                                    <h3 style={{ fontSize: '24px', borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '20px' }}>Support Tickets</h3>
                                    <div style={{ marginBottom: '30px', padding: '20px', background: '#f9f9f9', borderRadius: '8px', border: '1px solid #eee' }}>
                                        <h4 style={{ fontSize: '18px', marginBottom: '15px' }}>Submit a new issue</h4>
                                        <form onSubmit={(e) => {
                                            e.preventDefault();
                                            const subject = e.target.subject.value;
                                            const message = e.target.message.value;
                                            fetch('/api/complaints', {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
                                                body: JSON.stringify({ subject, message })
                                            }).then(res => res.json()).then(newTicket => {
                                                setComplaints([newTicket, ...complaints]);
                                                e.target.reset();
                                                alert('Support ticket submitted successfully.');
                                            });
                                        }}>
                                            <input name="subject" type="text" placeholder="Subject" required style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
                                            <textarea name="message" placeholder="Describe your issue..." required style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px', minHeight: '100px' }}></textarea>
                                            <button type="submit" className="theme-btn style-two"><span data-hover="Submit Ticket">Submit Ticket</span></button>
                                        </form>
                                    </div>
                                    {complaints.length > 0 && (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                            {complaints.map(c => (
                                                <div key={c._id} style={{ border: '1px solid #eee', borderRadius: '8px', padding: '15px' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                                        <h5 style={{ margin: 0 }}>{c.subject}</h5>
                                                        <span style={{ fontSize: '12px', fontWeight: 'bold', color: c.status === 'Open' ? '#f0ad4e' : '#5cb85c', background: c.status === 'Open' ? '#fcf8e3' : '#dff0d8', padding: '2px 8px', borderRadius: '4px' }}>{c.status}</span>
                                                    </div>
                                                    <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#555' }}>{c.message}</p>
                                                    {c.adminReply && <div style={{ background: '#f0f7ff', borderLeft: '4px solid #0071c2', padding: '10px', fontSize: '13px', color: '#333' }}><strong>Admin Reply:</strong> {c.adminReply}</div>}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}

                            {activeTab === 'account' && (
                                <>
                                    <h3 style={{ fontSize: '24px', borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '20px' }}>Manage Account</h3>
                                    <form onSubmit={(e) => {
                                        e.preventDefault();
                                        const name = e.target.name.value;
                                        const phone = e.target.phone.value;
                                        fetch('/api/users/profile', {
                                            method: 'PUT',
                                            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
                                            body: JSON.stringify({ name, phone })
                                        }).then(res => res.json()).then(updatedUser => {
                                            alert('Account updated successfully!');
                                        }).catch(err => alert('Failed to update account.'));
                                    }}>
                                        <div style={{ marginBottom: '15px' }}>
                                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Full Name</label>
                                            <input name="name" type="text" defaultValue={user.name} style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
                                        </div>
                                        <div style={{ marginBottom: '15px' }}>
                                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email Address</label>
                                            <input type="email" defaultValue={user.email} disabled style={{ width: '100%', padding: '10px', border: '#eee', borderRadius: '4px', background: '#f5f5f5', color: '#888' }} />
                                        </div>
                                        <div style={{ marginBottom: '20px' }}>
                                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Phone Number</label>
                                            <input name="phone" type="text" defaultValue={user.phone || ''} style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
                                        </div>
                                        <button type="submit" className="theme-btn style-two"><span data-hover="Save Changes">Save Changes</span></button>
                                    </form>

                                    <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
                                        <h4 style={{ fontSize: '18px', marginBottom: '15px' }}><i className="fas fa-lock text-danger"></i> Security Settings</h4>
                                        <form onSubmit={handleUpdatePassword}>
                                            <div style={{ marginBottom: '15px' }}>
                                                <input type="password" value={passwordForm.currentPassword} onChange={(e)=>setPasswordForm({...passwordForm, currentPassword: e.target.value})} placeholder="Current Password" style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} required />
                                            </div>
                                            <div style={{ marginBottom: '15px' }}>
                                                <input type="password" value={passwordForm.newPassword} onChange={(e)=>setPasswordForm({...passwordForm, newPassword: e.target.value})} placeholder="New Password" style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} required />
                                            </div>
                                            <div style={{ marginBottom: '20px' }}>
                                                <input type="password" value={passwordForm.confirmPassword} onChange={(e)=>setPasswordForm({...passwordForm, confirmPassword: e.target.value})} placeholder="Confirm New Password" style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} required />
                                            </div>
                                            <button type="submit" disabled={isUpdatingPassword} className="theme-btn style-three" style={{ borderColor: '#ccc' }}>
                                                <span data-hover={isUpdatingPassword ? "Updating..." : "Change Password"}>
                                                    {isUpdatingPassword ? "Updating..." : "Change Password"}
                                                </span>
                                            </button>
                                        </form>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CustomerDashboard;
