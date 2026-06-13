import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const MemoBoard = () => {
    const { user } = useContext(AuthContext);
    const [memos, setMemos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ title: '', content: '', departmentTarget: 'All' });

    const departments = ['All', 'Human Resources', 'Finance', 'Sales', 'Information Technology', 'Marketing', 'Transport', 'Operations', 'Field Operations', 'Customer Service'];

    const fetchMemos = async () => {
        try {
            const res = await fetch('/api/memos', {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            const data = await res.json();
            setMemos(Array.isArray(data) ? data : []);
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch memos", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMemos();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/memos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                setShowModal(false);
                setFormData({ title: '', content: '', departmentTarget: 'All' });
                fetchMemos();
            } else {
                alert("Failed to post memo");
            }
        } catch (err) {
            alert("Error posting memo");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this memo?")) return;
        try {
            const res = await fetch(`/api/memos/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            if (res.ok) {
                setMemos(memos.filter(m => m._id !== id));
            } else {
                alert("Failed to delete");
            }
        } catch (err) {
            alert("Error deleting memo");
        }
    };

    if (loading) return <div className="text-center py-50"><div className="spinner-border"></div></div>;

    return (
        <div className="memo-board-container" style={{ background: '#f5f7fa', padding: '30px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h3 style={{ margin: 0, color: '#2c3e50' }}><i className="fas fa-clipboard-list"></i> Internal Memo Board</h3>
                <button onClick={() => setShowModal(true)} className="theme-btn style-one" style={{ padding: '10px 20px', borderRadius: '8px' }}>
                    <span data-hover="Post New Memo"><i className="fas fa-plus"></i> Post New Memo</span>
                </button>
            </div>

            {memos.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '50px', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <i className="far fa-folder-open" style={{ fontSize: '40px', color: '#cbd5e1', marginBottom: '15px' }}></i>
                    <p style={{ color: '#64748b' }}>No memos found for your department.</p>
                </div>
            ) : (
                <div className="row">
                    {memos.map(memo => (
                        <div className="col-md-6 mb-30" key={memo._id}>
                            <div style={{ background: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', height: '100%', position: 'relative' }}>
                                {(user._id === memo.author?._id || user.role === 'admin') && (
                                    <button onClick={() => handleDelete(memo._id)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                                        <i className="fas fa-trash"></i>
                                    </button>
                                )}
                                <div style={{ marginBottom: '15px' }}>
                                    <span style={{ background: memo.departmentTarget === 'All' ? '#e2e8f0' : '#dbeafe', color: memo.departmentTarget === 'All' ? '#475569' : '#1e40af', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
                                        To: {memo.departmentTarget}
                                    </span>
                                    <span style={{ float: 'right', fontSize: '12px', color: '#94a3b8' }}>
                                        {new Date(memo.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <h4 style={{ fontSize: '18px', margin: '0 0 15px 0', color: '#1e293b' }}>{memo.title}</h4>
                                <p style={{ color: '#475569', fontSize: '14px', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{memo.content}</p>
                                <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: '#0ea5e9', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                        {memo.author?.name ? memo.author.name.charAt(0).toUpperCase() : 'A'}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#334155' }}>{memo.author?.name || 'Unknown User'}</div>
                                        <div style={{ fontSize: '11px', color: '#64748b' }}>{memo.author?.position || memo.author?.department || memo.author?.role}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', width: '100%', maxWidth: '600px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <h3 style={{ margin: 0 }}>Compose Memo</h3>
                            <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>&times;</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group mb-20">
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Target Audience</label>
                                <select 
                                    className="form-control" 
                                    value={formData.departmentTarget} 
                                    onChange={e => setFormData({...formData, departmentTarget: e.target.value})}
                                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                                >
                                    {departments.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                            <div className="form-group mb-20">
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Subject / Title</label>
                                <input 
                                    type="text" 
                                    required 
                                    className="form-control" 
                                    value={formData.title} 
                                    onChange={e => setFormData({...formData, title: e.target.value})}
                                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                                />
                            </div>
                            <div className="form-group mb-25">
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Message Content</label>
                                <textarea 
                                    required 
                                    className="form-control" 
                                    rows="6"
                                    value={formData.content} 
                                    onChange={e => setFormData({...formData, content: e.target.value})}
                                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', resize: 'vertical' }}
                                ></textarea>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary" style={{ padding: '10px 20px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff' }}>Cancel</button>
                                <button type="submit" className="theme-btn style-one" style={{ padding: '10px 25px', borderRadius: '6px' }}>Post Memo</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MemoBoard;
