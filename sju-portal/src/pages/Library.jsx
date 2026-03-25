import React, { useState, useEffect } from 'react';
import './Library.css';

// Import Assets
import frArrupeImg from '../assets/library/fr_arrupe.png';
import sjuLogo from '../assets/St Joseph\'s University Emblem.png'; // Assuming this exists from Header.jsx
import sliderBg from '../assets/library/library_hero_update.jpg';
import glanceStatue from '../assets/library/glance_statue.png';
import glanceBuilding from '../assets/library/glance_building.png';
import glanceOverhead from '../assets/library/glance_overhead.png';
import glance2 from '../assets/library/glance_2.jpg';
import glance3 from '../assets/library/glance_3_final.png';

const Library = ({ onNavigate }) => {
    const [showTopBtn, setShowTopBtn] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        // Scroll to top on mount
        window.scrollTo(0, 0);

        const handleScroll = () => {
            if (window.scrollY > 0) {
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
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = (e) => {
        if (e && e.preventDefault) e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const circleRadius = 24;
    const circleCircumference = 2 * Math.PI * circleRadius;
    const strokeDashoffset = circleCircumference - (scrollProgress / 100) * circleCircumference;

    return (
        <div className="library-page">
            {/* Header */}
            <header className="library-header">
                <div className="header-left">
                    <img
                        src={frArrupeImg}
                        alt="Fr Arrupe Portrait"
                        className="fr-portrait"
                    />
                    <div className="header-title">
                        <h1>ARRUPE LIBRARY & INFORMATION CENTRE</h1>
                        <div className="breadcrumb">
                            <a onClick={() => onNavigate && onNavigate('home')}>HOME</a> <span>»</span> ARRUPE LIBRARY & INFORMATION CENTRE
                        </div>
                    </div>
                </div>
                <div className="header-right">
                    <img
                        src={sjuLogo}
                        alt="SJU Emblem"
                    />
                </div>
            </header>

            {/* Hero Section */}
            <section className="hero-section">
                {/* Best Practices Sidebar */}
                <div className="best-practices">
                    <div className="bp-title">BEST PRACTICES</div>
                    <ul className="bp-list">
                        <li>RFID SELF CIRCULATION KIOSK FACILITY</li>
                        <li>INFORMATION LITERACY PROGRAMME</li>
                        <li>FEDERATED SEARCH/UNIVERSAL SEARCH/SINGLE WINDOW SEARCH</li>
                        <li>SELF-STUDY KIOSK WITH WIFI LAPTOP STUDY FACILITY</li>
                        <li>BOOK SUGGESTION SYSTEM</li>
                        <li>BOOK BANK FACILITY</li>
                        <li>CURRENT AWARENESS SERVICE</li>
                        <li>USERS PERSONAL PAGE IN WEBOPAC</li>
                    </ul>
                </div>

                {/* Slider Image */}
                <div className="hero-slider">
                    <img
                        src={sliderBg}
                        alt="Library Interior"
                    />
                </div>
            </section>

            {/* Marquee Notice */}
            <div className="notice-marquee">
                <div className="notice-label">NOTICE</div>
                <div className="marquee-content">
                    <marquee>Trial access to Drillbit Plagiarism Detection Software is Available | Successfully organized a Book Exhibition at St. Joseph's University, Bengaluru.</marquee>
                </div>
            </div>

            {/* Library @ A Glance */}
            <section className="glance-section">
                <div className="section-title">
                    <h2>LIBRARY @ A GLANCE</h2>
                </div>

                <div className="glance-container">
                    <div className="glance-images">
                        <img src={glanceStatue} alt="SJU Statue" />
                        <img src={glanceBuilding} alt="SJU Building" />
                        <img src={glanceOverhead} alt="Library Overhead" />
                    </div>

                    <div className="glance-content">
                        <ul className="glance-list">
                            <li>The library professionals and other team members at SJU Library are well qualified and well trained, with rich experience to provide optimum services and facilities to the users at all times.</li>
                            <li>SJU Library is well equipped with modern infrastructure with 15 different sections.</li>
                            <li>The carpet area of the University Library is 21805.26 (in sq. ft.)</li>
                            <li>Adopted Open Access System.</li>
                            <li>Resources: Print, Electronic, Digital</li>
                            <li>Well-established e-learning resource centre with LAN-connected latest computers with the best internet bandwidth connectivity</li>
                            <li>Two android touchscreens have been installed at the digital library to provide library education to its users.</li>
                            <li>Library e-resources are remotely available 24/7 through Knimbus RAS software.</li>
                            <li>The library is fully automated, with the world's best Koha ILMS.</li>
                            <li>Using Dewey Decimal Classification (DDC) system for organising knowledge</li>
                            <li>Using MARC 21 format for bibliographic data capture</li>
                            <li>Using AACR-2 to catalogue the library documents</li>
                            <li>Auto-generated e-mail alert services for every library transaction</li>
                            <li>Installed DSpace for digital archive</li>
                            <li>Implemented RFID technology</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* News & Timings */}
            <section className="lower-section">
                {/* Latest News */}
                <div className="news-column">
                    <div className="section-title">
                        <h2>LATEST NEWS/EVENTS</h2>
                    </div>
                    <div className="news-grid">
                        <div className="news-card">
                            <img src={glance2} alt="Students" />
                            <div className="news-title">ALL UG AND PG STUDENTS' EMAIL IDS INTEGRATED WITH SJU E-LIBRARY ON KNIMBUS</div>
                        </div>
                        <div className="news-card">
                            <img src={glance3} alt="Digital Library" />
                            <div className="news-title">DSPACE DIGITAL LIBRARY AND INSTITUTIONAL REPOSITORY</div>
                        </div>
                    </div>
                </div>

                {/* Timings */}
                <div className="timings-column">
                    <div className="section-title">
                        <h2>LIBRARY TIMINGS</h2>
                    </div>
                    <table className="timings-table">
                        <tbody>
                            <tr>
                                <td>Monday to Saturday</td>
                                <td>06.30 AM TO 10.00 PM</td>
                            </tr>
                            <tr>
                                <td>During Summer Vacation</td>
                                <td>08.30 AM TO 04.30 PM</td>
                            </tr>
                            <tr>
                                <td>Sunday's</td>
                                <td className="closed">Holiday</td>
                            </tr>
                            <tr>
                                <td>During Govt. Holiday's</td>
                                <td className="closed">Holiday</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Back to top button */}
            <a
                href="#"
                className={`floating-top-btn btn-right-side ${showTopBtn ? 'visible' : ''}`}
                onClick={scrollToTop}
                style={{ color: '#d9a34a' }}
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

export default Library;
