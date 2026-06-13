import React, { useState } from 'react';

import { Link } from 'react-router-dom';

const ItineraryResult = ({ trip, relatedTours }) => {
    const [openDay, setOpenDay] = useState(0); // First day open by default
    const [expandedActivities, setExpandedActivities] = useState({});

    const toggleActivity = (dayIndex, actIndex) => {
        const key = `${dayIndex}-${actIndex}`;
        setExpandedActivities(prev => ({ ...prev, [key]: !prev[key] }));
    };

    if (!trip) return null;

    return (
        <div className="itinerary-result mt-5">
            <div className="card shadow-sm border-0" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                <div className="card-header bg-primary text-white p-4" style={{ background: 'linear-gradient(135deg, #0071c2, #0056b3)' }}>
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <span className="badge bg-warning text-dark mb-2">AI Generated</span>
                            <h2 className="m-0 text-white"><i className="fal fa-map-marked-alt"></i> {trip.duration} in {trip.destination}</h2>
                        </div>
                        <div className="text-end">
                            <div className="fs-5 fw-bold">{trip.budget} Budget</div>
                            <div className="small text-light">{trip.groupSize} Travelers</div>
                        </div>
                    </div>
                </div>
                
                <div className="card-body p-4 bgc-lighter">
                    <p className="lead mb-4 pb-3 border-bottom">{trip.summary}</p>
                    
                    <div className="timeline-itinerary accordion" id="itineraryAccordion">
                        {trip.itinerary.map((day, index) => (
                            <div key={index} className="accordion-item mb-4 bg-white rounded shadow-sm border-0" style={{ overflow: 'hidden' }}>
                                <h2 className="accordion-header" id={`heading${index}`}>
                                    <button 
                                        className={`accordion-button ${openDay === index ? '' : 'collapsed'} bg-white`} 
                                        type="button" 
                                        onClick={() => setOpenDay(openDay === index ? -1 : index)}
                                        style={{ padding: '20px', boxShadow: 'none', borderBottom: openDay === index ? '1px solid #eee' : 'none' }}
                                    >
                                        <div className="d-flex justify-content-between align-items-center w-100 me-3">
                                            <h4 className="m-0 text-primary">Day {day.day}: {day.title}</h4>
                                            <span className="text-muted small"><i className="fal fa-bed"></i> {day.accommodation}</span>
                                        </div>
                                    </button>
                                </h2>
                                
                                <div id={`collapse${index}`} className={`accordion-collapse collapse ${openDay === index ? 'show' : ''}`}>
                                    <div className="accordion-body bgc-lighter p-4">
                                        <div className="activities-list">
                                            {day.activities.map((act, i) => {
                                                const isExpanded = expandedActivities[`${index}-${i}`];
                                                return (
                                                    <div 
                                                        key={i} 
                                                        className="activity-item bg-white p-3 rounded shadow-sm border mb-3" 
                                                        style={{ borderColor: 'var(--admin-border)', cursor: 'pointer', transition: 'all 0.3s ease' }}
                                                        onClick={() => toggleActivity(index, i)}
                                                    >
                                                        <div className="d-flex align-items-center justify-content-between">
                                                            <div className="d-flex align-items-center">
                                                                <div className="time-badge bg-light text-primary fw-bold p-2 rounded text-center me-3" style={{ minWidth: '90px', border: '1px solid #e0e0e0' }}>
                                                                    {act.time}
                                                                </div>
                                                                <div className="text-muted small">
                                                                    <span className="me-3"><i className="fal fa-map-marker-alt text-danger"></i> {act.location}</span>
                                                                    <span><i className="fal fa-wallet text-success"></i> {act.cost}</span>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <i className={`fal fa-chevron-${isExpanded ? 'up' : 'down'} text-muted`}></i>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className={`activity-description collapse ${isExpanded ? 'show' : ''}`}>
                                                            <div className="mt-3 pt-3 border-top">
                                                                <p className="mb-0 text-dark" style={{ fontSize: '15px', color: '#333' }}>
                                                                    {act.description || act.activity || 'No description available for this activity.'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="text-center mt-4">
                        <button className="theme-btn style-two w-100" style={{ maxWidth: '300px' }}>
                            <i className="fas fa-bookmark"></i> Save This Itinerary
                        </button>
                    </div>

                    {relatedTours && relatedTours.length > 0 && (
                        <div className="mt-5 pt-4 border-top">
                            <h3 className="mb-4 text-center"><i className="fal fa-suitcase text-primary me-2"></i> Actual Offers Related to Your Trip</h3>
                            <div className="row justify-content-center">
                                {relatedTours.map((tour) => (
                                    <div className="col-md-4 mb-4" key={tour._id}>
                                        <div className="card shadow-sm h-100 border-0" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                                            <div style={{ height: '160px', overflow: 'hidden', backgroundColor: '#f1f5f9' }}>
                                                {tour.imageUrl ? (
                                                    <img src={`/${tour.imageUrl}`} alt={tour.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : (
                                                    <div className="d-flex h-100 align-items-center justify-content-center text-muted">
                                                        <i className="fal fa-image fa-3x"></i>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="card-body p-3">
                                                <h5 className="card-title" style={{ fontSize: '16px', fontWeight: 'bold' }}>{tour.title}</h5>
                                                <p className="text-muted small mb-2"><i className="fal fa-clock me-1"></i> {tour.duration}</p>
                                                <div className="d-flex justify-content-between align-items-center mt-3">
                                                    <span className="text-primary fw-bold">${tour.price}</span>
                                                    <Link to={`/tour/${tour._id}`} className="btn btn-sm btn-outline-primary">View Deal</Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ItineraryResult;
