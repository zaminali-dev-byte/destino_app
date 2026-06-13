import React, { useState } from 'react';

const Careers = () => {
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        fetch('/api/applications', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(resData => {
            setSubmitting(false);
            if (resData.message) {
                alert('Error: ' + resData.message);
            } else {
                alert('Application submitted successfully! Our admin team will review it.');
                e.target.reset();
            }
        })
        .catch(err => {
            setSubmitting(false);
            alert('Failed to submit application.');
        });
    };

    return (
        <section className="pt-150 pb-100 bgc-lighter">
            <div className="container" style={{ maxWidth: '800px', background: '#fff', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                <div className="text-center mb-40">
                    <h2 style={{ fontSize: '32px', marginBottom: '15px' }}>Join the Destino Staff</h2>
                    <p style={{ color: '#555', fontSize: '18px' }}>We are looking for exceptional individuals to join our platform team as Staff operators.</p>
                </div>
                
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Full Name *</label>
                            <input type="text" name="name" required style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Email Address *</label>
                            <input type="email" name="email" required style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Phone Number *</label>
                            <input type="tel" name="phone" required style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>CNIC Number *</label>
                            <input type="text" name="cnic" placeholder="e.g. 12345-6789012-3" required style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Highest Education Degree *</label>
                        <input type="text" name="education" placeholder="e.g. Bachelor's in Hospitality" required style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Professional License / Certificates (Optional)</label>
                        <input type="text" name="license" placeholder="e.g. Certified Travel Associate (CTA)" style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Cover Letter / Relevant Experience</label>
                        <textarea name="coverLetter" placeholder="Why would you be a great fit for the Destino staff team?" rows="5" style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}></textarea>
                    </div>

                    <button type="submit" disabled={submitting} className="theme-btn style-two mt-10" style={{ padding: '15px', fontSize: '18px' }}>
                        <span data-hover={submitting ? "Submitting..." : "Submit Application"}>{submitting ? "Submitting..." : "Submit Application"}</span>
                    </button>
                </form>
            </div>
        </section>
    );
};

export default Careers;
