import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    
    // Verification State
    const [step, setStep] = useState(1);
    const [verificationCode, setVerificationCode] = useState('');
    const [registeredEmail, setRegisteredEmail] = useState('');
    
    const { register, verifyEmailCode } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await register(name, email, password, phone);
        if (result && result.requiresVerification) {
            setRegisteredEmail(result.email);
            setStep(2);
        }
    };

    const handleVerifySubmit = async (e) => {
        e.preventDefault();
        await verifyEmailCode(registeredEmail, verificationCode);
    };

    return (
        <section className="contact-form-area rel z-1" style={{ paddingTop: '150px', paddingBottom: '70px' }}>
            <div className="container" style={{ maxWidth: '600px' }}>
                <div className="contact-form-wrap" data-aos="fade-up" data-aos-duration="1500" data-aos-offset="50">
                    {step === 1 ? (
                        <>
                            <div className="section-title text-center mb-40">
                                <h2>Create an Account</h2>
                            </div>
                            <form onSubmit={handleSubmit} className="contact-form">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" required />
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" required />
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone Number" required />
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
                                        </div>
                                    </div>
                                    <div className="col-md-12 text-center">
                                        <button type="submit" className="theme-btn style-two">
                                            <span data-hover="Register">Register</span>
                                            <i className="fal fa-arrow-right"></i>
                                        </button>
                                        <div className="mt-20">
                                            <span>Already have an account? <Link to="/login">Login</Link></span>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </>
                    ) : (
                        <>
                            <div className="section-title text-center mb-40">
                                <h2>Verify Your Email</h2>
                                <p>We've sent a 6-digit code to <strong>{registeredEmail}</strong>.</p>
                            </div>
                            <form onSubmit={handleVerifySubmit} className="contact-form">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <input 
                                                type="text" 
                                                maxLength="6"
                                                value={verificationCode} 
                                                onChange={(e) => setVerificationCode(e.target.value)} 
                                                placeholder="Enter 6-digit code" 
                                                required 
                                                style={{ textAlign: 'center', fontSize: '24px', letterSpacing: '8px' }}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-12 text-center">
                                        <button type="submit" className="theme-btn style-two w-100">
                                            <span data-hover="Verify & Login">Verify & Login</span>
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

export default Register;
