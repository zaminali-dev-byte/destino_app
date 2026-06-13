import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import DataTables from '../admin/DataTables';
import StaffAnalytics from './StaffAnalytics';
import MemoBoard from './MemoBoard';
import StaffActivity from './StaffActivity';
import StaffExpenses from './StaffExpenses';
import '../admin/Admin.css';

const StaffDashboard = () => {
    const { user, logout, login } = useContext(AuthContext); // Use login to update local context
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(() => {
        if (user?.department === 'Transport' || user?.department === 'Field Operations') return 'tasks';
        return 'profile';
    });
    const [tasks, setTasks] = useState([]);
    const [loadingTasks, setLoadingTasks] = useState(false);
    
    // Profile Form State
    const [profileForm, setProfileForm] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        cnic: user?.cnic || '',
        license: user?.license || '',
        vehicleNumber: user?.vehicleNumber || '',
        vehicleModel: user?.vehicleModel || '',
        experience: user?.experience || '',
        emergencyContact: user?.emergencyContact || '',
        bankName: user?.bankName || '',
        bankAccountNumber: user?.bankAccountNumber || ''
    });
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

    // Password Form State
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

    useEffect(() => {
        if (activeTab === 'tasks') {
            fetchTasks();
        }
    }, [activeTab]);

    const fetchTasks = async () => {
        setLoadingTasks(true);
        try {
            const res = await fetch('/api/bookings/staff-tasks', {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            const data = await res.json();
            setTasks(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Failed to fetch staff tasks", err);
        } finally {
            setLoadingTasks(false);
        }
    };

    const handleTaskResponse = async (taskId, status) => {
        let reason = '';
        if (status === 'Rejected') {
            reason = window.prompt("Please provide a reason for rejection:");
            if (reason === null) return; 
        }

        try {
            const res = await fetch(`/api/bookings/${taskId}/respond`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ status, reason })
            });
            const data = await res.json();
            if (res.ok) {
                alert(`Trip ${status.toLowerCase()} successfully!`);
                fetchTasks();
            } else {
                alert(data.message || "Failed to respond to task.");
            }
        } catch (err) {
            alert("An error occurred. Please try again.");
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setIsUpdatingProfile(true);
        try {
            const res = await fetch('/api/users/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(profileForm)
            });
            const updatedData = await res.json();
            if (res.ok) {
                // Update local storage and context
                const newUser = { ...user, ...updatedData };
                localStorage.setItem('user', JSON.stringify(newUser));
                // We don't have a direct 'setUser' but we can trigger a re-login/refresh effect if context allows
                alert("Professional profile updated successfully!");
            } else {
                alert(updatedData.message || "Failed to update profile.");
            }
        } catch (err) {
            alert("Error updating profile.");
        } finally {
            setIsUpdatingProfile(false);
        }
    };

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

    let navItems = [
        { id: 'analytics', label: 'Department Analytics', icon: 'fa-chart-pie' },
        { id: 'memos', label: 'Internal Memo Board', icon: 'fa-clipboard-list' },
        { id: 'activity', label: 'My Work Log & Activity', icon: 'fa-history' },
        { id: 'profile', label: 'My Professional Profile', icon: 'fa-id-card' },
        { id: 'my-expenses', label: 'My Expense Reports', icon: 'fa-file-invoice-dollar' }
    ];

    // Field Staff
    if (user?.department === 'Transport' || user?.department === 'Field Operations') {
        navItems.unshift({ id: 'tasks', label: 'My Trip Tasks', icon: 'fa-tasks' });
    }

    // Finance & HR
    if (user?.department === 'Finance' || user?.department === 'Human Resources' || user?.department === 'Information Technology') {
        navItems.push({ id: 'payroll', label: 'Payroll Management', icon: 'fa-money-bill-wave' });
        navItems.push({ id: 'expenses', label: 'Company Expenses', icon: 'fa-file-invoice-dollar' });
    }

    // HR & IT Admin
    if (user?.department === 'Human Resources' || user?.department === 'Information Technology') {
        navItems.push({ id: 'staff', label: 'Staff Directory', icon: 'fa-user-tie' });
        navItems.push({ id: 'applications', label: 'Job Applications', icon: 'fa-briefcase' });
    }

    // Sales, Marketing, Operations, Customer Service, IT
    if (['Sales', 'Marketing', 'Operations', 'Customer Service', 'Information Technology'].includes(user?.department)) {
        navItems.push({ id: 'bookings', label: 'Manage Bookings', icon: 'fa-calendar-check' });
        navItems.push({ id: 'packages', label: 'Packages Management', icon: 'fa-suitcase' });
        navItems.push({ id: 'tours', label: 'Tours Management', icon: 'fa-map' });
        navItems.push({ id: 'destinations', label: 'Destinations', icon: 'fa-map-marker-alt' });
        navItems.push({ id: 'hotels', label: 'Hotels Database', icon: 'fa-hotel' });
        navItems.push({ id: 'complaints', label: 'Customer Complaints', icon: 'fa-exclamation-circle' });
    }

    // Fallback if no specific department match, give them basic read access
    if (navItems.length === 1) {
        navItems.push({ id: 'bookings', label: 'Assigned Bookings', icon: 'fa-calendar-check' });
    }

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const getStatusBadgeStyle = (status) => {
        switch(status) {
            case 'Accepted': return { background: '#e1f4e5', color: '#008234' };
            case 'Rejected': return { background: '#fdecea', color: '#c0392b' };
            case 'Assigned': return { background: '#fff4e5', color: '#b05d00' };
            default: return { background: '#f5f5f5', color: '#666' };
        }
    };

    return (
        <div className="admin-dashboard">
            <div className="admin-sidebar" style={{ background: '#2c3e50' }}>
                <div className="sidebar-logo" style={{ background: '#1a252f' }}>
                    <h2>Staff Portal</h2>
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
                    <h2>Staff Operations / {navItems.find(i => i.id === activeTab).label}</h2>
                    <div className="header-user" style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                        <span>Logged in as: <strong>{user?.name || 'Staff Member'}</strong></span>
                        <button onClick={handleLogout} className="theme-btn style-three" style={{ padding: '5px 15px', fontSize: '12px' }}>
                            <span data-hover="Logout">Logout</span>
                        </button>
                    </div>
                </header>

                {user && (user.vehicleNumber || user.license || user.position) && (
                    <div style={{ background: '#f8f9fa', padding: '15px 30px', borderBottom: '1px solid #ddd', display: 'flex', gap: '30px', alignItems: 'center', flexWrap: 'wrap' }}>
                        {user.position && <div><i className="fal fa-id-badge text-primary me-2"></i> <strong>Role:</strong> {user.position}</div>}
                        {user.department && <div><i className="fal fa-building text-secondary me-2"></i> <strong>Dept:</strong> {user.department}</div>}
                        {user.vehicleNumber && <div><i className="fal fa-car text-success me-2"></i> <strong>Vehicle:</strong> {user.vehicleModel} ({user.vehicleNumber})</div>}
                        {user.license && <div><i className="fal fa-id-card text-info me-2"></i> <strong>License:</strong> {user.license}</div>}
                        {user.experience && <div><i className="fal fa-star text-warning me-2"></i> <strong>Exp:</strong> {user.experience}</div>}
                        {user.fuelAllowance > 0 && <div style={{ background: '#fef3c7', padding: '4px 10px', borderRadius: '4px' }}><i className="fal fa-gas-pump text-warning me-2"></i> <strong>Fuel Allowance:</strong> PKR {user.fuelAllowance}/mo</div>}
                        {user.tourAllowance > 0 && <div style={{ background: '#dcfce7', padding: '4px 10px', borderRadius: '4px' }}><i className="fal fa-hiking text-success me-2"></i> <strong>Tour Allowance:</strong> PKR {user.tourAllowance}/day</div>}
                        {user.commissionRate > 0 && <div style={{ background: '#e0e7ff', padding: '4px 10px', borderRadius: '4px' }}><i className="fal fa-percentage text-primary me-2"></i> <strong>Commission Rate:</strong> {user.commissionRate}%</div>}
                        {user.departmentBudget > 0 && <div style={{ background: '#fce7f3', padding: '4px 10px', borderRadius: '4px' }}><i className="fal fa-chart-pie text-danger me-2"></i> <strong>Dept Budget:</strong> PKR {user.departmentBudget.toLocaleString()}</div>}
                    </div>
                )}

                <div className="admin-content" style={{ padding: '30px' }}>
                    {activeTab === 'tasks' && (
                        <div className="staff-tasks-container">
                            <h3 className="mb-20">Assigned Trips & Tasks</h3>
                            {loadingTasks ? (
                                <div className="text-center py-50"><div className="spinner-border"></div></div>
                            ) : tasks.length === 0 ? (
                                <div className="no-records" style={{ textAlign: 'center', padding: '50px', background: '#fff', borderRadius: '8px', border: '1px solid #ddd' }}>
                                    <i className="fal fa-clipboard-list-check mb-10" style={{ fontSize: '40px', color: '#ccc' }}></i>
                                    <p>You have no assigned trips at the moment.</p>
                                </div>
                            ) : (
                                <div className="row">
                                    {tasks.map(task => {
                                        const badge = getStatusBadgeStyle(task.assignmentStatus);
                                        const itemName = task.tourId?.title || task.hotelId?.name || (task.destinationId ? `Trip to ${task.destinationId.name}` : 'Custom Trip');
                                        const itemImg = task.tourId?.imageUrl || task.hotelId?.image || "assets/images/destinations/destination1.jpg";

                                        return (
                                            <div key={task._id} className="col-md-12 mb-20">
                                                <div className="task-card" style={{ background: '#fff', border: '1px solid #ddd', borderRadius: '8px', padding: '20px', display: 'flex', gap: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                                                    <img src={itemImg?.startsWith('http') ? itemImg : `/${itemImg}`} alt="Trip" style={{ width: '150px', height: '100px', objectFit: 'cover', borderRadius: '4px' }} onError={(e) => e.target.src="/assets/images/destinations/destination1.jpg"} />
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                            <div>
                                                                <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#0071c2', textTransform: 'uppercase' }}>Trip Date: {new Date(task.date).toLocaleDateString()}</span>
                                                                <h4 style={{ margin: '5px 0' }}>{itemName}</h4>
                                                                <p style={{ margin: 0, fontSize: '14px', color: '#666' }}><i className="fal fa-user"></i> Traveler: <strong>{task.customerName}</strong> ({task.guests} Guests)</p>
                                                            </div>
                                                            <span style={{ padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', ...badge }}>
                                                                {task.assignmentStatus}
                                                            </span>
                                                        </div>
                                                        {task.tripDetails && (
                                                            <div style={{ marginTop: '10px', background: '#f9f9f9', padding: '10px', borderRadius: '4px', fontSize: '13px' }}>
                                                                <p style={{ margin: '0 0 5px 0' }}><strong>Route:</strong> {task.tripDetails.route || 'TBD'}</p>
                                                                <p style={{ margin: 0 }}><strong>Pickup:</strong> {task.tripDetails.pickupLocation || 'Main Terminal'}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', justifyContent: 'center' }}>
                                                        {task.assignmentStatus === 'Assigned' && (
                                                            <>
                                                                <button onClick={() => handleTaskResponse(task._id, 'Accepted')} className="theme-btn style-two" style={{ padding: '10px 20px', fontSize: '13px', background: '#008234' }}>
                                                                    <span data-hover="Accept">Accept</span>
                                                                </button>
                                                                <button onClick={() => handleTaskResponse(task._id, 'Rejected')} className="theme-btn style-three" style={{ padding: '10px 20px', fontSize: '13px' }}>
                                                                    <span data-hover="Decline">Decline</span>
                                                                </button>
                                                            </>
                                                        )}
                                                        {task.assignmentStatus === 'Accepted' && (
                                                            <div style={{ color: '#008234', fontWeight: 'bold', textAlign: 'center' }}>
                                                                <i className="fas fa-check-circle"></i> Ready to Go
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'profile' && (
                        <div className="staff-profile-container" style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
                            <div style={{ flex: 1, background: '#fff', padding: '30px', borderRadius: '8px', border: '1px solid #ddd' }}>
                                <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '20px' }}>Professional Identity & Security Credentials</h3>
                                <p style={{ color: '#666', marginBottom: '25px', fontSize: '14px' }}>Please keep this information accurate. These details are used by admins to assign trips and shown to travelers for their safety.</p>
                            
                            <form onSubmit={handleUpdateProfile}>
                                <div className="row">
                                    <div className="col-md-6 mb-15">
                                        <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '5px' }}>Full Name</label>
                                        <input type="text" value={profileForm.name} onChange={(e)=>setProfileForm({...profileForm, name: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} required />
                                    </div>
                                    <div className="col-md-6 mb-15">
                                        <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '5px' }}>Phone Number</label>
                                        <input type="text" value={profileForm.phone} onChange={(e)=>setProfileForm({...profileForm, phone: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} required />
                                    </div>
                                    <div className="col-md-6 mb-15">
                                        <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '5px' }}>CNIC (Security ID)</label>
                                        <input type="text" value={profileForm.cnic} onChange={(e)=>setProfileForm({...profileForm, cnic: e.target.value})} placeholder="e.g. 35201-XXXXXXX-X" style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
                                    </div>
                                    <div className="col-md-6 mb-15">
                                        <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '5px' }}>Driving License No.</label>
                                        <input type="text" value={profileForm.license} onChange={(e)=>setProfileForm({...profileForm, license: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
                                    </div>
                                    <div className="col-md-6 mb-15">
                                        <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '5px' }}>Vehicle Plate Number</label>
                                        <input type="text" value={profileForm.vehicleNumber} onChange={(e)=>setProfileForm({...profileForm, vehicleNumber: e.target.value})} placeholder="e.g. LED-1234" style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
                                    </div>
                                    <div className="col-md-6 mb-15">
                                        <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '5px' }}>Vehicle Model</label>
                                        <input type="text" value={profileForm.vehicleModel} onChange={(e)=>setProfileForm({...profileForm, vehicleModel: e.target.value})} placeholder="e.g. Toyota Hiace 2023" style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
                                    </div>
                                    <div className="col-md-12 mb-15">
                                        <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '5px' }}>Professional Experience Summary</label>
                                        <textarea value={profileForm.experience} onChange={(e)=>setProfileForm({...profileForm, experience: e.target.value})} placeholder="Describe your driving/guiding experience..." style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', minHeight: '80px' }} />
                                    </div>
                                    <div className="col-md-12 mb-15">
                                        <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '5px' }}>Emergency Contact Name & Phone</label>
                                        <input type="text" value={profileForm.emergencyContact} onChange={(e)=>setProfileForm({...profileForm, emergencyContact: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
                                    </div>
                                    <div className="col-md-6 mb-15">
                                        <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '5px' }}>Bank Name (For Salary Transfer)</label>
                                        <input type="text" value={profileForm.bankName} onChange={(e)=>setProfileForm({...profileForm, bankName: e.target.value})} placeholder="e.g. Standard Chartered" style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
                                    </div>
                                    <div className="col-md-6 mb-25">
                                        <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '5px' }}>Bank Account Number / IBAN</label>
                                        <input type="text" value={profileForm.bankAccountNumber} onChange={(e)=>setProfileForm({...profileForm, bankAccountNumber: e.target.value})} placeholder="e.g. PK36SCBL..." style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
                                    </div>
                                </div>
                                <button type="submit" disabled={isUpdatingProfile} className="theme-btn style-two" style={{ padding: '12px 30px' }}>
                                    <span data-hover={isUpdatingProfile ? "Saving..." : "Save Professional Profile"}>
                                        {isUpdatingProfile ? "Saving..." : "Save Professional Profile"}
                                    </span>
                                </button>
                                </form>
                            </div>

                            <div style={{ width: '350px' }}>
                                <div style={{ background: '#10b981', color: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(16, 185, 129, 0.3)', textAlign: 'center' }}>
                                    <i className="fas fa-wallet mb-15" style={{ fontSize: '40px' }}></i>
                                    <h4 style={{ color: 'white', margin: '0 0 10px 0' }}>My Salary Account</h4>
                                    <h2 style={{ color: 'white', margin: 0, fontSize: '42px' }}>PKR {user?.walletBalance || 0}</h2>
                                    <p style={{ margin: '15px 0 0 0', opacity: 0.9, fontSize: '14px' }}>Available Balance</p>
                                </div>
                                <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #ddd', marginTop: '20px' }}>
                                    <h4 style={{ fontSize: '16px', marginBottom: '15px' }}><i className="fas fa-info-circle text-primary"></i> Account Information</h4>
                                    <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>Your monthly salary and bonuses are deposited directly into this digital wallet account by the Finance department.</p>
                                </div>
                                <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #ddd', marginTop: '20px' }}>
                                    <h4 style={{ fontSize: '16px', marginBottom: '15px' }}><i className="fas fa-lock text-danger"></i> Security Settings</h4>
                                    <form onSubmit={handleUpdatePassword}>
                                        <div className="form-group mb-15">
                                            <input type="password" value={passwordForm.currentPassword} onChange={(e)=>setPasswordForm({...passwordForm, currentPassword: e.target.value})} placeholder="Current Password" style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} required />
                                        </div>
                                        <div className="form-group mb-15">
                                            <input type="password" value={passwordForm.newPassword} onChange={(e)=>setPasswordForm({...passwordForm, newPassword: e.target.value})} placeholder="New Password" style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} required />
                                        </div>
                                        <div className="form-group mb-15">
                                            <input type="password" value={passwordForm.confirmPassword} onChange={(e)=>setPasswordForm({...passwordForm, confirmPassword: e.target.value})} placeholder="Confirm New Password" style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} required />
                                        </div>
                                        <button type="submit" disabled={isUpdatingPassword} className="theme-btn style-two w-100" style={{ padding: '8px' }}>
                                            <span data-hover={isUpdatingPassword ? "Updating..." : "Change Password"}>
                                                {isUpdatingPassword ? "Updating..." : "Change Password"}
                                            </span>
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'analytics' && <StaffAnalytics />}
                    {activeTab === 'memos' && <MemoBoard />}
                    {activeTab === 'activity' && <StaffActivity />}
                    {activeTab === 'my-expenses' && <StaffExpenses />}

                    {activeTab !== 'tasks' && activeTab !== 'profile' && activeTab !== 'analytics' && activeTab !== 'memos' && activeTab !== 'activity' && activeTab !== 'my-expenses' && (
                        <DataTables endpoint={activeTab} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default StaffDashboard;
