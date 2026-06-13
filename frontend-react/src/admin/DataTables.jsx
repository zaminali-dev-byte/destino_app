import React, { useEffect, useState, useContext, useMemo } from 'react';
import { AuthContext } from '../context/AuthContext';

const DataTables = ({ endpoint }) => {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const ignoredKeys = ['_id', '__v', 'createdAt', 'updatedAt', 'passwordHash', 'walletBalance', 'loyaltyPoints', 'wishlistTours', 'wishlistHotels', 'assignedStaffDetails'];


  // Pagination & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [editingId, setEditingId] = useState(null);

  const fetchData = () => {
    setLoading(true);
    const headers = {};
    if (user?.token) headers['Authorization'] = `Bearer ${user.token}`;

    fetch(`/api/${endpoint}`, { headers })
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => {
        setData(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Fetch error:', err);
        setError(err.message);
        setLoading(false);
      });

    // Fetch staff list if we are in bookings management
    if (endpoint === 'bookings' || endpoint === 'users') {
        fetch('/api/users', { headers })
            .then(res => res.json())
            .then(users => {
                setStaffList(users.filter(u => u.role === 'staff' || u.role === 'admin'));
            })
            .catch(err => console.error("Could not fetch staff", err));
    }
  };

  useEffect(() => {
    fetchData();
    setIsModalOpen(false);
    setFormData({});
    setEditingId(null);
    setSearchQuery('');
    setCurrentPage(1);
  }, [endpoint]);

  // Derived state for filtering and pagination
  const filteredData = useMemo(() => {
      if (!searchQuery) return data;
      return data.filter(item => {
          return Object.values(item).some(val => 
              String(val).toLowerCase().includes(searchQuery.toLowerCase())
          );
      });
  }, [data, searchQuery]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const exportToCSV = () => {
      if (filteredData.length === 0) return;
      const headers = Object.keys(filteredData[0]).filter(k => !ignoredKeys.includes(k));
      const csvRows = [];
      csvRows.push(headers.join(','));

      for (const row of filteredData) {
          const values = headers.map(header => {
              let val = row[header];
              if (typeof val === 'object' && val !== null) val = JSON.stringify(val);
              const escaped = ('' + val).replace(/"/g, '""');
              return `"${escaped}"`;
          });
          csvRows.push(values.join(','));
      }

      const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('hidden', '');
      a.setAttribute('href', url);
      a.setAttribute('download', `${endpoint}_export.csv`);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    try {
      const res = await fetch(`/api/${endpoint}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user?.token}`
        }
      });
      if (res.ok) {
        setData(data.filter(item => item._id !== id));
      } else {
        const errData = await res.json();
        alert(errData.message || 'Failed to delete');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting record');
    }
  };

  const handleEditClick = (item) => {
    setEditingId(item._id);
    const { _id, __v, createdAt, updatedAt, ...editableFields } = item;
    
    if (endpoint === 'bookings') {
        editableFields.tripDetails = editableFields.tripDetails || {};
        if (!editableFields.tripDetails.route) editableFields.tripDetails.route = '';
        if (!editableFields.tripDetails.pickupLocation) editableFields.tripDetails.pickupLocation = '';
        if (!editableFields.tripDetails.specialRequirements) editableFields.tripDetails.specialRequirements = '';
    }
    
    if (endpoint === 'staff') {
        editableFields.password = ''; // Offer option to update password
    }

    setFormData(editableFields);
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setEditingId(null);
    if (data.length > 0) {
      const { _id, __v, createdAt, updatedAt, ...template } = data[0];
      const emptyForm = {};
      Object.keys(template).forEach(key => {
          if (typeof template[key] === 'object' && template[key] !== null) {
              emptyForm[key] = {};
          } else {
              emptyForm[key] = '';
          }
      });
      if (endpoint === 'staff') emptyForm.password = '';
      setFormData(emptyForm);
    } else {
      if (endpoint === 'staff') setFormData({ name: '', email: '', password: '' });
      else setFormData({ name: '' });
    }
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('tripDetails.')) {
        const field = name.split('.')[1];
        setFormData(prev => ({
            ...prev,
            tripDetails: { ...prev.tripDetails, [field]: value }
        }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const url = editingId ? `/api/${endpoint}/${editingId}` : `/api/${endpoint}`;
    const method = editingId ? 'PUT' : 'POST';

    const finalData = { ...formData };
    if (endpoint === 'bookings' && finalData.assignedStaff) {
        if (finalData.assignedStaff !== (data.find(d=>d._id===editingId)?.assignedStaff?._id || '')) {
            finalData.assignmentStatus = 'Assigned';
        }
    }

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify(finalData)
      });
      
      const resData = await res.json();
      
      if (res.ok) {
        fetchData();
        setIsModalOpen(false);
      } else {
        alert(resData.message || 'Failed to save');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving record');
    }
  };

    const handlePrintManifest = (item) => {
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
          <html>
          <head>
              <title>Booking Manifest - ${item._id}</title>
              <style>
                  body { font-family: 'Arial', sans-serif; padding: 40px; color: #333; line-height: 1.6; }
                  h1 { color: #0071c2; border-bottom: 2px solid #0071c2; padding-bottom: 10px; }
                  .section { margin-bottom: 30px; }
                  .label { font-weight: bold; width: 150px; display: inline-block; color: #555; }
                  .value { display: inline-block; }
                  table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                  th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
                  th { background-color: #f5f5f5; }
                  .footer { margin-top: 50px; font-size: 12px; color: #888; text-align: center; border-top: 1px solid #ddd; padding-top: 20px; }
              </style>
          </head>
          <body>
              <h1>Destino Travel - Official Booking Manifest</h1>
              
              <div class="section">
                  <h3>Traveler Information</h3>
                  <div><span class="label">Name:</span> <span class="value">${item.fullName || 'N/A'}</span></div>
                  <div><span class="label">Email:</span> <span class="value">${item.email || 'N/A'}</span></div>
                  <div><span class="label">Phone:</span> <span class="value">${item.phone || 'N/A'}</span></div>
              </div>

              <div class="section">
                  <h3>Trip Details</h3>
                  <div><span class="label">Booking ID:</span> <span class="value">${item._id}</span></div>
                  <div><span class="label">Date Created:</span> <span class="value">${new Date(item.createdAt).toLocaleString()}</span></div>
                  <div><span class="label">Status:</span> <span class="value"><b>${item.status}</b></span></div>
                  <div><span class="label">Guests:</span> <span class="value">${item.guests || 1}</span></div>
                  <div><span class="label">Assigned Staff:</span> <span class="value">${item.assignedStaff ? (item.assignedStaff.name || item.assignedStaff) : 'Pending'}</span></div>
              </div>

              ${item.tripDetails ? `
              <div class="section">
                  <h3>Logistics & Route</h3>
                  <table>
                      <tr><th>Route</th><td>${item.tripDetails.route || 'N/A'}</td></tr>
                      <tr><th>Pickup Location</th><td>${item.tripDetails.pickupLocation || 'N/A'}</td></tr>
                      <tr><th>Special Req.</th><td>${item.tripDetails.specialRequirements || 'None'}</td></tr>
                  </table>
              </div>
              ` : ''}

              <div class="footer">
                  This document is auto-generated by the Destino Admin System.<br>
                  Printed on: ${new Date().toLocaleString()}
              </div>
          </body>
          </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      // Give it a small delay to render before printing
      setTimeout(() => {
          printWindow.print();
          printWindow.close();
      }, 500);
  };

  const getBadgeClass = (status) => {
    switch(status) {
        case 'Accepted': case 'Paid': return 'badge badge-success';
        case 'Rejected': case 'Failed': return 'badge badge-danger';
        case 'Assigned': case 'Pending': return 'badge badge-warning';
        default: return 'badge badge-default';
    }
  };

  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading {endpoint}...</div>;
  if (error) return <div style={{ padding: '50px', textAlign: 'center', color: 'red' }}>Error loading data: {error}</div>;

  return (
    <div className="data-table-container">
      <div className="table-header-controls">
        <div className="search-bar">
            <i className="fas fa-search"></i>
            <input 
                type="text" 
                placeholder={`Search ${endpoint}...`} 
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            />
        </div>
        
        <div className="table-actions">
            <button onClick={fetchData} className="btn-secondary">
                <i className="fas fa-sync"></i> Refresh
            </button>
            <button onClick={exportToCSV} className="btn-secondary">
                <i className="fas fa-file-csv"></i> Export CSV
            </button>
            {user?.role === 'admin' && endpoint !== 'bookings' && (
                <button onClick={handleAddClick} className="btn-primary">
                    <i className="fas fa-plus"></i> Add New
                </button>
            )}
        </div>
      </div>
      
      {currentData.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px' }}>
            <p style={{ color: 'var(--admin-text-muted)', fontSize: '16px' }}>No records found.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                {Object.keys(currentData[0])
                  .filter(key => !ignoredKeys.includes(key))
                  .map(key => (
                    <th key={key}>{key.replace(/([A-Z])/g, ' $1').trim()}</th>
                ))}
                {(user?.role === 'admin' || (user?.role === 'staff' && endpoint === 'bookings')) && (
                  <th>ACTIONS</th>
                )}
              </tr>
            </thead>
            <tbody>
              {currentData.map((item, index) => (
                <tr key={item._id || index}>
                  {Object.keys(currentData[0])
                    .filter(key => !ignoredKeys.includes(key))
                    .map(key => {
                      let value = item[key];
                      let content = value !== undefined && value !== null ? (typeof value === 'object' ? JSON.stringify(value) : String(value)) : '';
                      
                      if (key === 'assignedStaff' && value) {
                        content = value.name || value._id || value;
                      }
                      
                      if (key === 'status' || key === 'paymentStatus' || key === 'assignmentStatus') {
                        return <td key={key}><span className={getBadgeClass(value)}>{value || 'N/A'}</span></td>;
                      }

                      return (
                        <td key={key}>
                          {content.length > 50 ? content.substring(0, 50) + '...' : content}
                        </td>
                      );
                    })}
                  {(user?.role === 'admin' || (user?.role === 'staff' && endpoint === 'bookings')) && (
                    <td>
                        <div className="action-buttons">
                            {endpoint === 'bookings' && (
                                <button className="btn-icon" onClick={() => handlePrintManifest(item)} title="Print Manifest" style={{ color: '#10b981' }}>
                                    <i className="fas fa-print"></i>
                                </button>
                            )}
                            <button className="btn-icon edit" onClick={() => handleEditClick(item)} title="Edit">
                                <i className="fas fa-edit"></i>
                            </button>
                            {user?.role === 'admin' && (
                                <button className="btn-icon delete" onClick={() => handleDelete(item._id)} title="Delete">
                                    <i className="fas fa-trash"></i>
                                </button>
                            )}
                        </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {totalPages > 1 && (
          <div className="pagination">
              <div className="pagination-info">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} entries
              </div>
              <div className="pagination-controls">
                  <button 
                      className="page-btn" 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                  >
                      Previous
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                      <button 
                          key={i} 
                          className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
                          onClick={() => setCurrentPage(i + 1)}
                      >
                          {i + 1}
                      </button>
                  ))}
                  <button 
                      className="page-btn" 
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                  >
                      Next
                  </button>
              </div>
          </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
                <h3>{editingId ? 'Edit Record' : 'Add New Record'}</h3>
                <button className="modal-close" onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>
            
            <form onSubmit={handleSave}>
              <div className="modal-body">
                  {Object.keys(formData).map(key => {
                    if (key === 'assignedStaff' && (user?.role === 'admin' || user?.role === 'staff')) {
                        const currentStaffId = typeof formData[key] === 'object' ? formData[key]?._id : formData[key];
                        return (
                            <div key={key} className="form-group">
                                <label>Assign Staff Member</label>
                                <select 
                                    className="form-control"
                                    name={key} 
                                    value={currentStaffId || ''} 
                                    onChange={handleInputChange}
                                >
                                    <option value="">--- Select Staff Member ---</option>
                                    {staffList.map(s => (
                                        <option key={s._id} value={s._id}>{s.name} - {s.vehicleNumber || 'No Vehicle'}</option>
                                    ))}
                                </select>
                            </div>
                        );
                    }

                    if (key === 'tripDetails' && endpoint === 'bookings') {
                        return (
                            <div key={key} style={{ background: 'var(--admin-bg)', padding: '16px', borderRadius: '8px' }}>
                                <h4 style={{ margin: '0 0 12px 0', fontSize: '14px' }}>Trip Configuration</h4>
                                <div className="form-group">
                                    <label>Route Details</label>
                                    <input className="form-control" type="text" name="tripDetails.route" value={formData.tripDetails?.route || ''} onChange={handleInputChange} />
                                </div>
                                <div className="form-group" style={{ marginTop: '10px' }}>
                                    <label>Pickup Location</label>
                                    <input className="form-control" type="text" name="tripDetails.pickupLocation" value={formData.tripDetails?.pickupLocation || ''} onChange={handleInputChange} />
                                </div>
                            </div>
                        );
                    }

                    if (key === 'tripDetails' || (typeof formData[key] === 'object' && formData[key] !== null)) return null;
                    if (ignoredKeys.includes(key) && key !== 'password') return null; // We want to show 'password' field in form but not table
                    if (key === 'assignmentStatus' || key === 'paymentStatus') {
                        return (
                            <div key={key} className="form-group">
                                <label>{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                                <input className="form-control" type="text" value={formData[key]} readOnly style={{ background: '#f9fafb' }} />
                            </div>
                        );
                    }

                    return (
                        <div key={key} className="form-group">
                          <label>{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                          <input
                            className="form-control"
                            type={key === 'password' ? 'password' : 'text'}
                            name={key}
                            value={formData[key] === null || formData[key] === undefined ? '' : formData[key]}
                            onChange={handleInputChange}
                            placeholder={key === 'password' && editingId ? 'Leave blank to keep current password' : ''}
                          />
                        </div>
                    );
                  })}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTables;
