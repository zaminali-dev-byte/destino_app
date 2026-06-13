import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const ReviewSection = ({ targetId, targetType }) => {
    const { user } = useContext(AuthContext);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Form state
    const [overallRating, setOverallRating] = useState(5);
    const [guideRating, setGuideRating] = useState(5);
    const [cleanlinessRating, setCleanlinessRating] = useState(5);
    const [valueRating, setValueRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchReviews();
    }, [targetId]);

    const fetchReviews = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/reviews/${targetId}`);
            if (!res.ok) throw new Error('Failed to fetch reviews');
            const data = await res.json();
            setReviews(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return alert('Please login to submit a review');
        setSubmitting(true);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    targetId,
                    targetType,
                    overallRating,
                    guideRating: targetType === 'Tour' ? guideRating : undefined,
                    cleanlinessRating: targetType === 'Hotel' ? cleanlinessRating : undefined,
                    valueRating,
                    comment
                })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Error submitting review');
            }

            const newReview = await res.json();
            setReviews([newReview, ...reviews]);
            setComment('');
            setOverallRating(5);
            setGuideRating(5);
            setCleanlinessRating(5);
            setValueRating(5);
        } catch (err) {
            alert(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <i key={i} className={i < rating ? "fas fa-star" : "far fa-star"} style={{ color: '#ffc107', fontSize: '14px' }}></i>
        ));
    };

    if (loading) return <div>Loading reviews...</div>;

    const avgOverall = reviews.length > 0 ? (reviews.reduce((acc, curr) => acc + curr.overallRating, 0) / reviews.length).toFixed(1) : 0;

    return (
        <div style={{ marginTop: '40px', paddingTop: '30px', borderTop: '1px solid #eee' }}>
            <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
                Customer Reviews <span style={{ color: '#008234', fontSize: '18px' }}>({reviews.length})</span>
            </h3>

            {/* Averages Summary */}
            {reviews.length > 0 && (
                <div style={{ display: 'flex', gap: '30px', marginBottom: '30px', padding: '20px', background: 'rgba(0,130,52,0.05)', borderRadius: '12px' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#008234' }}>{avgOverall}</div>
                        <div style={{ color: '#666', fontSize: '14px' }}>Overall Rating</div>
                    </div>
                </div>
            )}

            {/* Review Form */}
            {user ? (
                <form onSubmit={handleSubmit} style={{ background: '#f9f9f9', padding: '20px', borderRadius: '12px', marginBottom: '30px' }}>
                    <h4 style={{ marginBottom: '15px', fontSize: '16px', fontWeight: '600' }}>Write a Review</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '15px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', marginBottom: '5px' }}>Overall Rating (1-5)</label>
                            <input type="number" min="1" max="5" value={overallRating} onChange={(e) => setOverallRating(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', marginBottom: '5px' }}>Value for Money (1-5)</label>
                            <input type="number" min="1" max="5" value={valueRating} onChange={(e) => setValueRating(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }} />
                        </div>
                        {targetType === 'Tour' && (
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', marginBottom: '5px' }}>Guide Rating (1-5)</label>
                                <input type="number" min="1" max="5" value={guideRating} onChange={(e) => setGuideRating(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }} />
                            </div>
                        )}
                        {targetType === 'Hotel' && (
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', marginBottom: '5px' }}>Cleanliness Rating (1-5)</label>
                                <input type="number" min="1" max="5" value={cleanlinessRating} onChange={(e) => setCleanlinessRating(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }} />
                            </div>
                        )}
                    </div>
                    <textarea 
                        rows="3" 
                        placeholder="Share your experience..." 
                        value={comment} 
                        onChange={(e) => setComment(e.target.value)}
                        required
                        style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ddd', marginBottom: '15px', resize: 'vertical' }}
                    ></textarea>
                    <button type="submit" disabled={submitting} style={{ background: '#008234', color: 'white', padding: '10px 24px', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: submitting ? 'not-allowed' : 'pointer' }}>
                        {submitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                </form>
            ) : (
                <div style={{ padding: '20px', background: '#fff3cd', color: '#856404', borderRadius: '8px', marginBottom: '30px' }}>
                    Please login to leave a review.
                </div>
            )}

            {/* Reviews List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {reviews.length === 0 ? (
                    <p style={{ color: '#666' }}>No reviews yet. Be the first to review!</p>
                ) : (
                    reviews.map(review => (
                        <div key={review._id} style={{ borderBottom: '1px solid #eee', paddingBottom: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                                <div>
                                    <div style={{ fontWeight: 'bold', fontSize: '15px' }}>{review.user?.name || 'Anonymous User'}</div>
                                    <div style={{ color: '#999', fontSize: '12px' }}>{new Date(review.createdAt).toLocaleDateString()}</div>
                                </div>
                                <div style={{ display: 'flex', gap: '4px' }}>
                                    {renderStars(review.overallRating)}
                                </div>
                            </div>
                            <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#444' }}>{review.comment}</p>
                            <div style={{ display: 'flex', gap: '15px', marginTop: '10px', fontSize: '12px', color: '#666' }}>
                                {review.valueRating && <span>Value: {renderStars(review.valueRating)}</span>}
                                {review.guideRating && <span>Guide: {renderStars(review.guideRating)}</span>}
                                {review.cleanlinessRating && <span>Cleanliness: {renderStars(review.cleanlinessRating)}</span>}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ReviewSection;
