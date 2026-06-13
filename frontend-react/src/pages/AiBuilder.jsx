import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ItineraryResult from '../components/ItineraryResult';

const AiBuilder = () => {
    const [formData, setFormData] = useState({
        destination: '',
        duration: '3',
        budget: 'Moderate',
        interests: '',
        groupSize: '2'
    });
    
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResult(null);

        try {
            const response = await fetch('/api/ai/generate-itinerary', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            
            const data = await response.json();
            
            if (response.ok) {
                setResult({ trip: data.data, relatedTours: data.relatedTours });
            } else {
                setError(data.message || 'Failed to generate itinerary.');
            }
        } catch (err) {
            setError('An error occurred while connecting to the AI service.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Page Banner */}
            <section className="page-banner-area pt-200 rpt-140 pb-100 rpb-60 rel z-1 bgs-cover text-center" style={{ backgroundImage: 'url(/assets/images/backgrounds/banner.jpg)', backgroundColor: '#333' }}>
                <div className="container">
                    <div className="banner-inner text-white">
                        <h1 className="page-title" style={{ color: 'white' }}>AI Trip Builder</h1>
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb justify-content-center">
                                <li className="breadcrumb-item"><Link to="/" style={{ color: '#ffb300' }}>Home</Link></li>
                                <li className="breadcrumb-item active" style={{ color: '#ddd' }}>AI Trip Builder</li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </section>

            <section className="ai-builder-area py-5 bgc-lighter">
                <div className="container" style={{ maxWidth: '900px' }}>
                    <div className="text-center mb-5">
                        <h2 className="fw-bold">Build Your Dream Trip in Seconds</h2>
                        <p className="text-muted lead">Powered by advanced AI, tell us what you want and we'll handle the logistics.</p>
                    </div>

                    {!result && (
                        <div className="card shadow border-0" style={{ borderRadius: '15px' }}>
                            <div className="card-body p-5">
                                {error && <div className="alert alert-danger">{error}</div>}
                                
                                <form onSubmit={handleSubmit}>
                                    <div className="row g-4">
                                        <div className="col-md-12">
                                            <label className="form-label fw-bold">Where do you want to go?</label>
                                            <input type="text" name="destination" className="form-control form-control-lg" placeholder="e.g., Tokyo, Paris, Bali" value={formData.destination} onChange={handleChange} required />
                                        </div>
                                        
                                        <div className="col-md-6">
                                            <label className="form-label fw-bold">Duration (Days)</label>
                                            <input type="number" name="duration" className="form-control form-control-lg" min="1" max="14" value={formData.duration} onChange={handleChange} required />
                                        </div>
                                        
                                        <div className="col-md-6">
                                            <label className="form-label fw-bold">Budget Level</label>
                                            <select name="budget" className="form-control form-control-lg" value={formData.budget} onChange={handleChange}>
                                                <option value="Budget">Budget Backpacking</option>
                                                <option value="Moderate">Moderate / Standard</option>
                                                <option value="Luxury">Luxury & Premium</option>
                                            </select>
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label fw-bold">Group Size</label>
                                            <input type="number" name="groupSize" className="form-control form-control-lg" min="1" value={formData.groupSize} onChange={handleChange} />
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label fw-bold">Primary Interests</label>
                                            <input type="text" name="interests" className="form-control form-control-lg" placeholder="e.g., Food, History, Adventure" value={formData.interests} onChange={handleChange} />
                                        </div>
                                    </div>

                                    <div className="mt-5 text-center">
                                        <button type="submit" className="theme-btn style-two w-100" style={{ maxWidth: '400px', fontSize: '18px' }} disabled={loading}>
                                            {loading ? (
                                                <><i className="fas fa-spinner fa-spin me-2"></i> Generating your magic itinerary...</>
                                            ) : (
                                                <><i className="fas fa-magic me-2"></i> Generate AI Itinerary</>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {result && (
                        <div>
                            <div className="text-center mb-4">
                                <button className="btn btn-outline-primary" onClick={() => setResult(null)}>
                                    <i className="fas fa-arrow-left"></i> Start Over
                                </button>
                            </div>
                            <ItineraryResult trip={result.trip} relatedTours={result.relatedTours} />
                        </div>
                    )}
                </div>
            </section>
        </>
    );
};

export default AiBuilder;
