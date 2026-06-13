import React from 'react';
import { Link } from 'react-router-dom';

const Blog = () => {
  const blogs = [
    { id: 1, title: 'Top 10 Hidden Valleys in Northern Pakistan', date: 'March 15, 2026', img: '/assets/images/blog/blog-list1.jpg', desc: 'Discover untouched paradises hidden away from mainstream tourism trails.' },
    { id: 2, title: 'Essential Gear for Your Next Mountain Trek', date: 'April 02, 2026', img: '/assets/images/blog/blog-list2.jpg', desc: 'Packing light while staying safe during altitude changes is an art.' },
    { id: 3, title: 'A Culinary Journey Through Skardu', date: 'April 10, 2026', img: '/assets/images/blog/blog-list3.jpg', desc: 'Exploring the rich, hearty cuisines of the mountains that will leave you wanting more.' }
  ];

  return (
    <>
      <section className="page-banner-area pt-200 rpt-140 pb-100 rpb-60 rel z-1 bgs-cover text-center" style={{ backgroundImage: 'url(assets/images/backgrounds/banner.jpg)', backgroundColor: '#333' }}>
          <div className="container">
              <div className="banner-inner text-white">
                  <h1 className="page-title" style={{ color: 'white' }}>Travel Blog</h1>
                  <nav aria-label="breadcrumb">
                      <ol className="breadcrumb justify-content-center">
                          <li className="breadcrumb-item"><Link to="/" style={{ color: '#ffb300' }}>Home</Link></li>
                          <li className="breadcrumb-item active" style={{ color: '#ddd' }}>Blog</li>
                      </ol>
                  </nav>
              </div>
          </div>
      </section>

      <section className="blog-list-page py-100 rel z-1">
          <div className="container">
              <div className="row justify-content-center">
                  <div className="col-lg-8">
                      {blogs.map(blog => (
                        <div key={blog.id} className="blog-item style-three" style={{ marginBottom: '40px', background: '#fff', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 5px 20px rgba(0,0,0,0.05)' }}>
                            <div className="image" style={{ height: '400px', backgroundColor: '#e9ecef', overflow: 'hidden' }}>
                                {/* Using placeholder if image missing */}
                                <img src={blog.img} alt="Blog List" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.src = "https://via.placeholder.com/800x400?text=Travel+Blog" }} />
                            </div>
                            <div className="content" style={{ padding: '30px' }}>
                                <a href="#" className="category" style={{ color: '#ffb300', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '12px' }}>Travel & Guide</a>
                                <h3 style={{ margin: '15px 0' }}><a href="#">{blog.title}</a></h3>
                                <ul className="blog-meta" style={{ display: 'flex', listStyle: 'none', padding: 0, gap: '20px', color: '#777', fontSize: '14px', marginBottom: '15px' }}>
                                    <li><i className="far fa-calendar-alt"></i> {blog.date}</li>
                                    <li><i className="far fa-comments"></i> Comments (0)</li>
                                </ul>
                                <p style={{ color: '#555', lineHeight: '1.8' }}>{blog.desc}</p>
                                <a href="#" className="theme-btn style-two style-three mt-3" style={{ padding: '10px 25px', borderRadius: '5px' }}>
                                    <span data-hover="Read More">Read More</span>
                                    <i className="fal fa-arrow-right"></i>
                                </a>
                            </div>
                        </div>
                      ))}
                  </div>
              </div>
          </div>
      </section>
    </>
  );
};

export default Blog;
