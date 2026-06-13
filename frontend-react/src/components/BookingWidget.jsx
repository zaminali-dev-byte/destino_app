import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

/* ─────────────────────────────────────────────────────────────────────────────
   BookingWidget — Reusable sticky booking sidebar
   Props:
     type  : 'tour' | 'hotel'
     item  : tour or hotel object from API
   ───────────────────────────────────────────────────────────────────────────── */
const BookingWidget = ({ type, item }) => {
    const navigate  = useNavigate();
    const { user }  = useContext(AuthContext);

    // ── Form state ────────────────────────────────────────────────────────────
    const [date,          setDate]          = useState('');
    const [guests,        setGuests]        = useState(1);
    const [couponInput,   setCouponInput]   = useState('');
    const [coupon,        setCoupon]        = useState(null);   // validated coupon result
    const [couponLoading, setCouponLoading] = useState(false);
    const [couponError,   setCouponError]   = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Credit Card');
    const [cardNum,       setCardNum]       = useState('');
    const [cardExpiry,    setCardExpiry]    = useState('');
    const [cardCvc,       setCardCvc]       = useState('');
    const [isProcessing,  setIsProcessing]  = useState(false);
    
    // ── Phase 3 Loyalty Points state ───────────────────────────────────────────
    const [fullProfile,   setFullProfile]   = useState(null);
    const [applyPoints,   setApplyPoints]   = useState(false);

    React.useEffect(() => {
        if (user && user._id) {
            fetch(`/api/users/${user._id}`)
                .then(res => res.json())
                .then(data => {
                    if (data && data._id) setFullProfile(data);
                });
        }
    }, [user]);

    // ── Confirmation modal state ───────────────────────────────────────────────
    const [confirmation,  setConfirmation]  = useState(null); // { bookingId, txId, total, saved }

    // ── Price calculation ─────────────────────────────────────────────────────
    const unitPrice = type === 'tour'
        ? (item?.price || 0)
        : parseInt((item?.priceInfo || '0').replace(/[^0-9]/g, '')) || 0;

    const subtotal        = unitPrice * guests;
    const couponDiscount  = coupon?.valid ? coupon.discountAmount : 0;
    
    // Loyalty points: 100 points = $1 discount
    const availablePoints = fullProfile?.loyaltyPoints || 0;
    const maxPointsToUse  = Math.min(availablePoints, subtotal * 100); // Can't discount more than subtotal
    const pointsDiscount  = applyPoints ? (maxPointsToUse / 100) : 0;
    
    const discountAmount  = couponDiscount + pointsDiscount;
    const total           = Math.max(0, subtotal - discountAmount);

    // ── Accent colour per type ────────────────────────────────────────────────
    const accent = type === 'tour' ? '#0071c2' : '#008234';
    const bg     = type === 'tour' ? '#ecf4fd' : '#e1f4e5';
    const border = type === 'tour' ? `1px solid #0071c2` : `1px solid #008234`;
    const btnBg  = type === 'tour' ? '#0071c2' : '#0071c2';

    // ── Coupon apply ──────────────────────────────────────────────────────────
    const handleApplyCoupon = async () => {
        if (!couponInput.trim()) return;
        setCouponLoading(true);
        setCouponError('');
        setCoupon(null);
        try {
            const res = await fetch('/api/coupons/validate', {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({ code: couponInput.trim(), subtotal })
            });
            const data = await res.json();
            if (data.valid) {
                setCoupon(data);
            } else {
                setCouponError(data.message || 'Invalid coupon code.');
            }
        } catch {
            setCouponError('Could not validate coupon. Please try again.');
        } finally {
            setCouponLoading(false);
        }
    };

    const handleRemoveCoupon = () => {
        setCoupon(null);
        setCouponInput('');
        setCouponError('');
    };

    // ── Submit booking + payment ─────────────────────────────────────────────
    const handleReserve = async (e) => {
        e.preventDefault();
        if (!user) {
            navigate('/login');
            return;
        }
        setIsProcessing(true);

        try {
            // 1. Create Booking
            const bookingPayload = {
                customerName:   user.name,
                email:          user.email,
                phone:          user.phone || 'N/A',
                date,
                guests,
                baseAmount:     subtotal,
                discountAmount: discountAmount,
                totalAmount:    total,
                couponCode:     coupon?.valid ? coupon.code : null
            };

            if (type === 'tour')  bookingPayload.tourId  = item._id;
            if (type === 'hotel') bookingPayload.hotelId = item._id;

            const bookRes = await fetch('/api/bookings', {
                method:  'POST',
                headers: {
                    'Content-Type':  'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(bookingPayload)
            });
            const bookResult = await bookRes.json();
            if (!bookRes.ok) throw new Error(bookResult.message || 'Failed to create booking.');

            // 2. Process Payment
            const payRes = await fetch('/api/payments', {
                method:  'POST',
                headers: {
                    'Content-Type':  'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    bookingId:      bookResult._id,
                    amount:         total,
                    paymentMethod,
                    couponCode:     coupon?.valid ? coupon.code : null,
                    discountAmount: discountAmount
                })
            });
            const payResult = await payRes.json();
            if (!payRes.ok) throw new Error(payResult.message || 'Payment failed.');

            // 3. Show confirmation modal
            setConfirmation({
                bookingId: bookResult._id,
                txId:      payResult.transactionId,
                total,
                saved:     discountAmount,
                method:    paymentMethod,
                name:      item?.title || item?.name || 'Your Trip',
                date,
                guests
            });
        } catch (err) {
            alert(err.message || 'An error occurred. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    // ── Confirmation Modal ────────────────────────────────────────────────────
    if (confirmation) {
        return (
            <div style={{
                position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 9999, padding: '20px'
            }}>
                <div style={{
                    background: '#fff', borderRadius: '12px', maxWidth: '480px',
                    width: '100%', padding: '40px', textAlign: 'center',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.3)', animation: 'fadeInUp 0.4s ease'
                }}>
                    {/* Animated checkmark */}
                    <div style={{
                        width: '80px', height: '80px', borderRadius: '50%',
                        background: 'linear-gradient(135deg,#00b09b,#008234)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 25px', fontSize: '36px', color: '#fff',
                        boxShadow: '0 4px 20px rgba(0,128,52,0.4)'
                    }}>✓</div>

                    <h2 style={{ fontSize: '26px', fontWeight: 'bold', color: '#1a1a1a', margin: '0 0 8px' }}>
                        Booking Confirmed!
                    </h2>
                    <p style={{ color: '#666', fontSize: '15px', margin: '0 0 30px' }}>
                        Your reservation has been processed successfully.
                    </p>

                    {/* Details grid */}
                    <div style={{
                        background: '#f8f9fa', borderRadius: '8px',
                        padding: '20px', marginBottom: '25px', textAlign: 'left'
                    }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '14px' }}>
                            <div>
                                <div style={{ color: '#888', marginBottom: '2px' }}>Property</div>
                                <div style={{ fontWeight: 'bold', color: '#222' }}>{confirmation.name}</div>
                            </div>
                            <div>
                                <div style={{ color: '#888', marginBottom: '2px' }}>Date</div>
                                <div style={{ fontWeight: 'bold', color: '#222' }}>
                                    {new Date(confirmation.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </div>
                            </div>
                            <div>
                                <div style={{ color: '#888', marginBottom: '2px' }}>Guests</div>
                                <div style={{ fontWeight: 'bold', color: '#222' }}>{confirmation.guests}</div>
                            </div>
                            <div>
                                <div style={{ color: '#888', marginBottom: '2px' }}>Payment</div>
                                <div style={{ fontWeight: 'bold', color: '#222' }}>{confirmation.method}</div>
                            </div>
                        </div>

                        <div style={{ borderTop: '1px solid #eee', marginTop: '15px', paddingTop: '15px' }}>
                            {coupon?.valid && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#008234', fontSize: '14px', marginBottom: '8px', fontWeight: 'bold' }}>
                                    <span>🎟 Coupon Savings</span>
                                    <span>- ${coupon.discountAmount.toFixed(2)}</span>
                                </div>
                            )}
                            {applyPoints && pointsDiscount > 0 && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#b45309', fontSize: '14px', marginBottom: '8px', fontWeight: 'bold' }}>
                                    <span><i className="fas fa-star"></i> Loyalty Points</span>
                                    <span>- ${pointsDiscount.toFixed(2)}</span>
                                </div>
                            )}
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 'bold', color: '#222' }}>
                                <span>Total Paid</span>
                                <span>US${confirmation.total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Transaction ID */}
                    <div style={{
                        background: '#f0f7ff', border: '1px solid #d0e4f7',
                        borderRadius: '6px', padding: '10px', marginBottom: '25px',
                        fontSize: '12px', color: '#555'
                    }}>
                        <span style={{ color: '#888' }}>Transaction ID: </span>
                        <span style={{ fontWeight: 'bold', fontFamily: 'monospace', color: '#0071c2' }}>
                            {confirmation.txId}
                        </span>
                    </div>

                    {/* Action buttons */}
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                            onClick={() => navigate('/dashboard')}
                            style={{
                                flex: 1, padding: '14px', background: '#0071c2',
                                color: '#fff', border: 'none', borderRadius: '6px',
                                fontSize: '15px', fontWeight: 'bold', cursor: 'pointer'
                            }}
                        >
                            View My Bookings
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            style={{
                                flex: 1, padding: '14px', background: '#f5f5f5',
                                color: '#333', border: '1px solid #ddd', borderRadius: '6px',
                                fontSize: '15px', cursor: 'pointer'
                            }}
                        >
                            Back to Home
                        </button>
                    </div>
                </div>

                <style>{`
                    @keyframes fadeInUp {
                        from { opacity: 0; transform: translateY(30px); }
                        to   { opacity: 1; transform: translateY(0); }
                    }
                `}</style>
            </div>
        );
    }

    // ── Main Widget UI ────────────────────────────────────────────────────────
    return (
        <div style={{
            position: 'sticky', top: '120px', background: bg,
            padding: '25px', borderRadius: '8px', border
        }}>
            <h3 style={{ fontSize: '20px', color: '#333', marginBottom: '20px', fontWeight: 'bold' }}>
                {type === 'tour' ? 'Reserve your trip' : 'Reserve your stay'}
            </h3>

            <form onSubmit={handleReserve}>
                {/* ── Date + Guests ─────────────────────────────────── */}
                <div style={{ background: '#fff', borderRadius: '4px', border: '1px solid #ccc', marginBottom: '15px' }}>
                    <div style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
                        <label style={labelStyle}>
                            {type === 'tour' ? 'Departure Date' : 'Check-in Date'}
                        </label>
                        <input
                            type="date"
                            value={date}
                            min={new Date().toISOString().split('T')[0]}
                            onChange={e => setDate(e.target.value)}
                            required
                            style={{ border: 'none', outline: 'none', width: '100%', color: '#222', fontSize: '14px' }}
                        />
                    </div>

                    <div style={{ padding: '10px', borderBottom: user ? '1px solid #ccc' : 'none' }}>
                        <label style={labelStyle}>{type === 'tour' ? 'Guests' : 'Rooms & Guests'}</label>
                        <select
                            value={guests}
                            onChange={e => { setGuests(parseInt(e.target.value)); setCoupon(null); }}
                            style={{ border: 'none', outline: 'none', width: '100%', color: '#222', fontSize: '14px' }}
                        >
                            {[1,2,3,4,5,6,7,8,9,10].map(n => (
                                <option key={n} value={n}>
                                    {n} {n === 1 ? 'Adult' : 'Adults'}{type === 'hotel' ? ', 1 Room' : ''}
                                </option>
                            ))}
                        </select>
                    </div>

                    {user && (
                        <div style={{ padding: '10px', background: '#f9f9f9', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                            <label style={labelStyle}>Booking Details</label>
                            <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#333' }}>{user.name}</span>
                            <span style={{ fontSize: '12px', color: '#777' }}>{user.email}</span>
                        </div>
                    )}
                </div>

                {/* ── Coupon Code ───────────────────────────────────── */}
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ ...labelStyle, fontSize: '12px', display: 'block', marginBottom: '6px' }}>
                        🎟 Have a coupon code?
                    </label>

                    {!coupon?.valid ? (
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <input
                                type="text"
                                value={couponInput}
                                onChange={e => { setCouponInput(e.target.value.toUpperCase()); setCouponError(''); }}
                                placeholder="e.g. SUMMER20"
                                style={{
                                    flex: 1, padding: '9px 12px', border: '1px solid #ccc',
                                    borderRadius: '4px', fontSize: '13px', fontFamily: 'monospace',
                                    letterSpacing: '1px', textTransform: 'uppercase'
                                }}
                            />
                            <button
                                type="button"
                                onClick={handleApplyCoupon}
                                disabled={couponLoading || !couponInput.trim()}
                                style={{
                                    padding: '9px 14px', background: accent, color: '#fff',
                                    border: 'none', borderRadius: '4px', fontSize: '13px',
                                    fontWeight: 'bold', cursor: 'pointer', whiteSpace: 'nowrap',
                                    opacity: (couponLoading || !couponInput.trim()) ? 0.6 : 1
                                }}
                            >
                                {couponLoading ? '...' : 'Apply'}
                            </button>
                        </div>
                    ) : (
                        <div style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            background: '#e8f5e9', border: '1px solid #a5d6a7',
                            borderRadius: '4px', padding: '10px 12px'
                        }}>
                            <span style={{ color: '#2e7d32', fontSize: '13px', fontWeight: 'bold' }}>
                                ✓ {coupon.code} — {coupon.message}
                            </span>
                            <button
                                type="button"
                                onClick={handleRemoveCoupon}
                                style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '16px' }}
                                title="Remove coupon"
                            >×</button>
                        </div>
                    )}

                    {couponError && (
                        <div style={{
                            marginTop: '6px', background: '#fdecea', border: '1px solid #f5c6cb',
                            borderRadius: '4px', padding: '8px 12px',
                            color: '#c0392b', fontSize: '12px', fontWeight: 'bold'
                        }}>
                            ✗ {couponError}
                        </div>
                    )}
                </div>

                {/* ── Payment Method ────────────────────────────────── */}
                <div style={{ background: '#fff', borderRadius: '4px', border: '1px solid #ccc', marginBottom: '15px' }}>
                    <div style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
                        <label style={labelStyle}>Payment Method</label>
                        <select
                            value={paymentMethod}
                            onChange={e => setPaymentMethod(e.target.value)}
                            style={{ border: 'none', outline: 'none', width: '100%', fontSize: '14px', color: '#222' }}
                        >
                            <option value="Credit Card">💳 Credit Card</option>
                            <option value="PayPal">🅿 PayPal</option>
                            <option value="Bank Transfer">🏦 Bank Transfer</option>
                        </select>
                    </div>

                    {paymentMethod === 'Credit Card' && (
                        <div style={{ padding: '12px' }}>
                            <input
                                type="text"
                                placeholder="Card Number (e.g. 4242 4242 4242 4242)"
                                value={cardNum}
                                onChange={e => setCardNum(e.target.value.replace(/\D/g,'').slice(0,16).replace(/(.{4})/g,'$1 ').trim())}
                                required
                                maxLength={19}
                                style={cardInputStyle}
                            />
                            <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                                <input
                                    type="text"
                                    placeholder="MM/YY"
                                    value={cardExpiry}
                                    onChange={e => {
                                        let v = e.target.value.replace(/\D/g,'').slice(0,4);
                                        if (v.length > 2) v = v.slice(0,2) + '/' + v.slice(2);
                                        setCardExpiry(v);
                                    }}
                                    required
                                    maxLength={5}
                                    style={{ ...cardInputStyle, width: '50%' }}
                                />
                                <input
                                    type="text"
                                    placeholder="CVC"
                                    value={cardCvc}
                                    onChange={e => setCardCvc(e.target.value.replace(/\D/g,'').slice(0,3))}
                                    required
                                    maxLength={3}
                                    style={{ ...cardInputStyle, width: '50%' }}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Price Breakdown ───────────────────────────────── */}
                <div style={{ marginBottom: '20px', fontSize: '14px', color: '#444' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span>US${unitPrice} × {guests} {guests===1?'adult':'adults'}</span>
                        <span>US${subtotal.toFixed(2)}</span>
                    </div>

                    {coupon?.valid && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#2e7d32', fontWeight: 'bold', marginBottom: '8px' }}>
                            <span>🎟 Coupon discount</span>
                            <span>− US${coupon.discountAmount.toFixed(2)}</span>
                        </div>
                    )}

                    {fullProfile && fullProfile.loyaltyPoints > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', background: '#fef3c7', padding: '8px', borderRadius: '4px' }}>
                            <label style={{ margin: 0, fontSize: '13px', color: '#b45309', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <input type="checkbox" checked={applyPoints} onChange={(e) => setApplyPoints(e.target.checked)} />
                                Use {maxPointsToUse} Loyalty Points (-${(maxPointsToUse / 100).toFixed(2)})
                            </label>
                        </div>
                    )}

                    <div style={{
                        borderTop: '1px solid #ccc', paddingTop: '12px', marginTop: '8px',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                    }}>
                        <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#333' }}>Total to pay now</span>
                        <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#222' }}>US${total.toFixed(2)}</span>
                    </div>
                </div>

                {/* ── Submit Button ─────────────────────────────────── */}
                {user ? (
                    <button
                        type="submit"
                        disabled={isProcessing}
                        style={{
                            width: '100%', padding: '15px 0', background: btnBg,
                            color: '#fff', border: 'none', borderRadius: '4px',
                            fontSize: '17px', fontWeight: 'bold', cursor: 'pointer',
                            opacity: isProcessing ? 0.7 : 1,
                            transition: 'opacity 0.2s'
                        }}
                    >
                        {isProcessing ? '⏳ Processing...' : '🔒 Pay & Confirm'}
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={() => navigate('/login', { state: { from: window.location.pathname } })}
                        style={{
                            width: '100%', padding: '15px 0', background: '#e74c3c',
                            color: '#fff', border: 'none', borderRadius: '4px',
                            fontSize: '17px', fontWeight: 'bold', cursor: 'pointer'
                        }}
                    >
                        🔑 Login to Book
                    </button>
                )}

                <p style={{ textAlign: 'center', fontSize: '11px', color: '#999', marginTop: '12px', marginBottom: 0 }}>
                    🔐 Secure encrypted transaction · No hidden fees
                </p>
            </form>
        </div>
    );
};

const labelStyle = {
    fontSize: '10px', fontWeight: 'bold', color: '#555',
    display: 'block', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.5px'
};

const cardInputStyle = {
    border: '1px solid #ddd', padding: '9px', width: '100%',
    borderRadius: '4px', fontSize: '13px', fontFamily: 'monospace', outline: 'none'
};

export default BookingWidget;
