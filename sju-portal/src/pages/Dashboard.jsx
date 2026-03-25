import React, { useState, useEffect, useRef } from 'react';
import './Dashboard.css';
import Calendar from '../components/Calendar';
import AttendanceReport from '../components/AttendanceReport';
import Result from '../components/Result';
import Fees from '../components/Fees';
import studentPhotoDefault from '../assets/student_profile.jpg';
import jonnyPhoto from '../assets/jonny_profile.jpg';
import sreelayaPhoto from '../assets/sreelaya.jpg';

const Dashboard = ({ type, studentId, onNavigate, onLogout, shouldCollapse }) => { // onNavigate to go back home
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const displayPhoto = studentId === '233bcac26' ? jonnyPhoto : (studentId === '233bcac30' ? sreelayaPhoto : studentPhotoDefault);
    const displayEmail = studentId === '233bcac26' ? 'jonny123@gmail.com' : (studentId === '233bcac30' ? 'sreelayatr@gmail.com' : 'princetinexavier@gmail.com');
    const normalizeType = (t) => (t === 'dashboard' || !t) ? 'home' : t;
    const [activePage, setActivePage] = useState(normalizeType(type)); // 'home', 'timetable', etc.
    const [activeTab, setActiveTab] = useState('courses'); // 'courses', 'dashboard'
    const [showDropdown, setShowDropdown] = useState(false);
    const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
    const [readNotificationCount, setReadNotificationCount] = useState(() => {
        const saved = localStorage.getItem(`readNotifications_${studentId}`);
        return saved ? parseInt(saved, 10) : 0;
    });
    const [expandedItems, setExpandedItems] = useState({ navResult: false });
    const [lastResultTab, setLastResultTab] = useState('exam');
    const [prefillLeaveData, setPrefillLeaveData] = useState(null);
    const [attendanceInitialSemester, setAttendanceInitialSemester] = useState('');
    const [currentAbsentNotifId, setCurrentAbsentNotifId] = useState(null);
    const [leaveDescription, setLeaveDescription] = useState('');
    const [appliedAbsentNotifs, setAppliedAbsentNotifs] = useState(() => {
        const saved = localStorage.getItem(`appliedAbsentNotifs_${studentId}`);
        return saved ? JSON.parse(saved) : [];
    });
    const notificationRef = useRef(null);
    const profileRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotificationDropdown(false);
            }
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        if (showNotificationDropdown || showDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showNotificationDropdown, showDropdown]);

    useEffect(() => {
        setActivePage(normalizeType(type));
        if (shouldCollapse) {
            setSidebarCollapsed(true);
        }
    }, [type, shouldCollapse]);

    // Mock student data if fetch fails or for immediate display
    const [studentData, setStudentData] = useState({
        name: "PRINCETINE XAVIER B",
        regNo: "233BCAC19",
        batch: "BCA-2023-C",
        semester: "S6",
        leaves: []
    });

    useEffect(() => {
        const fetchStudentData = () => {
            if (studentId) {
                fetch(`http://127.0.0.1:5001/api/student/${studentId}`)
                    .then(res => res.json())
                    .then(data => {
                        if (data && data.name) {
                            setStudentData(prev => ({
                                ...prev,
                                name: data.name,
                                regNo: data.id,
                                attendance: data.attendance || {},
                                result: data.result || {},
                                fees: data.fees || [],
                                leaves: data.leaves || [],
                                notifications: data.notifications || []
                            }));
                        }
                    })
                    .catch(err => console.error(err));
            }
        };

        // Initial fetch
        fetchStudentData();

        // Set up interval for "real-time" updates (every 5 seconds)
        const intervalId = setInterval(fetchStudentData, 5000);

        // Cleanup interval on unmount
        return () => clearInterval(intervalId);
    }, [studentId]);

    // Handle Search
    const handleSearch = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    // Calculate dynamic attendance overview
    const getAttendanceTotals = () => {
        const currentSem = studentData.attendance && studentData.attendance.sem6;
        if (!currentSem || !currentSem.rows) return { attended: 0, total: 0, percent: "0" };

        let attended = 0;
        let total = 0;
        currentSem.rows.forEach(row => {
            attended += row[1];
            total += row[2];
        });

        const percent = total > 0 ? ((attended / total) * 100).toFixed(0) : "0";
        return { attended, total, percent };
    };

    const attTotals = getAttendanceTotals();

    const navItems = [
        { id: 'navHome', icon: '🏠', label: 'Home', page: 'home', tab: 'courses' },
        { id: 'navProfile', icon: '👤', label: 'Profile', page: 'profile' },
        { id: 'navTimetable', icon: '📅', label: 'Timetables', page: 'timetable' },
        { id: 'navCalendar', icon: '🗓️', label: 'Academic Calendar', page: 'calendar' },
        { id: 'navAttendance', icon: '🧾', label: 'Attendance', page: 'attendance' },
        { id: 'navFees', icon: '💰', label: 'Fees', page: 'fees' },
        {
            id: 'navResult',
            icon: '📊',
            label: 'Result',
            page: 'result',
            subItems: [
                { id: 'subExamResult', label: 'Examination Result', page: 'result', tab: 'exam' },
                { id: 'subInternalMarks', label: 'Internal Marks', page: 'result', tab: 'internal' }
            ]
        },
        { id: 'navLeave', icon: '📝', label: 'Leave Management', page: 'leave' }
    ];

    const handleNavClick = (item) => {
        if (item.subItems) {
            setExpandedItems(prev => ({
                ...prev,
                [item.id]: !prev[item.id]
            }));
            if (item.page) {
                setActivePage(item.page);
                if (item.id === 'navResult') {
                    setActiveTab(lastResultTab);
                }
            }
            return;
        }

        if (item.page) {
            setActivePage(item.page);
            if (item.tab) {
                setActiveTab(item.tab);
                if (item.page === 'result') {
                    setLastResultTab(item.tab);
                }
            }
            if (item.page !== 'result') {
                setExpandedItems(prev => ({ ...prev, navResult: false }));
            }
        }
    };

    // Filter nav items
    const filteredNavItems = navItems.filter(item => item.label.toLowerCase().includes(searchTerm));

    // Standard Dashboard Layout
    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <aside 
                className={`dashboard-sidebar ${sidebarCollapsed && !isHovered ? 'collapsed' : ''}`}
                onMouseEnter={() => sidebarCollapsed && setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="sidebar-top">
                    <div className="back-btn" onClick={() => onNavigate && onNavigate('home')}>←</div>
                    <div className="hamburger" style={{ color: sidebarCollapsed ? '#fff' : '#fbbf24' }} onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>≡</div>
                </div>

                {/* SEARCH */}
                <div className="search-box">
                    <input type="text" placeholder="Search" value={searchTerm} onChange={handleSearch} />
                    <span>🔍</span>
                </div>

                <div className="nav">
                    {filteredNavItems.map((item) => (
                        <div key={item.id}>
                            <div
                                className={`nav-item ${(activePage === 'home' && item.page === 'home' && (!item.tab || item.tab === activeTab)) ||
                                    (activePage === item.page && item.page !== 'home')
                                    ? 'active' : ''
                                    }`}
                                onClick={() => handleNavClick(item)}
                            >
                                <div className="left">
                                    <div className="icon-box">{item.icon}</div>
                                    <span className="label">{item.label}</span>
                                </div>
                                {item.subItems && (!sidebarCollapsed || isHovered) && (
                                    <div className="dropdown-arrow">{expandedItems[item.id] ? '▼' : '▶'}</div>
                                )}
                            </div>

                            {item.subItems && expandedItems[item.id] && (!sidebarCollapsed || isHovered) && (
                                <div className="sub-nav">
                                    {item.subItems.map((sub) => (
                                        <div
                                            key={sub.id}
                                            className={`sub-nav-item ${activeTab === sub.tab ? 'active' : ''}`}
                                            onClick={() => handleNavClick(sub)}
                                        >
                                            {sub.label}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </aside>

            {/* Main */}
            <main className="dashboard-main">

                {/* Header */}
                <header className="dashboard-header">
                    <div className="header-title">St Joseph's University</div>

                    <div className="header-right">
                        <div className="pill">STUDENT</div>

                        <div className="icon-circle" ref={notificationRef} onClick={() => {
                            setShowNotificationDropdown(!showNotificationDropdown);
                            if (!showNotificationDropdown) {
                                const newCount = (studentData.notifications || []).length;
                                setReadNotificationCount(newCount);
                                localStorage.setItem(`readNotifications_${studentId}`, newCount.toString());
                            }
                        }}>
                            <span className="bell-icon-custom">🔔</span>
                            {(() => {
                                const notifs = studentData.notifications || [];
                                const newCount = Math.max(0, notifs.length - readNotificationCount);
                                const blueDotCount = notifs.filter(n => n.type === 'attendance' && !appliedAbsentNotifs.includes(n.id)).length;
                                if (newCount > 0 || blueDotCount > 0) {
                                    return (
                                        <span className="notification-badge-custom">
                                            {newCount > 0 ? newCount : blueDotCount}
                                        </span>
                                    );
                                }
                                return null;
                            })()}
                            {showNotificationDropdown && (
                                <div className="notification-dropdown" onClick={(e) => e.stopPropagation()}>
                                    <div className="notification-header">Notifications</div>
                                    <div className="notification-body">
                                        {(() => {
                                            const notifs = [...(studentData.notifications || [])].reverse();
                                            if (notifs.length > 0) {
                                                return notifs.map((notif, idx) => (
                                                    <div key={idx} className="notification-item" onClick={() => {
                                                        if (notif.type === 'leave') {
                                                            if (notif.message.toLowerCase().includes('attendance')) {
                                                                setAttendanceInitialSemester('sem6');
                                                                setActivePage('attendance');
                                                            } else {
                                                                setActivePage('leave');
                                                            }
                                                        } else if (notif.type === 'attendance') {
                                                            if (appliedAbsentNotifs.includes(notif.id)) {
                                                                // Already applied, do not navigate to leave application
                                                                return;
                                                            }
                                                            setCurrentAbsentNotifId(notif.id);
                                                            // Calculate pre-fill data based on notification message and timestamp
                                                            const subjectsList = [
                                                                "CA 6P2 - MAJOR PROJECT LAB",
                                                                "CA 6P1 - MOBILE APPLICATION DEVELOPMENT LAB",
                                                                "DAV 02 - POWER BI",
                                                                "CADE 6423 - MOBILE APPLICATION DEVELOPMENT",
                                                                "CA 6323 - INTERNET OF THINGS",
                                                                "CA 6223 - ARTIFICIAL INTELLIGENCE AND APPLICATIONS",
                                                                "CA 6123 - SOFTWARE ENGINEERING"
                                                            ];
                                                            
                                                            let matchedSubject = '';
                                                            const messageLower = notif.message.toLowerCase().replace(/\s+/g, '');
                                                            
                                                            subjectsList.forEach(s => {
                                                                const code = s.split(' - ')[0].replace(/\s+/g, '').toLowerCase();
                                                                if (messageLower.includes(code)) {
                                                                    matchedSubject = s;
                                                                }
                                                            });

                                                            let rawDate = notif.absenceDate || '';
                                                            let finalDate = '';

                                                            // 1. Try metadata first
                                                            if (rawDate) {
                                                                const parts = rawDate.includes('-') ? rawDate.split('-') : rawDate.split('/');
                                                                if (parts.length === 3) {
                                                                    // If YYYY is at start
                                                                    if (parts[0].length === 4) {
                                                                        finalDate = `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
                                                                    } else {
                                                                        // If DD/MM/YYYY
                                                                        finalDate = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
                                                                    }
                                                                }
                                                            }

                                                            // 2. Fallback to message text parsing (e.g., "on 12/03/2026")
                                                            if (!finalDate && notif.message) {
                                                                const dateMatch = notif.message.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
                                                                if (dateMatch) {
                                                                    finalDate = `${dateMatch[3]}-${dateMatch[2].padStart(2, '0')}-${dateMatch[1].padStart(2, '0')}`;
                                                                }
                                                            }
                                                            
                                                            setPrefillLeaveData({
                                                                subject: matchedSubject,
                                                                date: finalDate // This ensures the precise marked absent date is used
                                                            });
                                                            setLeaveDescription('');
                                                            setActivePage('apply-leave');
                                                        }
                                                        setShowNotificationDropdown(false);
                                                    }}>
                                                        <span className="notif-icon" style={{ position: 'relative' }}>
                                                            {notif.type === 'attendance' ? '🚫' : '📝'}
                                                            {notif.type === 'attendance' && !appliedAbsentNotifs.includes(notif.id) && (
                                                                <span style={{
                                                                    position: 'absolute',
                                                                    bottom: '-2px',
                                                                    right: '-2px',
                                                                    width: '8px',
                                                                    height: '8px',
                                                                    background: '#3b82f6',
                                                                    borderRadius: '50%',
                                                                    border: '1px solid white'
                                                                }}></span>
                                                            )}
                                                        </span>
                                                        <div className="notif-content">
                                                            <div className="notif-title">
                                                                {notif.type === 'attendance' ? (
                                                                    <strong>{notif.message}</strong>
                                                                ) : (
                                                                    <span>
                                                                        {(() => {
                                                                            if (notif.message.includes('attendance not marked -')) {
                                                                                const parts = notif.message.split('attendance not marked -');
                                                                                return (
                                                                                    <>
                                                                                        {parts[0]}
                                                                                        <span style={{ color: '#ef4444', fontWeight: 'bold' }}>
                                                                                            attendance not marked -
                                                                                            <br />
                                                                                            {parts[1]}
                                                                                        </span>
                                                                                    </>
                                                                                );
                                                                            } else if (notif.message.includes('attendance marked absent -')) {
                                                                                const parts = notif.message.split('attendance marked absent -');
                                                                                return (
                                                                                    <>
                                                                                        {parts[0]}
                                                                                        <span style={{ color: '#ef4444', fontWeight: 'bold' }}>
                                                                                            attendance marked absent -
                                                                                            <br />
                                                                                            {parts[1]}
                                                                                        </span>
                                                                                    </>
                                                                                );
                                                                            } else if (notif.message.includes('attendance marked -')) {
                                                                                const parts = notif.message.split('attendance marked -');
                                                                                return (
                                                                                    <>
                                                                                        {parts[0]}
                                                                                        <span style={{ color: '#16a34a', fontWeight: 'bold' }}>
                                                                                            attendance marked -
                                                                                            <br />
                                                                                            {parts[1]}
                                                                                        </span>
                                                                                    </>
                                                                                );
                                                                            }
                                                                            return notif.message;
                                                                        })()}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="notif-time">
                                                                {new Date(notif.timestamp).toLocaleString()}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ));
                                            } else {
                                                return <div className="notification-empty">No new notifications</div>;
                                            }
                                        })()}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="profile-container" ref={profileRef} style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setShowDropdown(!showDropdown)}>
                            <div className="profile">
                                <img src={displayPhoto} alt="profile" />
                                <div>
                                    <div className="name">{studentData.name}</div>
                                    <div className="adm">Adm No: {studentData.regNo}</div>
                                </div>
                            </div>

                            {showDropdown && (
                                <div className="profile-dropdown" onClick={(e) => e.stopPropagation()}>
                                    <div className="dropdown-header">
                                        Signed in as<br />
                                        <strong>{studentData.name}</strong><br />
                                        Adm No : <strong>{studentData.regNo}</strong>
                                    </div>
                                    <button className="logout-btn" onClick={(e) => {
                                        e.stopPropagation();
                                        onLogout && onLogout();
                                    }}>Logout</button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Content */}
                <section className="dashboard-content">
                    <div className="breadcrumb">
                        {activePage === 'home' ? 'HOME' : (
                            activePage === 'result' ? (
                                `RESULT / ${activeTab === 'exam' ? 'EXAMINATION RESULT' : 'INTERNAL MARKS'}`
                            ) : (
                                activePage === 'leave' ? 'LEAVE MANAGEMENT' :
                                    activePage === 'apply-leave' ? (
                                        <span
                                            onClick={() => setActivePage('leave')}
                                            style={{ cursor: 'pointer', color: '#7c3aed', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '5px' }}
                                        >
                                            ← BACK
                                        </span>
                                    ) : activePage.toUpperCase()
                            )
                        )}
                    </div>

                    {/* HOME PAGE */}
                    {activePage === 'home' && (
                        <div id="homePage">
                            {/* Tabs - Removed Dashboard/Overview tab as requested */}
                            <div className="tabs">
                                <div className="tab active">My Courses</div>
                            </div>

                            {/* COURSES */}
                            <div id="coursesSection">
                                <div className="program-line">
                                    Program: <b>BACHELOR OF COMPUTER APPLICATIONS</b>,
                                    Batch: <b>{studentData.batch}</b>, Current Semester: <b>{studentData.semester}</b>
                                </div>


                                <div className="grid">
                                    <div className="card">
                                        <div className="course-title">CA 6P2 - MAJOR PROJECT LAB BCA-202...</div>
                                        <div className="course-sub">CA 6P2 - MAJOR PROJECT LAB</div>
                                        <div className="teachers">
                                            <span className="tag">Melwyn Amrithraj</span>
                                            <span className="tag">Shalini S</span>
                                        </div>
                                    </div>

                                    <div className="card">
                                        <div className="course-title">CA 6P1 - MOBILE APPLICATION DEVEL...</div>
                                        <div className="course-sub">CA 6P1 - Mobile Application Development Lab</div>
                                        <div className="teachers">
                                            <span className="tag">SRUTHI SURENDRAN P</span>
                                            <span className="tag">Prakriti Thapa</span>
                                        </div>
                                    </div>

                                    <div className="card">
                                        <div className="course-title">DAV 02 - POWER BI BCA...</div>
                                        <div className="course-sub">DAV 02 - Power BI</div>
                                        <div className="teachers">
                                            <span className="tag">MANIVANNAN T</span>
                                        </div>
                                    </div>

                                    <div className="card">
                                        <div className="course-title">CADE 6423 - MOBILE APPLICATION DEV...</div>
                                        <div className="course-sub">CADE 6423 - Mobile Application Development</div>
                                        <div className="teachers">
                                            <span className="tag">SRUTHI SURENDRAN P</span>
                                        </div>
                                    </div>

                                    <div className="card">
                                        <div className="course-title">CA 6323 - INTERNET OF THINGS BCA-202...</div>
                                        <div className="course-sub">CA 6323 - Internet of things</div>
                                        <div className="teachers">
                                            <span className="tag">MANIVANNAN T</span>
                                        </div>
                                    </div>

                                    <div className="card">
                                        <div className="course-title">CA 6223 - ARTIFICIAL INTELLIGENCE AN...</div>
                                        <div className="course-sub">CA 6223 - Artificial Intelligence and Applications</div>
                                        <div className="teachers">
                                            <span className="tag">Melwyn Amrithraj</span>
                                        </div>
                                    </div>

                                    <div className="card">
                                        <div className="course-title">CA 6123 - SOFTWARE ENGINEERING...</div>
                                        <div className="course-sub">CA 6123 - Software Engineering</div>
                                        <div className="teachers">
                                            <span className="tag">Prakriti Thapa</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* PROFILE PAGE */}
                    {activePage === 'profile' && (
                        <div id="profilePage" style={{ padding: '0 10px' }}>
                            <div className="profile-layout">
                                {/* Left Side */}
                                <div className="profile-left">
                                    <div className="student-photo-box">
                                        <img src={displayPhoto} alt="Student Photo" />
                                    </div>
                                    <div className="profile-menu-header">Profile Settings</div>
                                    <div className="profile-menu-item">My profile</div>
                                </div>

                                {/* Right Side */}
                                <div className="profile-right">
                                    <div className="profile-header-text">MY PROFILE</div>
                                    <div className="required-note">Field(s) marked with <span>*</span> are required</div>

                                    {/* Account Details */}
                                    <div className="profile-section-header">Account Details</div>
                                    <table className="profile-table">
                                        <tbody>
                                            <tr>
                                                <td>RollNo:</td>
                                                <td className="profile-val">{studentData.regNo}</td>
                                            </tr>
                                            <tr>
                                                <td>University Reg.No:</td>
                                                <td className="profile-val">{studentData.regNo}</td>
                                            </tr>
                                            <tr>
                                                <td>Admission No:</td>
                                                <td className="profile-val">{studentData.regNo}</td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    {/* Profile Details */}
                                    <div className="profile-section-header">Profile Details</div>
                                    <table className="profile-table">
                                        <tbody>
                                            <tr>
                                                <td>Name:<span>*</span></td>
                                                <td className="profile-val">{studentData.name}</td>
                                            </tr>
                                            <tr>
                                                <td>Email:<span>*</span></td>
                                                <td className="profile-val">{displayEmail}</td>
                                            </tr>
                                            <tr>
                                                <td>Gender:<span>*</span></td>
                                                <td className="profile-val">{studentId === '233bcac30' ? 'female' : 'male'}</td>
                                            </tr>
                                            <tr>
                                                <td>Birth Day:<span>*</span></td>
                                                <td className="profile-val">{studentId === '233bcac30' ? '02-09-2005' : '01-11-2005'}</td>
                                            </tr>
                                            <tr>
                                                <td>Birth Place:<span>*</span></td>
                                                <td className="profile-val">{studentId === '233bcac30' ? 'Thrissur' : 'Mandya'}</td>
                                            </tr>
                                            <tr>
                                                <td>Birth State:<span>*</span></td>
                                                <td className="profile-val">{studentId === '233bcac30' ? 'Kerala' : 'Karnataka'}</td>
                                            </tr>
                                            <tr>
                                                <td>Birth Country:<span>*</span></td>
                                                <td className="profile-val">India</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TIMETABLE PAGE */}
                    {activePage === 'timetable' && (
                        <div id="timetablePage">
                            <div className="timetable-box">
                                <h2>📅 Weekly Timetable</h2>

                                <table>
                                    <thead>
                                        <tr>
                                            <th>Day</th>
                                            <th>4:00 - 4:45</th>
                                            <th>4:45 - 5:35</th>
                                            <th>5:40 - 6:30</th>
                                            <th>6:30 - 7:00</th>
                                            <th>7:00 - 7:50</th>
                                            <th>7:55 - 8:45</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Monday</td>
                                            <td></td>
                                            <td>ANDROID</td>
                                            <td>POWER BI</td>
                                            <td rowSpan="6"><b>BREAK</b></td>
                                            <td>SE</td>
                                            <td></td>
                                        </tr>

                                        <tr>
                                            <td>Tuesday</td>
                                            <td></td>
                                            <td>ANDROID</td>
                                            <td>SE</td>
                                            <td>AI</td>
                                            <td></td>
                                        </tr>

                                        <tr>
                                            <td>Wednesday</td>
                                            <td>POWER BI</td>
                                            <td>AI</td>
                                            <td>SE</td>
                                            <td>ANDROID</td>
                                            <td></td>
                                        </tr>

                                        <tr>
                                            <td>Thursday</td>
                                            <td></td>
                                            <td></td>
                                            <td>IOT</td>
                                            <td>POWER BI</td>
                                            <td></td>
                                        </tr>

                                        <tr>
                                            <td>Friday</td>
                                            <td></td>
                                            <td>AI</td>
                                            <td>IOT</td>
                                            <td colSpan="2">
                                                B1 – Major Project Lab<br />
                                                B2 – Mobile App Lab
                                            </td>
                                        </tr>

                                        <tr>
                                            <td>Saturday</td>
                                            <td></td>
                                            <td>IOT</td>
                                            <td>
                                                B1 – Mobile App Lab<br />
                                                B2 – Major Project Lab
                                            </td>
                                            <td colSpan="2">
                                                B1 – Mobile App Lab<br />
                                                B2 – Major Project Lab
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* ACADEMIC CALENDAR PAGE */}
                    {activePage === 'calendar' && (
                        <div id="calendarPage">
                            <Calendar />
                        </div>
                    )}

                    {/* ATTENDANCE PAGE */}
                    {activePage === 'attendance' && (
                        <div id="attendancePage">
                            <AttendanceReport onNavigate={setActivePage} data={studentData.attendance} initialSemester={attendanceInitialSemester} />
                        </div>
                    )}

                    {/* FEES PAGE */}
                    {activePage === 'fees' && (
                        <div id="feesPage">
                            <Fees data={studentData.fees} />
                        </div>
                    )}

                    {/* RESULT PAGE */}
                    {activePage === 'result' && (
                        <div id="resultPage" style={{ padding: '20px' }}>
                            <Result data={studentData.result} studentName={studentData.name} studentRegNo={studentData.regNo} activeTab={activeTab} />
                        </div>
                    )}

                    {/* LEAVE MANAGEMENT PAGE */}
                    {activePage === 'leave' && (
                        <div id="leavePage" style={{ padding: '20px' }}>
                            <div className="box">
                                <div className="box-title">LEAVE MANAGEMENT</div>
                                <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #eee' }}>
                                    <p style={{ color: '#666', marginBottom: '20px' }}>Apply for leave or view your leave status here.</p>
                                    <button className="filter-btn" onClick={() => { setPrefillLeaveData(null); setCurrentAbsentNotifId(null); setActivePage('apply-leave'); }} style={{ background: '#7c3aed', color: 'white', border: 'none' }}>+ Apply New Leave</button>

                                    <table style={{ width: '100%', marginTop: '30px', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
                                                <th style={{ padding: '10px' }}>Type</th>
                                                <th style={{ padding: '10px' }}>Date</th>
                                                <th style={{ padding: '10px' }}>Reason</th>
                                                <th style={{ padding: '10px' }}>Leave Status</th>
                                                <th style={{ padding: '10px' }}>Attendance Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {studentData.leaves && studentData.leaves.length > 0 ? (
                                                [...studentData.leaves].reverse().map((leave, index) => (
                                                    <tr key={leave.id || index} style={{ borderBottom: '1px solid #eee' }}>
                                                        <td style={{ padding: '10px' }}>{leave.type}</td>
                                                        <td style={{ padding: '10px' }}>
                                                            {(() => {
                                                                const rawDate = leave.on || leave.from;
                                                                if (!rawDate) return '';
                                                                const parts = rawDate.split('-');
                                                                if (parts.length === 3 && parts[0].length === 4) {
                                                                    return `${parts[2]}/${parts[1]}/${parts[0]}`;
                                                                }
                                                                return rawDate;
                                                            })()}
                                                        </td>
                                                        <td style={{ padding: '10px' }}>{leave.reason}</td>
                                                        <td style={{ padding: '10px' }}>
                                                            <span style={{
                                                                background: leave.status === 'Approved' ? '#d1fae5' : (leave.status === 'Rejected' ? '#fee2e2' : '#fef3c7'),
                                                                color: leave.status === 'Approved' ? '#065f46' : (leave.status === 'Rejected' ? '#991b1b' : '#92400e'),
                                                                padding: '6px 12px',
                                                                borderRadius: '4px',
                                                                fontSize: '11px',
                                                                fontWeight: '600'
                                                            }}>
                                                                {leave.status}
                                                            </span>
                                                        </td>
                                                        <td style={{ padding: '10px' }}>
                                                            {(() => {
                                                                if (leave.status !== 'Approved') return <span style={{ color: '#9ca3af', fontSize: '12px' }}>-</span>;

                                                                const allApplied = (leave.subjects || []);
                                                                return allApplied.map(subFull => {
                                                                    // Extract code (e.g., CA 6P1 -> CA6P1)
                                                                    const code = subFull.split(' - ')[0].replace(/\s+/g, '');
                                                                    const isApproved = (leave.approvedSubjects || []).includes(code);
                                                                    const isRejected = (leave.rejectedSubjects || []).includes(code);

                                                                    if (isApproved) return <div key={subFull} style={{ color: '#059669', fontSize: '12.5px', fontWeight: '700' }}>{code} - APPROVED</div>;
                                                                    if (isRejected) return <div key={subFull} style={{ color: '#ef4444', fontSize: '12.5px', fontWeight: '700' }}>{code} - REJECTED</div>;
                                                                    return <div key={subFull} style={{ color: '#9ca3af', fontSize: '12px' }}>{code} - Not Marked</div>;
                                                                });
                                                            })()}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="5" style={{ padding: '30px', textAlign: 'center', color: '#999' }}>No leave applications found.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* APPLY LEAVE PAGE */}
                    {activePage === 'apply-leave' && (
                        <div id="applyLeavePage" style={{ padding: '20px' }}>
                            <div className="box">
                                <div className="box-title">LEAVE APPLICATION</div>
                                <div style={{ background: '#fff', padding: '30px', borderRadius: '8px', border: '1px solid #eee' }}>
                                    <form className="leave-application-form"
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            const type = document.getElementById('leave-type').value;
                                            const selectedSubjects = Array.from(document.querySelectorAll('#subject-container input[type="checkbox"]:checked')).map(cb => cb.value);
                                            const date = document.getElementById('leave-on').value;
                                            const reason = document.getElementById('leave-reason').value;
                                            const desc = document.getElementById('leave-description').value;

                                            if (!type || !date || !reason || !desc || selectedSubjects.length === 0) {
                                                alert('Please fill all mandatory fields marked with *');
                                                return;
                                            }

                                            // Prepare leave data
                                            const leaveData = {
                                                type: type,
                                                subjects: selectedSubjects,
                                                on: date,
                                                reason: reason,
                                                description: desc
                                            };

                                            fetch(`http://127.0.0.1:5001/api/student/${studentId}/apply-leave`, {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify(leaveData)
                                            })
                                                .then(res => res.json())
                                                .then(data => {
                                                    if (data.success) {
                                                        alert('Leave application submitted successfully!');
                                                        setLeaveDescription('');
                                                        if (currentAbsentNotifId) {
                                                            const updated = [...appliedAbsentNotifs, currentAbsentNotifId];
                                                            setAppliedAbsentNotifs(updated);
                                                            localStorage.setItem(`appliedAbsentNotifs_${studentId}`, JSON.stringify(updated));
                                                            setCurrentAbsentNotifId(null);
                                                        }
                                                        // Refresh leaves
                                                        fetch(`http://127.0.0.1:5001/api/student/${studentId}/leaves`)
                                                            .then(res => res.json())
                                                            .then(leaves => {
                                                                setStudentData(prev => ({ ...prev, leaves }));
                                                                setActivePage('leave');
                                                            });
                                                    } else {
                                                        alert('Error submitting leave: ' + (data.message || 'Unknown error'));
                                                    }
                                                })
                                                .catch(err => {
                                                    console.error(err);
                                                    alert('Error connecting to server: ' + err.message);
                                                });
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                if (e.target.id === 'leave-type') {
                                                    e.preventDefault();
                                                    document.querySelector('#subject-container input')?.focus();
                                                } else if (e.target.id === 'leave-on') {
                                                    e.preventDefault();
                                                    document.getElementById('leave-reason')?.focus();
                                                } else if (e.target.id === 'leave-reason') {
                                                    e.preventDefault();
                                                    document.getElementById('leave-description')?.focus();
                                                } else if (e.target.tagName !== 'TEXTAREA') {
                                                    e.preventDefault();
                                                }
                                            }
                                        }}
                                    >
                                        <div className="form-group" style={{ marginBottom: '20px' }}>
                                            <label style={{ display: 'block', fontWeight: 'bold', fontSize: '12px', color: '#666', marginBottom: '8px' }}>LEAVE TYPE *</label>
                                            <select id="leave-type" key={currentAbsentNotifId || 'new'} className="input-field" style={{ width: '100%', padding: '10px', background: '#f9fafb' }} required>
                                                <option value="">Select</option>
                                                <option>choir</option>
                                                <option>cultural activities</option>
                                                <option>internship</option>
                                                <option>NCC</option>
                                                <option>NSS</option>
                                                <option>YRC</option>
                                                <option>Sports</option>
                                                <option>late comers</option>
                                                <option>placements</option>
                                                <option>professional course /CA/CMA</option>
                                                <option>seminar and workshops</option>
                                                <option>others</option>
                                            </select>
                                        </div>

                                        <div className="form-group" style={{ marginBottom: '20px' }}>
                                            <label style={{ display: 'block', fontWeight: 'bold', fontSize: '12px', color: '#666', marginBottom: '8px' }}>SUBJECT *</label>
                                            <div id="subject-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '10px', background: '#f9fafb', padding: '15px', borderRadius: '4px', border: '1px solid #ddd' }}>
                                                {[
                                                    "CA 6P2 - MAJOR PROJECT LAB",
                                                    "CA 6P1 - MOBILE APPLICATION DEVELOPMENT LAB",
                                                    "DAV 02 - POWER BI",
                                                    "CADE 6423 - MOBILE APPLICATION DEVELOPMENT",
                                                    "CA 6323 - INTERNET OF THINGS",
                                                    "CA 6223 - ARTIFICIAL INTELLIGENCE AND APPLICATIONS",
                                                    "CA 6123 - SOFTWARE ENGINEERING"
                                                ].map((subj, i) => (
                                                    <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', cursor: 'pointer' }}>
                                                        <input type="checkbox" key={`${subj}-${prefillLeaveData?.subject === subj}`} value={subj} defaultChecked={prefillLeaveData?.subject === subj} /> {subj}
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="form-group" style={{ marginBottom: '20px' }}>
                                            <label style={{ display: 'block', fontWeight: 'bold', fontSize: '12px', color: '#666', marginBottom: '8px' }}>LEAVE ON *</label>
                                            <input id="leave-on" type="date" key={prefillLeaveData?.date || 'default-date'} className="input-field" style={{ width: '100%', padding: '10px', background: '#f9fafb' }} required defaultValue={prefillLeaveData?.date || ''} />
                                        </div>

                                        <div className="form-group" style={{ marginBottom: '20px' }}>
                                            <label style={{ display: 'block', fontWeight: 'bold', fontSize: '12px', color: '#666', marginBottom: '8px' }}>LEAVE REASON *</label>
                                            <input id="leave-reason" key={currentAbsentNotifId || 'new'} type="text" className="input-field" style={{ width: '100%', padding: '10px', background: '#f9fafb' }} required />
                                        </div>

                                        <div className="form-group" style={{ marginBottom: '20px' }}>
                                            <label style={{ display: 'block', fontWeight: 'bold', fontSize: '12px', color: '#666', marginBottom: '8px' }}>LEAVE DESCRIPTION *</label>
                                            <textarea id="leave-description" key={currentAbsentNotifId || 'new'} value={leaveDescription} onChange={(e) => setLeaveDescription(e.target.value)} maxLength={500} className="input-field" style={{ width: '100%', height: '100px', padding: '10px', background: '#f9fafb' }} required></textarea>
                                            <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>You have {500 - leaveDescription.length} chars left</p>
                                        </div>

                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                            <button type="button" onClick={() => { setActivePage('leave'); setLeaveDescription(''); }} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}>Cancel</button>
                                            <button id="submit-leave-btn" type="submit" style={{ background: '#007bff', color: 'white', border: 'none', padding: '10px 30px', borderRadius: '4px', cursor: 'pointer' }}>Submit</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}
                </section>

                {/* Footer */}
                <footer className="dashboard-footer">
                    <div>Powered by Linways Technologies Pvt.Ltd.</div>
                    <div>Linways AMS AUTONOMOUS ULTIMATE_PLUS v4.4.1.1</div>
                </footer>

            </main>
        </div>
    );
};

export default Dashboard;
