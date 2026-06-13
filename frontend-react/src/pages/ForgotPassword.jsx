import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleRequestCode = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await res.json();
            if (res.ok) {
                alert("Password reset code sent to your email!");
                setStep(2);
            } else {
                alert(data.message || "Failed to send reset code.");
            }
        } catch (err) {
            alert("An error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code, newPassword })
            });
            const data = await res.json();
            if (res.ok) {
                alert("Password has been reset successfully! You can now log in.");
                navigate('/login');
            } else {
                alert(data.message || "Failed to reset password.");
            }
        } catch (err) {
            alert("An error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="contact-form-area rel z-1" style={{ paddingTop: '150px', paddingBottom: '70px' }}>
            <div className="container" style={{ maxWidth: '600px' }}>
                <div className="contact-form-wrap" data-aos="fade-up" data-aos-duration="1500" data-aos-offset="50">
                    {step === 1 ? (
                        <>
                            <div className="section-title text-center mb-40">
                                <h2>Forgot Password</h2>
                                <p>Enter your email address and we'll send you a 6-digit code to reset your password.</p>
                            </div>
                            <form onSubmit={handleRequestCode} className="contact-form">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" required />
                                        </div>
                                    </div>
                                    <div className="col-md-12 text-center">
                                        <button type="submit" disabled={isSubmitting} className="theme-btn style-two">
                                            <span data-hover={isSubmitting ? "Sending..." : "Send Reset Code"}>
                                                {isSubmitting ? "Sending..." : "Send Reset Code"}
                                            </span>
                                        </button>
                                        <div className="mt-20">
                                            <span>Remembered your password? <Link to="/login">Back to Login</Link></span>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </>
                    ) : (
                        <>
                            <div className="section-title text-center mb-40">
                                <h2>Reset Password</h2>
                                <p>Please enter the 6-digit code sent to <strong>{email}</strong> and your new password.</p>
                            </div>
                            <form onSubmit={handleResetPassword} className="contact-form">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <input 
                                                type="text" 
                                                maxLength="6"
                                                value={code} 
                                                onChange={(e) => setCode(e.target.value)} 
                                                placeholder="6-digit reset code" 
                                                required 
                                                style={{ textAlign: 'center', fontSize: '24px', letterSpacing: '8px' }}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <input 
                                                type="password" 
                                                value={newPassword} 
                                                onChange={(e) => setNewPassword(e.target.value)} 
                                                placeholder="New Password" 
                                                required 
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-12 text-center">
                                        <button type="submit" disabled={isSubmitting} className="theme-btn style-two w-100">
                                            <span data-hover={isSubmitting ? "Resetting..." : "Reset Password"}>
                                                {isSubmitting ? "Resetting..." : "Reset Password"}
                                            </span>
                                            <i className="fal fa-check-circle"></i>
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
};

export default ForgotPassword;
