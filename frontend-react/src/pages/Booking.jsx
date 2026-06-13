import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Booking = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [destination, setDestination] = useState(null);
    const [date, setDate] = useState('');
    const [guests, setGuests] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState('Online Banking');
    
    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
            fetch(`/api/destinations/${id}`)
                .then(res => res.json())
                .then(data => setDestination(data))
                .catch(err => console.error(err));
        }
    }, [id, user, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const bookingData = {
            customerName: user.name,
            email: user.email,
            phone: user.phone || 'N/A',
            destinationId: id,
            date,
            guests,
            paymentMethod
        };

        fetch('/api/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookingData)
        })
        .then(res => res.json())
        .then(data => {
            alert('Booking submitted successfully! Our team will contact you soon.');
            navigate('/');
        })
        .catch(err => {
            console.error(err);
            alert('Failed to submit booking.');
        });
    };

    if (!destination) return <div className="text-center py-100">Loading...</div>;

    return (
        <section className="contact-form-area py-100 rel z-1">
            <div className="container" style={{ maxWidth: '600px' }}>
                <div className="contact-form-wrap" data-aos="fade-up" data-aos-duration="1500" data-aos-offset="50">
                    <div className="section-title text-center mb-40">
                        <h2>Book Your Trip to {destination.name}</h2>
                        <p>{destination.location}</p>
                    </div>
                    <form onSubmit={handleSubmit} className="contact-form">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="form-group">
                                    <label>Booking Date</label>
                                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                                </div>
                            </div>
                            <div className="col-md-12">
                                <div className="form-group">
                                    <label>Number of Guests</label>
                                    <input type="number" min="1" value={guests} onChange={(e) => setGuests(e.target.value)} required />
                                </div>
                            </div>
                            <div className="col-md-12 mb-20">
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '10px' }}>Payment Method</label>
                                <div style={{ display: 'flex', gap: '20px' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                        <input type="radio" value="Online Banking" checked={paymentMethod === 'Online Banking'} onChange={(e) => setPaymentMethod(e.target.value)} />
                                        <span>Online Banking / Transfer</span>
                                    </label>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                        <input type="radio" value="Cash" checked={paymentMethod === 'Cash'} onChange={(e) => setPaymentMethod(e.target.value)} />
                                        <span>Cash / Pay on Arrival</span>
                                    </label>
                                </div>
                            </div>

                            {paymentMethod === 'Online Banking' && (
                                <div className="col-md-12 mb-30">
                                    <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px dashed #0071c2' }}>
                                        <h4 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#0071c2' }}><i className="fas fa-university"></i> Official Company Bank Details</h4>
                                        <p style={{ margin: '0 0 5px 0', fontSize: '14px' }}><strong>Bank Name:</strong> Destino Official Trust Bank</p>
                                        <p style={{ margin: '0 0 5px 0', fontSize: '14px' }}><strong>Account Title:</strong> Destino Tours & Travels</p>
                                        <p style={{ margin: '0 0 5px 0', fontSize: '14px' }}><strong>IBAN / Account No:</strong> PK36 DEST 1234 5678 9012 34</p>
                                        <p style={{ margin: 0, fontSize: '12px', color: '#666', marginTop: '10px' }}>* Please complete your transfer and keep the receipt. Our staff may ask to verify it upon arrival.</p>
                                    </div>
                                </div>
                            )}

                            <div className="col-md-12 text-center">
                                <button type="submit" className="theme-btn style-two">
                                    <span data-hover="Confirm Booking">Confirm Booking</span>
                                    <i className="fal fa-arrow-right"></i>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Booking;
