import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Contact = () => {
    const [status, setStatus] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus('Sending...');

        const data = {
            name: e.target.name.value,
            email: e.target.email.value,
            message: e.target.message.value
        };

        // Using explicit Promises (.then / .catch)
        fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            setStatus('Message sent successfully! We will get back to you soon.');
            e.target.reset();
        })
        .catch(err => {
            console.error('Error:', err);
            setStatus('Error sending message. Please try again.');
        });
    };

  return (
    <>
      <section className="page-banner-area pt-200 rpt-140 pb-100 rpb-60 rel z-1 bgs-cover text-center" style={{ backgroundImage: 'url(assets/images/backgrounds/banner.jpg)', backgroundColor: '#333' }}>
          <div className="container">
              <div className="banner-inner text-white">
                  <h1 className="page-title" style={{ color: 'white' }}>Contact Us</h1>
                  <nav aria-label="breadcrumb">
                      <ol className="breadcrumb justify-content-center">
                          <li className="breadcrumb-item"><Link to="/" style={{ color: '#ffb300' }}>Home</Link></li>
                          <li className="breadcrumb-item active" style={{ color: '#ddd' }}>Contact</li>
                      </ol>
                  </nav>
              </div>
          </div>
      </section>

      <section className="contact-form-area py-100 rel z-1">
          <div className="container" style={{ maxWidth: '800px' }}>
              <div className="section-title text-center mb-50">
                  <h2>Get In Touch</h2>
                  <p>Have questions about a destination or need help booking a tour? Let us know!</p>
              </div>
              <form onSubmit={handleSubmit} style={{ background: '#fff', padding: '40px', borderRadius: '15px', boxShadow: '0 5px 25px rgba(0,0,0,0.05)' }}>
                  {status && <div className="alert alert-info mb-4" style={{ padding: '15px', background: '#e9f7fe', color: '#3184ae', borderRadius: '5px' }}>{status}</div>}
                  <div className="row">
                      <div className="col-md-6 mb-3 rounded">
                          <label style={{ fontWeight: 'bold', marginBottom: '10px', display: 'block' }}>Full Name</label>
                          <input type="text" name="name" className="form-control" required style={{ width: '100%', padding: '12px 15px', border: '1px solid #eee', borderRadius: '8px' }} placeholder="John Doe" />
                      </div>
                      <div className="col-md-6 mb-3">
                          <label style={{ fontWeight: 'bold', marginBottom: '10px', display: 'block' }}>Email Address</label>
                          <input type="email" name="email" className="form-control" required style={{ width: '100%', padding: '12px 15px', border: '1px solid #eee', borderRadius: '8px' }} placeholder="zamin@destino.com" />
                      </div>
                      <div className="col-md-12 mb-4">
                          <label style={{ fontWeight: 'bold', marginBottom: '10px', display: 'block' }}>Message</label>
                          <textarea name="message" className="form-control" rows="5" required style={{ width: '100%', padding: '15px', border: '1px solid #eee', borderRadius: '8px', minHeight: '150px' }} placeholder="Write your inquiry here..."></textarea>
                      </div>
                      <div className="col-md-12 text-center mt-4">
                          <button type="submit" className="theme-btn style-two w-100" style={{ padding: '15px 40px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '18px', fontWeight: 'bold' }}>
                              <span data-hover="Send Message">Send Message</span>
                          </button>
                      </div>
                  </div>
              </form>
          </div>
      </section>
    </>
  );
};

export default Contact;
