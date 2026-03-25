import React, { useState, useEffect, useRef } from 'react';
import './StaffDashboard.css';

const StaffDashboard = ({ onLogout, onNavigate }) => {
    const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'communities', 'courseCommunities'
    const [attendanceSubTab, setAttendanceSubTab] = useState(null); // 'selectCourse', 'withoutTimetable'
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectedDate, setSelectedDate] = useState(() => {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    });
    const [markedLogs, setMarkedLogs] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isHovered, setIsHovered] = useState(false);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);

    const [students, setStudents] = useState([
        { id: "233bcac19", name: "PRINCETINE XAVIER B", status: "unmarked" },
        { id: "233bcac30", name: "Sreelaya T R", status: "unmarked" },
        { id: "233bcac26", name: "Johnson Akash A", status: "unmarked" }
    ]);
    const [markEntryData, setMarkEntryData] = useState([
        { id: "233bcac19", name: "PRINCETINE XAVIER B", cia1: 0, cia2: 0, midSem: 0, total: 0 },
        { id: "233bcac30", name: "Sreelaya T R", cia1: 0, cia2: 0, midSem: 0, total: 0 },
        { id: "233bcac26", name: "Johnson Akash A", cia1: 0, cia2: 0, midSem: 0, total: 0 }
    ]);
    const [selectedMarkCommunity, setSelectedMarkCommunity] = useState("");
    const [selectedMarkClass, setSelectedMarkClass] = useState("");
    const [showMarkTable, setShowMarkTable] = useState(false);
    const [isEditingMarks, setIsEditingMarks] = useState(false);
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [leaveSubjectStates, setLeaveSubjectStates] = useState({}); // { leaveId: { subCode: 'approved' | 'rejected' } }
    const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
    const notificationRef = useRef(null);
    const profileRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotificationDropdown(false);
            }
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setShowProfileDropdown(false);
            }
        };

        if (showNotificationDropdown || showProfileDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showNotificationDropdown, showProfileDropdown]);

    const getRelevantSubjects = (subjects) => {
        if (!Array.isArray(subjects)) return [];
        const staffSubjectsMap = {
            'CA 6P1 - MOBILE APPLICATION DEVELOPMENT LAB': 'CA6P1',
            'CADE 6423 - MOBILE APPLICATION DEVELOPMENT': 'CADE6423'
        };
        return subjects
            .filter(sub => staffSubjectsMap[sub.toUpperCase()])
            .map(sub => staffSubjectsMap[sub.toUpperCase()]);
    };

    const fetchLeaveRequests = () => {
        fetch('http://127.0.0.1:5001/api/staff/student-leaves')
            .then(res => res.json())
            .then(data => setLeaveRequests(data))
            .catch(err => console.error('Error fetching leaves:', err));
    };

    const fetchAttendanceLogs = () => {
        fetch('http://127.0.0.1:5001/api/staff/attendance-logs')
            .then(res => res.json())
            .then(data => setMarkedLogs(data))
            .catch(err => console.error('Error fetching logs:', err));
    };

    useEffect(() => {
        fetchLeaveRequests();
        fetchAttendanceLogs();
        const interval = setInterval(() => {
            fetchLeaveRequests();
            fetchAttendanceLogs();
        }, 10000); // poll every 10s for new notifications
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (showMarkTable && selectedMarkCommunity) {
            fetch(`http://127.0.0.1:5001/api/staff/marks/${encodeURIComponent(selectedMarkCommunity)}`)
                .then(res => res.json())
                .then(savedMarks => {
                    setMarkEntryData(prev => prev.map(s => {
                        const saved = savedMarks[s.id];
                        if (saved) {
                            return { ...s, ...saved };
                        }
                        return s;
                    }));
                })
                .catch(err => console.error('Error fetching marks:', err));
        }
    }, [showMarkTable, selectedMarkCommunity]);

    const handleUpdateLeaveStatus = async (studentId, leaveId, status) => {
        try {
            const response = await fetch('http://127.0.0.1:5001/api/staff/update-leave-status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    studentId,
                    leaveId,
                    status,
                    verifiedBy: "Sruthi Surendran" // Hardcoded for this demo
                })
            });

            if (response.ok) {
                fetchLeaveRequests(); // Refresh data
            } else {
                alert('Failed to update leave status');
            }
        } catch (error) {
            console.error('Error updating leave:', error);
        }
    };

    const handleUpdateAttendanceStatus = async (studentId, leaveId, status) => {
        // Collect subject statuses for this leaveId
        const subjects = leaveSubjectStates[leaveId] || {};
        const approvedSubjects = Object.keys(subjects).filter(s => subjects[s] === 'approved');
        const rejectedSubjects = Object.keys(subjects).filter(s => subjects[s] === 'rejected');

        try {
            const response = await fetch('http://127.0.0.1:5001/api/staff/update-attendance-status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    studentId,
                    leaveId,
                    status,
                    approvedSubjects,
                    rejectedSubjects,
                    verifiedBy: "Sruthi Surendran" // Hardcoded for this demo
                })
            });

            if (response.ok) {
                fetchLeaveRequests(); // Refresh data
            } else {
                alert('Failed to update attendance status');
            }
        } catch (error) {
            console.error('Error updating attendance:', error);
        }
    };

    const setSubjectState = (leaveId, subCode, state) => {
        setLeaveSubjectStates(prev => {
            const currentLeave = prev[leaveId] || {};
            if (currentLeave[subCode] === state) {
                // Toggle off
                const nextLeave = { ...currentLeave };
                delete nextLeave[subCode];
                return { ...prev, [leaveId]: nextLeave };
            } else {
                return {
                    ...prev,
                    [leaveId]: { ...currentLeave, [subCode]: state }
                };
            }
        });
    };

    const isDateMarked = (dateStr) => {
        if (!dateStr) return false;
        
        // Return true (marked/disabled) if no course is selected
        if (!selectedCourse) return true;

        // Check for Sunday
        const date = new Date(dateStr.replace(/-/g, '/'));
        if (date.getDay() === 0) return true;

        const cutoff = new Date('2026-03-23');
        // If date is before or on 23rd, it's always marked (historical)
        if (date <= cutoff) return true;
        
        // OR if it's explicitly logged
        return markedLogs.some(log => 
            log.date === dateStr && 
            log.courseTitle === (selectedCourse?.title || "")
        );
    };

    const isLeaveApprovedForStudent = (studentId, dateStr, courseTitle) => {
        if (!leaveRequests || !courseTitle) return false;
        
        // Find if this student has an approved leave for this date
        const leave = leaveRequests.find(l => 
            l.studentId.toLowerCase() === studentId.toLowerCase() && 
            (l.on === dateStr || l.from === dateStr) && // Match single date or from date
            l.attendanceStatus === 'Approved'
        );
        
        if (!leave) return false;

        // Check if the current course is in any of the approved subjects
        const targetTitleNormalized = courseTitle.toUpperCase().replace(/\s+/g, '');
        return (leave.approvedSubjects || []).some(code => 
            targetTitleNormalized.includes(code.toUpperCase()) || 
            code.toUpperCase().includes(targetTitleNormalized)
        );
    };

    const toggleAttendance = (id) => {
        if (isDateMarked(selectedDate)) return;
        
        setStudents(prev => prev.map(s => {
            if (s.id === id) {
                const nextStatus = s.status === 'unmarked' ? 'present' : (s.status === 'present' ? 'absent' : 'unmarked');
                return { ...s, status: nextStatus };
            }
            return s;
        }));
    };

    const handleMarkChange = (id, field, value) => {
        setMarkEntryData(prev => prev.map(s => {
            if (s.id === id) {
                const val = Math.min(Number(value), field === 'midSem' ? 20 : 10);
                const updated = { ...s, [field]: val };
                updated.total = (updated.cia1 || 0) + (updated.cia2 || 0) + (updated.midSem || 0);
                return updated;
            }
            return s;
        }));
    };

    const handleDownloadAttendance = () => {
        if (!selectedCourse) {
            alert("Please select a course to download attendance.");
            return;
        }

        const csvContent = [
            ["Registration Number", "Student Name", "Status"],
            ...students.map(s => [s.id.toUpperCase(), s.name, s.status.toUpperCase()])
        ].map(e => e.join(",")).join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `${selectedCourse.sub}_Attendance.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleEditAttendance = () => {
        if (!selectedCourse) {
            alert("Please select a course first.");
            return;
        }
        alert("Edit mode enabled. You can now click on students to modify their attendance.");
    };

    const handleResetFilters = () => {
        setSelectedCourse(null);
        setStudents(prev => prev.map(s => ({ ...s, status: 'unmarked' })));
        
        const d = new Date();
        const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        setSelectedDate(today);
    };

    const handleSubmitAttendance = async () => {
        if (!selectedCourse) {
            alert("Please select a course first.");
            return;
        }

        const unmarkedStudents = students.filter(s => s.status === 'unmarked');
        if (unmarkedStudents.length > 0) {
            alert("Please mark attendance for all students before submitting.");
            return;
        }

        const attendanceDate = selectedDate;
        console.log('Submitting attendance for date:', attendanceDate);

        try {
            let successes = 0;
            for (const student of students) {
                const response = await fetch('http://127.0.0.1:5001/api/student/mark-attendance', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        studentId: student.id,
                        courseTitle: selectedCourse.title,
                        status: student.status,
                        semester: 'sem6',
                        date: attendanceDate
                    })
                });

                const resData = await response.json();
                if (response.ok && resData.success) {
                    successes++;
                } else {
                    console.error(`Failed to mark student ${student.id}:`, resData.message);
                }
            }

            if (successes === students.length) {
                // Record completion log
                await fetch('http://127.0.0.1:5001/api/staff/attendance-logs', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        date: attendanceDate,
                        courseTitle: selectedCourse.title,
                        studentsStatus: students.map(s => ({ id: s.id, status: s.status }))
                    })
                });

                alert(`Successfully marked attendance for all students!`);
                fetchAttendanceLogs(); // Refresh logs
                // Reset statuses
                setStudents(prev => prev.map(s => ({ ...s, status: 'unmarked' })));
            } else {
                alert(`Warning: Only marked ${successes} of ${markedStudents.length} students. Check console for details.`);
            }
        } catch (error) {
            console.error("Error submitting attendance:", error);
            alert("Failed to connect to the server. Please ensure the backend is running.");
        }
    };

    const sruthiCourses = [
        {
            title: "CADE 6423 - Mobile Application Development",
            sub: "Cade 6423 - Mobile Application Development",
            teachers: ["SRUTHI SURENDRAN P"]
        },
        {
            title: "CA 6P1 - Mobile Applications Development Lab",
            sub: "CA 6P1 - Mobile Applications Development Lab",
            teachers: ["SRUTHI SURENDRAN P", "Prakriti Thapa"]
        }
    ];

    const renderContent = () => {
        if (activeTab === 'courseCommunities') {
            return (
                <div className="course-communities-view">
                    <div className="program-line" style={{ marginBottom: '20px', fontSize: '14px', color: '#666' }}>
                        Tutor: <b>SRUTHI SURENDRAN P</b>
                    </div>
                    <div className="grid">
                        {sruthiCourses.map((course, index) => (
                            <div className="card" key={index}>
                                <div className="course-title">{course.title}</div>
                                <div className="course-sub">{course.sub}</div>
                                <div className="teachers">
                                    {course.teachers.map((t, i) => (
                                        <span className="tag" key={i}>{t}</span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        if (activeTab === 'exam') {
            return (
                <div className="exam-view">
                    <div className="exam-main-header">EXAM</div>

                    <div className="exam-section">
                        <div className="exam-section-title">ACTIONS & APPROVAL</div>
                        <div className="exam-grid">
                            <div className="exam-item" onClick={() => setActiveTab('internalMarkEntry')}>
                                <div className="exam-label">
                                    <div style={{ fontSize: '24px', marginBottom: '8px', textAlign: 'center' }}>✏️</div>
                                    Internal / CIA Mark Entry
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="quick-access-pill" onClick={() => setActiveTab('dashboard')}>
                        Quick Access
                    </div>
                </div>
            );
        }

        if (activeTab === 'attendance') {
            if (attendanceSubTab === 'selectCourse') {
                return (
                    <div className="course-communities-view">
                        <div className="program-line" style={{ marginBottom: '20px', fontSize: '14px', color: '#666' }}>
                            Select Course to Mark Attendance:
                        </div>
                        <div className="grid">
                            {sruthiCourses.map((course, index) => (
                                <div className="card" key={index} onClick={() => { setSelectedCourse(course); setAttendanceSubTab('withoutTimetable'); }} style={{ cursor: 'pointer' }}>
                                    <div className="course-title">{course.title}</div>
                                    <div className="course-sub">{course.sub}</div>
                                    <div className="teachers">
                                        {course.teachers.map((t, i) => (
                                            <span className="tag" key={i}>{t}</span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="quick-access-pill" onClick={() => { setActiveTab('dashboard'); setAttendanceSubTab(null); }}>
                            Quick Access
                        </div>
                    </div>
                );
            }

            if (attendanceSubTab === 'withoutTimetable') {
                return (
                    <div className="attendance-without-timetable">
                        <div className="filters-box">
                            <div className="filter-grid-row">
                                <div className="filter-field">
                                    <label>SELECT COMMUNITY <span className="req-star">*</span></label>
                                    <select
                                        value={selectedCourse ? sruthiCourses.findIndex(c => c.title === selectedCourse.title) : ""}
                                        onChange={(e) => setSelectedCourse(sruthiCourses[e.target.value])}
                                    >
                                        <option value="" disabled>Select a community</option>
                                        {sruthiCourses.map((course, idx) => (
                                            <option key={idx} value={idx}>
                                                {course.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="filter-field">
                                    <label>SELECT DATE <span className="req-star">*</span></label>
                                    <input 
                                        id="attendance-date" 
                                        type="date" 
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="filter-btns-row">
                                <button className="btn-reset-att" onClick={handleResetFilters}>RESET</button>
                                <button 
                                    className="btn-search-att" 
                                    onClick={handleSubmitAttendance}
                                    disabled={isDateMarked(selectedDate)}
                                    style={isDateMarked(selectedDate) ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                                >
                                    SUBMIT ATTENDANCE
                                </button>
                            </div>
                        </div>

                        <div className="att-actions-strip">
                            <div className="left-actions">
                                <div className="att-legend-row">
                                    <div className="legend-item-box"><div className="legend-sq sq-present"></div> Present</div>
                                    <div className="legend-item-box"><div className="legend-sq sq-absent"></div> Absent</div>
                                    <div className="legend-item-box"><div className="legend-sq sq-unmarked"></div> Unmarked</div>
                                    <div className="legend-item-box"><div className="legend-sq sq-marked"></div> Already Marked</div>
                                </div>
                            </div>
                        </div>


                        <div className="batch-title-header">
                            {selectedCourse ? selectedCourse.sub : "6th Semester BCA [A] - 2024"}
                        </div>

                        <div className="students-grid-container">
                            {students.map((student) => {
                                const isMarked = isDateMarked(selectedDate);
                                const statusClass = isMarked ? 'marked' : student.status;
                                
                                return (
                                    <div
                                        className={`stu-att-card ${statusClass}`}
                                        key={student.id}
                                        onClick={() => toggleAttendance(student.id)}
                                    >
                                        <div className="st-name">{student.name}</div>
                                        <div className="st-info">{student.id}</div>
                                        <div className="st-info">Sem: 06</div>
                                        {(() => {
                                            const icon = isMarked ? (
                                                (!selectedCourse || new Date(selectedDate.replace(/-/g, '/')).getDay() === 0) ? '⊘' : 
                                                (isLeaveApprovedForStudent(student.id, selectedDate, selectedCourse?.title) ? '' : 
                                                 (markedLogs.find(l => l.date === selectedDate && l.courseTitle === selectedCourse?.title)?.studentsStatus?.find(s => s.id === student.id)?.status === 'absent' ? '✕' : ''))
                                            ) : (student.status === 'present' ? '✓' : (student.status === 'absent' ? '✕' : ''));
                                            
                                            return icon ? <div className="st-status-circle">{icon}</div> : null;
                                        })()}
                                    </div>
                                );
                            })}
                        </div>

                    </div>
                );
            }

            return (
                <div className="exam-view">
                    <div className="exam-main-header">ATTENDANCE</div>

                    <div className="exam-section">
                        <div className="exam-section-title">REPORTS</div>
                        <div className="exam-grid">
                            <div className="exam-item">
                                <div className="exam-label">Day wise Student Attendance Report</div>
                            </div>
                            <div className="exam-item">
                                <div className="exam-label">Student wise Attendance Report</div>
                            </div>
                        </div>
                    </div>

                    <div className="exam-section">
                        <div className="exam-section-title">ACTIONS & APPROVAL</div>
                        <div className="exam-grid">
                            <div className="exam-item" onClick={() => {
                                if (!selectedCourse) setSelectedCourse(sruthiCourses[0]);
                                setAttendanceSubTab('withoutTimetable');
                            }}>
                                <div className="exam-label">Mark Attendance</div>
                            </div>
                        </div>
                    </div>

                    <div className="quick-access-pill" onClick={() => setActiveTab('dashboard')}>
                        Quick Access
                    </div>
                </div>
            );
        }

        if (activeTab === 'internalMarkEntry') {
            return (
                <div className="mark-entry-view">
                    <div className="mark-entry-header">
                        <h2>Student Marks Entry</h2>
                        <div className="mark-entry-actions">
                            <select className="mark-select" value={selectedMarkCommunity} onChange={(e) => { setSelectedMarkCommunity(e.target.value); setShowMarkTable(false); }}>
                                <option value="">Select Communities</option>
                                {sruthiCourses.map((c, i) => (
                                    <option key={i} value={c.title}>{c.title}</option>
                                ))}
                            </select>
                            <select className="mark-select" value={selectedMarkClass} onChange={(e) => { setSelectedMarkClass(e.target.value); setShowMarkTable(false); }}>
                                <option value="">Class</option>
                                <option value="6BCA-C">6th Sem BCA [C]</option>
                            </select>

                            {!showMarkTable && selectedMarkCommunity && selectedMarkClass && (
                                <button className="mark-btn save" onClick={() => setShowMarkTable(true)}>View Table</button>
                            )}

                            {showMarkTable && (
                                <>
                                    <button className={`mark-btn edit ${isEditingMarks ? 'active' : ''}`} onClick={() => setIsEditingMarks(!isEditingMarks)}>
                                        {isEditingMarks ? 'Cancel' : 'Edit'}
                                    </button>
                                    <button className="mark-btn save" onClick={async () => {
                                        try {
                                            const response = await fetch('http://127.0.0.1:5001/api/student/save-internal-marks', {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({
                                                    marks: markEntryData,
                                                    courseTitle: selectedMarkCommunity
                                                })
                                            });

                                            if (response.ok) {
                                                alert('Marks saved successfully!');
                                                setIsEditingMarks(false);
                                            } else {
                                                alert('Failed to save marks.');
                                            }
                                        } catch (error) {
                                            console.error('Error saving marks:', error);
                                            alert('Error connecting to server.');
                                        }
                                    }}>Save</button>
                                </>
                            )}
                        </div>
                    </div>

                    {showMarkTable ? (
                        <div className="mark-entry-card">
                            <div className="sem-tab">Sem 6</div>
                            <table className="mark-table">
                                <thead>
                                    <tr>
                                        <th>Regno</th>
                                        <th>Name</th>
                                        <th>CIA 1 (10) ▼</th>
                                        <th>CIA 2 (10) ▼</th>
                                        <th>MidSem (20) ▼</th>
                                        <th>Total (40) ▼</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {markEntryData.map((student) => (
                                        <tr key={student.id}>
                                            <td>{student.id}</td>
                                            <td>{student.name}</td>
                                            <td>
                                                <div className="mark-input-group">
                                                    <input
                                                        type="number"
                                                        value={student.cia1}
                                                        disabled={!isEditingMarks}
                                                        onChange={(e) => handleMarkChange(student.id, 'cia1', e.target.value)}
                                                    />
                                                    <span className="max-hint">00</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="mark-input-group">
                                                    <input
                                                        type="number"
                                                        value={student.cia2}
                                                        disabled={!isEditingMarks}
                                                        onChange={(e) => handleMarkChange(student.id, 'cia2', e.target.value)}
                                                    />
                                                    <span className="max-hint">00</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="mark-input-group">
                                                    <input
                                                        type="number"
                                                        value={student.midSem}
                                                        disabled={!isEditingMarks}
                                                        onChange={(e) => handleMarkChange(student.id, 'midSem', e.target.value)}
                                                    />
                                                    <span className="max-hint">00</span>
                                                </div>
                                            </td>
                                            <td className="total-cell">{student.total}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="mark-entry-placeholder" style={{ textAlign: 'center', padding: '100px', color: '#888', background: 'white', borderRadius: '8px', border: '1px dashed #ccc' }}>
                            <p>Please select a Community and Class to view the Student Marks Entry table.</p>
                        </div>
                    )}

                    <div className="quick-access-pill" onClick={() => { setActiveTab('dashboard'); setShowMarkTable(false); }}>
                        Quick Access
                    </div>
                </div>
            );
        }

        if (activeTab === 'studentLeave') {
            const getRelevantSubjects = (subjects) => {
                if (!Array.isArray(subjects)) return [];
                const staffSubjectsMap = {
                    'CA 6P1 - MOBILE APPLICATION DEVELOPMENT LAB': 'CA6P1',
                    'CADE 6423 - MOBILE APPLICATION DEVELOPMENT': 'CADE6423'
                };
                return subjects
                    .filter(sub => staffSubjectsMap[sub.toUpperCase()])
                    .map(sub => staffSubjectsMap[sub.toUpperCase()]);
            };

            const filteredLeaveRequests = leaveRequests.filter(leave => {
                return getRelevantSubjects(leave.subjects || []).length > 0;
            }).sort((a, b) => {
                // Pending first
                if (a.status === 'Pending' && b.status !== 'Pending') return -1;
                if (a.status !== 'Pending' && b.status === 'Pending') return 1;
                // Then sort by submission date descending (newest first)
                return new Date(b.submittedAt) - new Date(a.submittedAt);
            });

            return (
                <div className="student-leave-management-view">
                    <div className="leave-header-section">
                        <div className="leave-title">
                            Student Leave Management
                        </div>
                        <div className="divider"></div>
                        <p className="leave-desc">Review and manage leave applications from students in your tutor groups.</p>
                    </div>

                    <div className="leave-table-container-custom">
                        <table className="leave-table-custom">
                            <thead>
                                <tr>
                                    <th>STUDENT NAME</th>
                                    <th>REG. NUMBER</th>
                                    <th>LEAVE TYPE</th>
                                    <th>DATE</th>
                                    <th>REASON</th>
                                    <th>STATUS</th>
                                    <th>ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredLeaveRequests.length > 0 ? (
                                    filteredLeaveRequests.map((leave, idx) => (
                                        <tr key={idx}>
                                            <td className="student-name-cell">{leave.studentName}</td>
                                            <td>{leave.studentId.toUpperCase()}</td>
                                            <td>{leave.type.toUpperCase()}</td>
                                            <td>
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
                                            <td>
                                                <div className="reason-cell">
                                                    {leave.reason}
                                                    {leave.description && (
                                                        <div className="description-tooltip">
                                                            <span className="tooltip-header">Student's Description</span>
                                                            {leave.description}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`status-pill ${leave.status.toLowerCase()}`}>
                                                    {leave.status}
                                                </span>
                                            </td>
                                            <td>
                                                {leave.status === 'Pending' ? (
                                                    <div className="action-btns">
                                                        <button className="btn-approve-custom" onClick={() => handleUpdateLeaveStatus(leave.studentId, leave.id, 'Approved')}>Approve</button>
                                                        <button className="btn-reject-custom" onClick={() => handleUpdateLeaveStatus(leave.studentId, leave.id, 'Rejected')}>Reject</button>
                                                    </div>
                                                ) : (
                                                    <div className="verified-status-container">
                                                        <div className="verified-status">
                                                            Verified by: {leave.verifiedBy}<br />
                                                            {leave.verifiedAt}
                                                        </div>
                                                        {leave.status === 'Approved' && (
                                                            <div className="attendance-action-section">
                                                                {!leave.attendanceStatus ? (
                                                                    <>
                                                                        <span className="attendance-label">Attendance:</span>
                                                                        <div className="attendance-btns-container">
                                                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                                                {getRelevantSubjects(leave.subjects || []).map(sub => (
                                                                                    <button
                                                                                        key={sub}
                                                                                        className={`btn-subject ${leaveSubjectStates[leave.id]?.[sub] || ''}`}
                                                                                    >
                                                                                        <span className="subject-text">{sub}</span>
                                                                                        <div className="hover-zone hover-left" onClick={() => setSubjectState(leave.id, sub, 'approved')}>
                                                                                            <i className="fas fa-check"></i>
                                                                                        </div>
                                                                                        <div className="hover-zone hover-right" onClick={() => setSubjectState(leave.id, sub, 'rejected')}>
                                                                                            <i className="fas fa-times"></i>
                                                                                        </div>
                                                                                    </button>
                                                                                ))}
                                                                            </div>
                                                                            <button className="btn-attendance-submit" onClick={() => handleUpdateAttendanceStatus(leave.studentId, leave.id, 'Approved')}>Approve</button>
                                                                        </div>
                                                                    </>
                                                                ) : (
                                                                    <div className="attendance-verified-status">
                                                                        <em>
                                                                            {getRelevantSubjects(leave.subjects || []).map(code => {
                                                                                const isApproved = (leave.approvedSubjects || []).includes(code);
                                                                                const isRejected = (leave.rejectedSubjects || []).includes(code);

                                                                                if (isApproved) return <div key={code} style={{ color: '#059669' }}>{code} - Attendance Approved</div>;
                                                                                if (isRejected) return <div key={code} style={{ color: '#ef4444' }}>{code} - Attendance Rejected</div>;
                                                                                return <div key={code} style={{ color: '#9ca3af' }}>{code} - Attendance Not Marked</div>;
                                                                            })}
                                                                        </em>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                                            No leave requests found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            );
        }

        return (
            <div className="quick-access-section">
                <div className="grid-container">
                    <div className="grid-item" onClick={() => { setActiveTab('attendance'); setAttendanceSubTab('withoutTimetable'); }}><span className="icon">✏︎</span> Attendance</div>
                    <div className="grid-item" onClick={() => setActiveTab('studentLeave')}><span className="icon">👤</span> Student Leave Management</div>
                    <div className="grid-item" onClick={() => setActiveTab('exam')}><span className="icon">📄</span> Exam</div>
                </div>
            </div>
        );
    };
    return (
        <div className={`staff-dashboard ${!isSidebarOpen ? 'sidebar-closed' : ''}`}>
            <div className={`staff-sidebar ${!isSidebarOpen ? 'collapsed' : ''}`}>
                    <div className="staff-logo">
                        <div className="back-arrow" onClick={() => onNavigate('home')}>←</div>
                    </div>

                    <div className="staff-nav-menu">
                        <div className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => { setActiveTab('dashboard'); setAttendanceSubTab(null); }}>
                            <span>Home</span>
                        </div>
                        <div className={`nav-item has-submenu ${activeTab === 'courseCommunities' ? 'active' : ''}`} onClick={() => setActiveTab('courseCommunities')}>
                            <span>Course Community</span>
                        </div>
                        <div className={`nav-item ${activeTab === 'attendance' ? 'active' : ''}`} onClick={() => { setActiveTab('attendance'); setAttendanceSubTab('withoutTimetable'); }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span>Attendance</span>
                            </div>
                        </div>

                        <div className={`nav-item has-submenu ${activeTab === 'studentLeave' ? 'active' : ''}`} onClick={() => setActiveTab('studentLeave')}>
                            <span>Student Leave Management</span>
                        </div>

                        <div className={`nav-item has-submenu ${activeTab === 'exam' || activeTab === 'internalMarkEntry' ? 'active' : ''}`} onClick={() => setActiveTab('exam')}>
                            <span>Exam Mark Entry</span>
                        </div>
                    </div>
                </div>

            <div className="staff-main-content">
                <div className="staff-header-top">
                    <h2>St Joseph's University</h2>
                    <div className="staff-header-right">
                        <div className="faculty-pill">FACULTY</div>
                        <div className="icon-circle" ref={notificationRef} onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}>
                            <span className="bell-icon-custom">🔔</span>
                            {leaveRequests.filter(leave => getRelevantSubjects(leave.subjects || []).length > 0 && leave.status === 'Pending').length > 0 && (
                                <span className="notification-badge-custom">
                                    {leaveRequests.filter(l => getRelevantSubjects(l.subjects || []).length > 0 && l.status === 'Pending').length}
                                </span>
                            )}
                            {showNotificationDropdown && (
                                <div className="notification-dropdown" onClick={(e) => e.stopPropagation()}>
                                    <div className="notification-header">Notifications</div>
                                    <div className="notification-body">
                                        {(() => {
                                            const pending = leaveRequests.filter(leave => getRelevantSubjects(leave.subjects || []).length > 0 && leave.status === 'Pending');
                                            if (pending.length > 0) {
                                                return pending.map((leave, idx) => (
                                                    <div key={idx} className="notification-item" onClick={() => { setActiveTab('studentLeave'); setShowNotificationDropdown(false); }}>
                                                        <span className="notif-icon">📝</span>
                                                        <div className="notif-content">
                                                            <div className="notif-title">
                                                                <strong>{leave.studentName}</strong> has applied for a <strong>{leave.type}</strong> leave.
                                                            </div>
                                                            <div className="notif-time">
                                                                {new Date(leave.submittedAt).toLocaleString()}
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
                        <div className="staff-profile-container" ref={profileRef}>
                            <div className="staff-profile-bubble" onClick={() => setShowProfileDropdown(!showProfileDropdown)}>
                                <div className="avatar">👤</div>
                                <div className="profile-info">
                                    <span className="profile-name">SRUTHI SURENDR..</span>
                                    <span className="profile-code">Code: 20240701998</span>
                                </div>
                            </div>

                            {showProfileDropdown && (
                                <div className="staff-profile-dropdown-custom">
                                    <div className="dropdown-header-section">
                                        <div className="signed-in-label">Signed in as</div>
                                        <div className="user-name">SRUTHI SURENDRAN P</div>
                                        <div className="user-code">Code : 20240701998</div>
                                    </div>
                                    <div className="dropdown-options">
                                        <div className="dropdown-item-link logout" onClick={onLogout}>
                                            Logout
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="staff-header">
                    <div className="breadcrumbs">
                        <span className="breadcrumb-link" onClick={() => { setActiveTab('dashboard'); setAttendanceSubTab(null); }}>HOME</span>
                        {activeTab === 'dashboard' ? (
                            <> &gt; QUICK ACCESS</>
                        ) : activeTab === 'courseCommunities' ? (
                            <> &gt; COURSE COMMUNITIES</>
                        ) : activeTab === 'exam' ? (
                            <> &gt; EXAM</>
                        ) : activeTab === 'attendance' ? (
                            <>
                                &nbsp;&gt; <span className="breadcrumb-link" onClick={() => { setActiveTab('attendance'); setAttendanceSubTab(null); }}>ATTENDANCE</span>
                                {attendanceSubTab === 'selectCourse' && (
                                    <> &gt; <span className="breadcrumb-current">COURSE COMMUNITIES</span></>
                                )}
                                {attendanceSubTab === 'withoutTimetable' && (
                                    <> &gt; <span className="breadcrumb-current">MARK ATTENDANCE</span></>
                                )}
                            </>
                        ) : (
                            <> &gt; QUICK ACCESS</>
                        )}
                    </div>
                </div>

                <div className="top-dashboard-links">
                    <div className={`top-link ${activeTab === 'courseCommunities' ? 'active' : ''}`} onClick={() => setActiveTab('courseCommunities')}>
                        Course Communities
                    </div>
                </div>

                {renderContent()}
            </div>
        </div>
    );
};

export default StaffDashboard;
