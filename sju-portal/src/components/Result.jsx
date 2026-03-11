import React, { useState, useEffect } from 'react';
import './Result.css';

const Result = ({ data, studentName = "PRINCETINE XAVIER B", studentRegNo = "233BCAC19", activeTab = 'exam' }) => {
    const [currentExamType, setCurrentExamType] = useState('');
    const [selectedSems, setSelectedSems] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [openDropdown, setOpenDropdown] = useState('');
    const [internalMarks, setInternalMarks] = useState({});

    useEffect(() => {
        if (activeTab === 'internal' && studentRegNo) {
            fetch(`http://127.0.0.1:5001/api/student/${studentRegNo.toLowerCase()}/internal-marks`)
                .then(res => res.json())
                .then(data => {
                    if (data && data.sem6) {
                        setInternalMarks(data.sem6);
                    }
                })
                .catch(err => console.error('Error fetching internal marks:', err));
        }
    }, [activeTab, studentRegNo]);

    const toggleDropdown = (id, e) => {
        e.stopPropagation();
        setOpenDropdown(prev => prev === id ? '' : id);
    };

    const selectExamType = (type) => {
        setCurrentExamType(type);
        setOpenDropdown('');
    };

    const resetSingleExamType = (e) => {
        e.stopPropagation();
        setCurrentExamType('');
    };

    const addSemChip = (sem) => {
        if (!selectedSems.includes(sem)) {
            setSelectedSems([...selectedSems, sem]);
        }
        setOpenDropdown(''); // Optional: keep open if multi-select feeling is desired
    };

    const removeSemChip = (sem, e) => {
        e.stopPropagation();
        setSelectedSems(selectedSems.filter(s => s !== sem));
    };

    const resetAll = () => {
        setCurrentExamType('');
        setSelectedSems([]);
        setShowResults(false);
        setOpenDropdown('');
    };

    const executeSearch = () => {
        if (!currentExamType || selectedSems.length === 0) {
            alert("Please select both Exam Type and Semester(s).");
            return;
        }
        setShowResults(true);
    };

    // Mapping for internal subjects to match keys in database
    const subjects = [
        { sl: 1, code: 'CA 6P2', name: 'Major Project Lab', key: 'CA 6P2 - MAJOR PROJECT LAB', defaults: { cia1: 9, cia2: 9, midSem: 18, total: 36 } },
        { sl: 2, code: 'CA 6P1', name: 'Mobile Application Development Lab', key: 'CA 6P1 - Mobile Applications Development Lab' },
        { sl: 3, code: 'CA 6323', name: 'Internet of Things', key: 'CA 6323 - Internet of things', defaults: { cia1: 8, cia2: 7, midSem: 18, total: 33 } },
        { sl: 4, code: 'CA 6223', name: 'Artificial Intelligence', key: 'CA 6223 - Artificial Intelligence and Applications', defaults: { cia1: 9, cia2: 9, midSem: 19, total: 37 } },
        { sl: 5, code: 'CA 6123', name: 'Software Engineering', key: 'CA 6123 - Software Engineering', defaults: { cia1: 7, cia2: 8, midSem: 16, total: 31 } },
        { sl: 6, code: 'CADE 6423', name: 'Mobile Application Development', key: 'CADE 6423 - Mobile Application Development' },
        { sl: 7, code: 'DAV 02', name: 'Power BI', key: 'DAV 02 - POWER BI', defaults: { cia1: 8, cia2: 9, midSem: 19, total: 36 } }
    ];

    if (activeTab === 'internal') {
        return (
            <div className="result-container">
                <div className="box-title">📊 INTERNAL MARKS</div>
                <div className="card-container" style={{ marginTop: '20px' }}>
                    <div className="header">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                            <div>
                                <h2>INTERNAL ASSESSMENT MARKS</h2>
                                <p>Current Semester: S6</p>
                            </div>
                            <button
                                className="search-btn"
                                style={{ padding: '8px 16px', fontSize: '12px' }}
                                onClick={() => {
                                    if (studentRegNo) {
                                        fetch(`http://127.0.0.1:5001/api/student/${studentRegNo.toLowerCase()}/internal-marks`)
                                            .then(res => res.json())
                                            .then(data => {
                                                if (data && data.sem6) {
                                                    setInternalMarks(data.sem6);
                                                    alert('Marks refreshed!');
                                                }
                                            })
                                            .catch(err => console.error('Error fetching internal marks:', err));
                                    }
                                }}
                            >
                                🔄 Refresh
                            </button>
                        </div>
                    </div>
                    <table className="result-table">
                        <thead>
                            <tr style={{ background: '#f8f9fa' }}>
                                <th>Sl No.</th>
                                <th>Subject Code</th>
                                <th>Subject</th>
                                <th>CIA 1 (10)</th>
                                <th>CIA 2 (10)</th>
                                <th>MidSem (20)</th>
                                <th>Total (40)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subjects.map((sub, idx) => {
                                // Try to find marks by exact key or partial match
                                const savedMark = internalMarks[sub.key] ||
                                    Object.entries(internalMarks).find(([k]) => k.toLowerCase().includes(sub.name.toLowerCase()))?.[1];

                                const mark = savedMark || sub.defaults || {};

                                return (
                                    <tr key={idx}>
                                        <td>{sub.sl}</td>
                                        <td>{sub.code}</td>
                                        <td className="text-left">{sub.name}</td>
                                        <td>{mark.cia1 ?? '-'}</td>
                                        <td>{mark.cia2 ?? '-'}</td>
                                        <td>{mark.midSem ?? '-'}</td>
                                        <td>{mark.total ?? '-'}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    return (
        <div className="result-container" onClick={() => setOpenDropdown('')}>
            <div className="result-filters" onClick={e => e.stopPropagation()}>
                <div className="result-filter-group">
                    <label className="result-label">Exam Type *</label>
                    <div className="custom-select" onClick={(e) => toggleDropdown('examTypeMenu', e)}>
                        {currentExamType ? (
                            <div className="chip" onClick={resetSingleExamType}>
                                <span>× {currentExamType}</span>
                            </div>
                        ) : (
                            <span className="placeholder">Select Exam Type</span>
                        )}
                    </div>
                    {openDropdown === 'examTypeMenu' && (
                        <div className="dropdown" style={{ display: 'block' }}>
                            <div className="dropdown-item" onClick={() => selectExamType('End Sem Regular Exam')}>End Sem Regular Exam</div>
                            <div className="dropdown-item" onClick={() => selectExamType('Supplementary / Improvement Exam')}>Supplementary / Improvement Exam</div>
                        </div>
                    )}
                </div>

                <div className="result-filter-group">
                    <label className="result-label">Semester *</label>
                    <div className="custom-select" onClick={(e) => toggleDropdown('semMenu', e)}>
                        {selectedSems.length === 0 ? (
                            <span className="placeholder">Select Semester</span>
                        ) : (
                            selectedSems.map(sem => (
                                <div key={sem} className="chip" onClick={(e) => removeSemChip(sem, e)}>
                                    <span>× {sem}</span>
                                </div>
                            ))
                        )}
                    </div>
                    {openDropdown === 'semMenu' && (
                        <div className="dropdown" style={{ display: 'block' }}>
                            {['S1', 'S2', 'S3', 'S4', 'S5', 'S6'].map(sem => (
                                <div key={sem} className="dropdown-item" onClick={() => addSemChip(sem)}>{sem}</div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="button-container">
                    <button className="btn reset-btn" onClick={resetAll}>Reset</button>
                    <button className="btn search-btn" onClick={executeSearch}>Search</button>
                </div>
            </div>

            {showResults && (
                <>
                    <div className="print-wrapper">
                        <button className="print-btn" onClick={() => window.print()}>Print</button>
                    </div>

                    <div id="resultOutput">
                        {selectedSems.map(sem => {
                            if (sem === 'S6') {
                                return (
                                    <div key={sem} className="exam-status">
                                        <strong>Semester S6:</strong> Examination results not yet published. Scheduled for 2026.
                                    </div>
                                );
                            }
                            if (currentExamType === 'Supplementary / Improvement Exam') {
                                return (
                                    <div key={sem} className="exam-status no-supply">
                                        <strong>Semester {sem}:</strong> No Supplementary.
                                    </div>
                                );
                            }

                            const semesterData = data ? data[sem] : null; // Rename to avoid conflict with prop
                            if (!semesterData) return null;

                            return (
                                <div key={sem} className="card-container">
                                    <div className="header">
                                        <h2>ST JOSEPH'S UNIVERSITY</h2>
                                        <p>BENGALURU – 560 027</p>
                                        <h4>STATEMENT OF MARKS - {semesterData.name} SEMESTER</h4>
                                    </div>
                                    <table className="result-table">
                                        <tbody>
                                            <tr style={{ background: 'transparent', border: 'none' }}>
                                                <th style={{ border: 'none', textAlign: 'left' }}>CANDIDATE NAME</th>
                                                <td style={{ border: 'none', textAlign: 'left' }}>{studentName}</td>
                                                <th style={{ border: 'none', textAlign: 'left' }}>REGISTER NO</th>
                                                <td style={{ border: 'none', textAlign: 'left' }}>{studentRegNo}</td>
                                            </tr>
                                            <tr style={{ background: 'transparent', border: 'none' }}>
                                                <th style={{ border: 'none', textAlign: 'left' }}>EXAM TYPE</th>
                                                <td style={{ border: 'none', textAlign: 'left' }}>{currentExamType}</td>
                                                <th style={{ border: 'none', textAlign: 'left' }}>MONTH/YEAR</th>
                                                <td style={{ border: 'none', textAlign: 'left' }}>{semesterData.date}</td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    {/* Using a separate table for marks to match styles or keep custom borders */}
                                    <table className="result-table">
                                        <thead>
                                            <tr style={{ background: '#f8f9fa' }}>
                                                <th>Code</th><th>Course Name</th><th>Cr</th><th>Max</th><th>Obt</th><th>Grade</th><th>GP</th><th>Result</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {semesterData.courses.map((c, idx) => (
                                                <tr key={idx}>
                                                    <td>{c[0]}</td>
                                                    <td className="text-left">{c[1]}</td>
                                                    <td>{c[2]}</td>
                                                    <td>{c[3]}</td>
                                                    <td>{c[4]}</td>
                                                    <td>{c[5]}</td>
                                                    <td>{c[6]}</td>
                                                    <td>PASS</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <div className="footer-stats">
                                        <span>RESULT: {semesterData.summary.result}</span>
                                        <span>PERCENTAGE: {semesterData.summary.perc}%</span>
                                        <span>OVERALL GRADE: {semesterData.summary.grade}</span>
                                        <span>SGPA: {semesterData.summary.sgpa}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
};

export default Result;
