import React from 'react';
import heroBg from '../assets/new_hero_bg.jpg';

const Home = ({ onNavigate }) => {
    const [showTopBtn, setShowTopBtn] = React.useState(false);
    const [scrollProgress, setScrollProgress] = React.useState(0);

    React.useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 400) {
                setShowTopBtn(true);
            } else {
                setShowTopBtn(false);
            }

            const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
            setScrollProgress(scrolled);
        };

        window.addEventListener('scroll', handleScroll);
        // Initial calculation
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const circleRadius = 24;
    const circleCircumference = 2 * Math.PI * circleRadius;
    const strokeDashoffset = circleCircumference - (scrollProgress / 100) * circleCircumference;

    return (
        <div id="page-home-container">
            {/* Hero Section */}
            <section className="hero" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url(${heroBg})` }}>
                <div className="hero-badge">St Joseph's University - Bengaluru</div>
                <h1>Shape Your Future at<br /><span className="accent-text">ST JOSEPH'S UNIVERSITY</span></h1>
                <p>A premier campus offering undergraduate programmes in Commerce, Business, Computer Applications and Arts —
                    rooted in Jesuit values of excellence and service.</p>

                <div className="hero-btns">
                    <a href="#explore" className="btn-primary" onClick={(e) => { e.preventDefault(); if (onNavigate) onNavigate('programmes'); }}>Explore Programmes</a>
                    <a href="#contact" className="btn-secondary">Contact Us</a>
                </div>
            </section>

            {/* About Section */}
            <section className="about-section">
                <span className="section-label">About the Campus</span>
                <h2>A Legacy of Academic Excellence</h2>
                <p className="desc">
                    St Joseph's University, Bengaluru is a distinguished institution committed to holistic
                    education. Our campus provides a vibrant learning environment with modern infrastructure, experienced
                    faculty, and a culture that nurtures critical thinking, creativity, and social responsibility. With a
                    heritage rooted in Jesuit educational philosophy, we prepare students to lead with integrity in a rapidly
                    evolving world.
                </p>

                <div className="feature-grid">
                    <div className="feature-card">
                        <h3>Modern Infrastructure</h3>
                        <p>State-of-the-art classrooms, computer labs, library, and sports facilities on a green campus.</p>
                    </div>
                    <div className="feature-card">
                        <h3>Experienced Faculty</h3>
                        <p>Dedicated educators with industry and research expertise guiding students toward excellence.</p>
                    </div>
                    <div className="feature-card">
                        <h3>Holistic Development</h3>
                        <p>Clubs, cultural events, community outreach, and leadership programmes beyond academics.</p>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="contact-section">
                <span className="section-label">Get in Touch</span>
                <h2>Contact Us</h2>

                <div className="contact-grid">
                    <div className="contact-card">
                        <div className="contact-icon">
                            <i className="fas fa-phone"></i>
                        </div>
                        <h3>Phone</h3>
                        <p>9480811912</p>
                    </div>

                    <div className="contact-card">
                        <div className="contact-icon">
                            <i className="fas fa-envelope"></i>
                        </div>
                        <h3>Email</h3>
                        <p>desk@sju.edu.in</p>
                    </div>

                    <div className="contact-card">
                        <div className="contact-icon">
                            <i className="fas fa-map-marker-alt"></i>
                        </div>
                        <h3>Address</h3>
                        <p>St Joseph's University, 36, Lalbagh Road, Bengaluru-560027, Karnataka, India.</p>
                    </div>
                </div>
            </section>

            {/* Back to top button */}
            <a
                href="#"
                className={`floating-top-btn ${showTopBtn ? 'visible' : ''}`}
                onClick={scrollToTop}
            >
                <svg className="progress-ring" width="55" height="55">
                    <circle
                        className="progress-ring__circle"
                        stroke="#d9a34a"
                        strokeWidth="3"
                        fill="transparent"
                        r={circleRadius}
                        cx="27.5"
                        cy="27.5"
                        style={{
                            strokeDasharray: `${circleCircumference} ${circleCircumference}`,
                            strokeDashoffset: strokeDashoffset
                        }}
                    />
                </svg>
                <i className="fas fa-chevron-up top-btn-icon"></i>
            </a>
        </div>
    );
};

export default Home;
