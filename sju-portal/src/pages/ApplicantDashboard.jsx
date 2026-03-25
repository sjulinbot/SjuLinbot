import React, { useState, useEffect, useRef } from 'react';
import './ApplicantDashboard.css';

const ApplicantDashboard = ({ onLogout, userName, onNavigate }) => {
    const [activeTab, setActiveTab] = useState(localStorage.getItem('applicant_dashboard_active_tab') || 'Apply Online');
    const [showDropdown, setShowDropdown] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const profileRef = useRef(null);

    useEffect(() => {
        // Clear the temporary transition preference after it's been used
        localStorage.removeItem('applicant_dashboard_active_tab');
        
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        if (showDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showDropdown]);


    const sidebarItems = [
        { name: 'Apply Online', icon: 'fas fa-desktop' },
        { name: 'My Applications', icon: 'fas fa-copy' }
    ];

    const applicationForms = [
        {
            id: 1,
            title: 'UG APPLICATION FORM SJU (LALBAGH ROAD) 2026',
            subtitle: '[APPLICATION FOR ADMISSION TO UNDERGRADUATE PROGRAMMES 2026]',
            link: '#'
        }
    ];

    const [appliedForms, setAppliedForms] = useState([]);

    useEffect(() => {
        if (activeTab === 'My Applications') {
            const allApps = JSON.parse(localStorage.getItem('applications') || '[]');
            // Filter by current logged in user name
            const userApps = allApps.filter(app => 
                app.fullName && userName && app.fullName.toLowerCase() === userName.toLowerCase()
            );
            
            setAppliedForms(userApps.map((app, idx) => ({
                id: idx,
                programme: app.programme,
                name: app.fullName,
                email: app.email,
                phone: app.phone,
                date: app.time ? app.time.split(',')[0] : 'Today',
                applicationNo: `SJU2026${app.programme.substring(0, 3).toUpperCase()}${101 + idx}`,
                status: 'Submitted'
            })));
        }
    }, [activeTab, userName]);

    return (
        <div className="applicant-dashboard-container">
            <aside 
                className={`applicant-sidebar ${sidebarCollapsed && !isHovered ? 'collapsed' : ''}`}
                onMouseEnter={() => sidebarCollapsed && setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="sidebar-header">
                    <div className="back-btn-circle" onClick={() => onNavigate && onNavigate('home')}>←</div>
                    {(!sidebarCollapsed || isHovered) && (
                        <span 
                            className="hamburger-icon" 
                            style={{ color: !sidebarCollapsed ? '#fbbf24' : '#fff' }}
                            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        >
                            ☰
                        </span>
                    )}
                    <span className="sidebar-logo">SJU Portal</span>
                </div>

                <nav className="sidebar-nav">
                    {sidebarItems.map(item => (
                        <div
                            key={item.name}
                            className={`nav-item ${activeTab === item.name ? 'active' : ''}`}
                            onClick={() => setActiveTab(item.name)}
                        >
                            <span className="nav-text">{item.name}</span>
                            <div className="nav-icon-box">
                                <i className={item.icon}></i>
                            </div>
                        </div>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <button onClick={onLogout} className="logout-btn">Logout</button>
                </div>
            </aside>

            <main className="dashboard-main">
                <header className="dashboard-top-nav">
                    <div className="university-breadcrumb">
                        St Joseph's University
                    </div>
                    <div className="user-profile-section" ref={profileRef} onClick={() => setShowDropdown(!showDropdown)}>
                        <span className="user-name">{userName || 'User'}</span>
                        <div className="user-avatar">
                            👤
                            <div className="status-indicator"></div>
                        </div>

                        {showDropdown && (
                            <div className="profile-dropdown" onClick={(e) => e.stopPropagation()}>
                                <div className="dropdown-header">
                                    Signed in as<br />
                                    <strong>{userName || 'User'}</strong>
                                </div>
                                <button className="dropdown-item logout-link" onClick={() => onLogout()}>
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </header>

                <div className="dashboard-content">
                    <div className="section-label">
                        {activeTab.toUpperCase()}
                    </div>

                    {activeTab === 'Apply Online' ? (
                        <>
                            <div className="guidelines-card">
                                <h2 className="welcome-title">WELCOME {userName ? userName.toUpperCase() : 'TO SJU ADMISSION PORTAL'}</h2>
                                
                                <div className="warning-text">
                                    WE STRONGLY RECOMMEND THAT YOU READ THE GUIDELINES GIVEN ON OUR <br />
                                    ADMISSION PAGE (<a href="https://sju.edu.in/admissions">https://sju.edu.in/admissions</a>) BEFORE YOU START FILLING THE APPLICATION FORM.
                                </div>

                                <div className="points-title">
                                    A FEW POINTS THAT YOU NEED TO CONSIDER CAREFULLY:
                                </div>

                                <ul className="guidelines-list">
                                    <li>HAVE YOU READ THE ELIGIBILITY CRITERIA AND CHECKED THE CLASS TIMINGS FOR THE PROGRAMME?</li>
                                    <li>IF YOU ARE AN APPLICANT FOR A POSTGRADUATE PROGRAMME, HAVE YOU INDICATED THE COGNATE SUBJECT IN THE APPLICATION FORM? IT IS MANDATORY FOR ALL APPLICANTS OF POST-GRADUATE PROGRAMME TO INDICATE THE COGNATE SUBJECT IN THE APPLICATION FORM. (CHECK ELIGIBILITY CRITERIA TO KNOW YOUR COGNATE SUBJECT)</li>
                                    <li>HAVE YOU CHECKED THE FEE STRUCTURE FOR THE PROGRAMME, INCLUDING ADDITIONAL FEES?</li>
                                </ul>

                                <div className="info-link">
                                    ALL ADMISSION RELATED INFORMATION IS AVAILABLE ON OUR ADMISSION PAGE <a href="https://sju.edu.in/admissions">https://sju.edu.in/admissions</a>
                                </div>

                                <div className="final-recommendation">
                                    WE STRONGLY RECOMMEND THAT YOU CHECK THE CLASS TIMINGS FOR THE PROGRAMME YOU ARE APPLYING AND READ THE GUIDELINES GIVEN ON OUR ADMISSION PAGE (<a href="https://sju.edu.in/admissions">https://sju.edu.in/admissions</a>) BEFORE YOU START FILLING THE APPLICATION FORM.
                                </div>

                                <div className="mistake-warning">
                                    IF YOU MAKE A MISTAKE WHILE FILLING UP THE APPLICATION FORM, YOU MAY NOT BE SHORTLISTED FOR THE INTERVIEW.
                                </div>
                            </div>

                            <div className="open-forms-section">
                                <h3 className="section-title">OPEN APPLICATION FORMS</h3>
                                <div className="forms-grid">
                                    {applicationForms.map(form => (
                                        <div key={form.id} className="form-card">
                                            <h4 className="form-title">{form.title}</h4>
                                            {form.subtitle && <p className="form-subtitle text-muted">{form.subtitle}</p>}
                                            <div className="form-action">
                                                <span 
                                                    className="apply-link" 
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        onNavigate('admissions');
                                                    }}
                                                >
                                                    Click to apply
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="applied-forms-section">
                            {appliedForms.length > 0 ? (
                                <div className="applied-forms-list">
                                    {appliedForms.map(form => (
                                        <div key={form.id} className="applied-form-card">
                                            <div className="applied-form-header">
                                                <h4 className="applied-form-title">{form.programme}</h4>
                                                <span className="status-badge success">Submitted Successfully</span>
                                            </div>
                                            <div className="applied-form-details">
                                                <p><strong>Application No:</strong> {form.applicationNo}</p>
                                                <p><strong>Applied Date:</strong> {form.date}</p>
                                                <p><strong>Name:</strong> {form.name}</p>
                                                <p><strong>Email:</strong> {form.email}</p>
                                            </div>
                                            <div className="applied-form-footer">
                                                <button 
                                                    className="download-btn-full"
                                                    onClick={() => {
                                                        const content = `
ST JOSEPH'S UNIVERSITY - APPLICATION SUMMARY
------------------------------------------
Programme: ${form.programme}
Application No: ${form.applicationNo}
Applied Date: ${form.date}
Name: ${form.name}
Email: ${form.email}
Status: Submitted Successfully
                                                        `;
                                                        const blob = new Blob([content], { type: 'text/plain' });
                                                        const url = URL.createObjectURL(blob);
                                                        const a = document.createElement('a');
                                                        a.href = url;
                                                        a.download = `Application_${form.applicationNo}.txt`;
                                                        document.body.appendChild(a);
                                                        a.click();
                                                        document.body.removeChild(a);
                                                        URL.revokeObjectURL(url);
                                                    }}
                                                >
                                                    <i className="fas fa-download" style={{ marginRight: '8px' }}></i>
                                                    Download Application Record
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="no-applications-banner">
                                    No Applied Forms.
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <footer className="dashboard-footer">
                    <div className="footer-left">
                        © 2014-2022 All Rights Reserved Linways Technologies Pvt. Ltd.
                    </div>
                    <div className="footer-right">
                        Linways AMS v4.0
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default ApplicantDashboard;

