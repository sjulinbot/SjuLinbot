import React, { useState } from 'react';
import './ApplicantDashboard.css';

const ApplicantDashboard = ({ onLogout, userName }) => {
    const [activeTab, setActiveTab] = useState('Apply Online');

    const sidebarItems = [
        { name: 'Apply Online', icon: '📝' },
        { name: 'My Applications', icon: '📄' },
        { name: 'Take Prints', icon: '🖨️' },
        { name: 'Notifications', icon: '🔔' }
    ];

    return (
        <div className="applicant-dashboard-container">
            <aside className="applicant-sidebar">
                <div className="sidebar-header">
                    <span className="hamburger-icon">☰</span>
                    <span>SJU Portal</span>
                </div>

                <div className="search-box">
                    <input type="text" placeholder="Search" />
                    <span className="search-icon">🔍</span>
                </div>

                <nav className="sidebar-nav">
                    {sidebarItems.map(item => (
                        <div
                            key={item.name}
                            className={`nav-item ${activeTab === item.name ? 'active' : ''}`}
                            onClick={() => setActiveTab(item.name)}
                        >
                            <div className="nav-content">
                                <div className="nav-icon-container">{item.icon}</div>
                                <span>{item.name}</span>
                            </div>
                            {activeTab === item.name && <div className="active-indicator-arrow"></div>}
                        </div>
                    ))}
                </nav>

                <div className="sidebar-footer" style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <button onClick={onLogout} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.3)', color: 'white', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', width: '100%' }}>Logout</button>
                </div>
            </aside>

            <main className="dashboard-main">
                <nav className="dashboard-top-nav">
                    <div className="university-breadcrumb">
                        St Joseph's University
                    </div>
                    <div className="user-profile-section">
                        <span className="user-name">Welcome, {userName || 'Applicant'}</span>
                        <div className="user-avatar">👤<div style={{ position: 'absolute', width: '10px', height: '10px', background: '#4cd137', borderRadius: '50%', right: '0', bottom: '0', border: '2px solid white' }}></div></div>
                    </div>
                </nav>

                <div className="dashboard-content">
                    <div className="active-tab-indicator">
                        {activeTab.toUpperCase()}
                    </div>

                    <div className="guidelines-card">
                        <h2>Welcome to SJU Admission Portal</h2>
                        <p>
                            WE STRONGLY RECOMMEND THAT YOU READ THE GUIDELINES GIVEN ON OUR <br />
                            ADMISSION PAGE (<a href="https://sju.edu.in/admissions">https://sju.edu.in/admissions</a>) BEFORE YOU START FILLING THE APPLICATION FORM.
                        </p>

                        <div style={{ fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '15px' }}>
                            A FEW POINTS THAT YOU NEED TO CONSIDER CAREFULLY:
                        </div>

                        <ul className="guidelines-list">
                            <li>HAVE YOU READ THE ELIGIBILITY CRITERIA AND CHECKED THE CLASS TIMINGS FOR THE PROGRAMME?</li>
                            <li>IF YOU ARE AN APPLICANT FOR A POSTGRADUATE PROGRAMME, HAVE YOU INDICATED THE COGNATE SUBJECT IN THE APPLICATION FORM? IT IS MANDATORY FOR ALL APPLICANTS OF POST-GRADUATE PROGRAMME TO INDICATE THE COGNATE SUBJECT IN THE APPLICATION FORM. (CHECK ELIGIBILITY CRITERIA TO KNOW YOUR COGNATE SUBJECT)</li>
                            <li>HAVE YOU CHECKED THE FEE STRUCTURE FOR THE PROGRAMME, INCLUDING ADDITIONAL FEES?</li>
                        </ul>

                        <div style={{ fontSize: '0.9rem', marginTop: '20px' }}>
                            ALL ADMISSION-RELATED INFORMATION IS AVAILABLE ON OUR ADMISSION PAGE <a href="https://sju.edu.in/admissions">https://sju.edu.in/admissions</a>
                        </div>

                        <div style={{ fontSize: '0.9rem', marginTop: '15px' }}>
                            WE STRONGLY RECOMMEND THAT YOU CHECK THE CLASS TIMINGS FOR THE PROGRAMME YOU ARE APPLYING AND READ THE GUIDELINES GIVEN ON OUR ADMISSION PAGE (<a href="https://sju.edu.in/admissions">https://sju.edu.in/admissions</a>) BEFORE YOU START FILLING THE APPLICATION FORM.
                        </div>

                        <div style={{ fontSize: '0.9rem', marginTop: '15px', fontWeight: 'bold' }}>
                            IF YOU MAKE A MISTAKE WHILE FILLING UP THE APPLICATION FORM, YOU MAY NOT BE SHORTLISTED FOR THE INTERVIEW.
                        </div>
                    </div>

                    <div className="open-forms-section">
                        <h3>Open Application Forms</h3>
                        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #eee', color: '#666', fontStyle: 'italic' }}>
                            No application forms are currently open. Please check back later or refer to the admission calendar.
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ApplicantDashboard;
