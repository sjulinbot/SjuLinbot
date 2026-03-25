import React, { useState, useEffect } from 'react';
import './Admissions.css';

const Admissions = ({ onNavigate, initialView = 'instructions', applicantName }) => {
    const [view, setView] = useState(initialView);
    const [activeTab, setActiveTab] = useState('ug');
    const [applyModalOpen, setApplyModalOpen] = useState(false);
    const [feeModalOpen, setFeeModalOpen] = useState(false);
    const [selectedProgramme, setSelectedProgramme] = useState('');
    const [feeProgramme, setFeeProgramme] = useState('');

    // Form states
    const [formData, setFormData] = useState({ fullName: '', email: '', phone: '' });
    const [submitted, setSubmitted] = useState(false);

    const data = {
        ug: [
            { school: "School of Business", name: "Bachelor of Commerce (B.Com.)", timing: "Batch I: 7:00 AM to 12:00 PM<br>Batch II: 12:00 PM to 04:00 PM<br>Batch III: 4:45 PM to 8:45 PM", sjuet: "No" },
            { school: "School of Business", name: "Bachelor of Commerce (B.Com.) Industry Integrated", timing: "7:00 AM to 12:00 PM", sjuet: "No" },
            { school: "School of Business", name: "Bachelor of Business Administration (BBA)", timing: "Batch I: 7:00 AM to 12:00 PM<br>Batch II: 4:45 PM to 8:45 PM", sjuet: "No" },
            { school: "School of Business", name: "Bachelor of Business Administration (BBA) in Strategic Finance", timing: "Batch I: 7:00 AM to 12:00 PM<br>Batch II: 4:00 PM to 8:45 PM", sjuet: "Yes" }
        ],
        pg: [
            { school: "School of Business", name: "Master of Commerce (M.Com.)", timing: "Batch I: 7:00 AM to 11:00 AM<br>Batch II: 4:45 PM to 8:45 PM", sjuet: "No" },
            { school: "School of Chemical Sciences", name: "M.Sc. in Analytical Chemistry", timing: "9:00 AM to 4:00 PM", sjuet: "No" },
            { school: "School of Chemical Sciences", name: "M.Sc. in Organic Chemistry", timing: "7:00 AM to 1:00 PM", sjuet: "No" }
        ],
        diploma: [
            { school: "School of Business", name: "PG Diploma in Financial Management", timing: "Saturday: Offline class 1:00 PM to 5:00 PM<br>Sunday: Online class 8:00 AM to 4:00 PM", sjuet: "No" },
            { school: "School of Business", name: "PG Diploma in Human Resource Management", timing: "Saturday: Offline class 1:00 PM to 5:00 PM<br>Sunday: Online class 8:00 AM to 4:00 PM", sjuet: "No" },
            { school: "School of Communication & Media Studies", name: "Executive Diploma Digital Media Communications", timing: "Tuesday & Thursday: 7:30 PM to 8:30 PM (Online)<br>Saturday: 11:30 AM to 1:00 PM (Offline)", sjuet: "No" }
        ]
    };

    const handleApply = (programmeName) => {
        if (!applicantName) {
            localStorage.setItem('authRedirect', 'programmes');
            localStorage.setItem('pendingProgramme', programmeName);
            onNavigate('applicantAuth');
            window.scrollTo(0, 0);
            return;
        }

        // Check if already applied
        const apps = JSON.parse(localStorage.getItem("applications") || "[]");
        const alreadyApplied = apps.some(app => app.programme === programmeName && app.fullName === applicantName);
        
        if (alreadyApplied) {
            alert(`You have already applied for ${programmeName}. Redirecting to your applications.`);
            localStorage.setItem('applicant_dashboard_active_tab', 'My Applications');
            onNavigate('applicantDashboard');
            return;
        }

        setSelectedProgramme(programmeName);
        setApplyModalOpen(true);
        setSubmitted(false);
        setFormData({ fullName: applicantName || '', email: '', phone: '' });
    };

    const handleSubmit = () => {
        if (!formData.fullName || !formData.email || !formData.phone) {
            alert("⚠ Please fill all fields before submitting.");
            return;
        }
        setSubmitted(true);
        
        const application = {
            ...formData,
            programme: selectedProgramme,
            time: new Date().toLocaleString()
        };
        let apps = JSON.parse(localStorage.getItem("applications") || "[]");
        apps.push(application);
        localStorage.setItem("applications", JSON.stringify(apps));

        // Automatically navigate back to dashboard after a delay
        setTimeout(() => {
            localStorage.setItem('applicant_dashboard_active_tab', 'My Applications');
            onNavigate('applicantDashboard');
            // Reset modal state for next time
            setApplyModalOpen(false);
            setSubmitted(false);
        }, 1500);
    };

    const handleShowFees = (programmeName) => {
        setFeeProgramme(programmeName);
        setFeeModalOpen(true);
    };

    useEffect(() => {
        const pending = localStorage.getItem('pendingProgramme');
        if (pending && applicantName) {
            // Check if already applied before auto-opening
            const apps = JSON.parse(localStorage.getItem("applications") || "[]");
            const alreadyApplied = apps.some(app => app.programme === pending && app.fullName === applicantName);
            
            if (alreadyApplied) {
                alert(`You have already applied for ${pending}. Redirecting to your applications.`);
                localStorage.removeItem('pendingProgramme');
                localStorage.setItem('applicant_dashboard_active_tab', 'My Applications');
                onNavigate('applicantDashboard');
            } else {
                setSelectedProgramme(pending);
                setApplyModalOpen(true);
                setSubmitted(false);
                setFormData(prev => ({ ...prev, fullName: applicantName }));
                localStorage.removeItem('pendingProgramme');
            }
        }
    }, [applicantName, onNavigate]);

    const currentProgrammes = data[activeTab] || [];

    // Helper to render table rows
    const renderProgrammeRows = () => {
        let rows = [];
        let currentSchool = "";
        let count = 1;

        const apps = JSON.parse(localStorage.getItem("applications") || "[]");

        currentProgrammes.forEach((item, index) => {
            if (item.school !== currentSchool) {
                currentSchool = item.school;
                rows.push(<tr key={`school-${index}`} className="school-row"><td colSpan="5">{currentSchool}</td></tr>);
            }

            const alreadyApplied = applicantName && apps.some(app => app.programme === item.name && app.fullName === applicantName);

            rows.push(
                <tr key={index}>
                    <td>{count++}</td>
                    <td>{item.name}</td>
                    <td dangerouslySetInnerHTML={{ __html: item.timing }}></td>
                    <td style={{ fontWeight: 800 }}>{item.sjuet}</td>
                    <td>
                        <button className="btn-small" onClick={() => handleShowFees(item.name)}>FEES</button>
                        <button 
                            className={`apply-btn ${alreadyApplied ? 'already-applied' : ''}`} 
                            onClick={() => handleApply(item.name)}
                            disabled={alreadyApplied}
                        >
                            {alreadyApplied ? 'APPLIED' : 'APPLY'}
                        </button>
                    </td>
                </tr>
            );
        });
        return rows;
    };

    return (
        <div className="admissions-wrapper">
            <div className="banner">
                <h1>ADMISSIONS 2026</h1>
            </div>

            {view === 'instructions' && (
                <div className="container" id="admissionsPage">
                    <div className="breadcrumb">
                        <a onClick={() => onNavigate('home')}>Home</a> &gt;&gt; <span>Admissions 2026</span>
                    </div>

                    <div className="section-title">General Instructions:</div>

                    <ol>
                        <li>All admissions are online.</li>
                        <li className="highlight-red">
                            The Management / University does not collect any type of Capitation fees / Donation other than the fees mentioned above.
                        </li>
                        <li>
                            St Joseph's University, Bengaluru, does not authorise any individual or organisation to process admissions on its behalf.
                            Applicants are cautioned against receiving SMS/Email/, WhatsApp messages, or phone calls from unauthorized organizations
                            or individuals on or off its campus. St Joseph’s University, Bengaluru, will not bear any responsibility for applicants being
                            misguided by such promises.
                        </li>
                        <li>
                            St Joseph’s University, Bengaluru, will send emails from
                            <span className="link-blue"> sju@linways.in</span> or
                            <span className="link-blue"> sju.edu.in</span> domains for the application process.
                            An email will be sent only to the selected candidates for the interview through the SJU sender ID.
                        </li>
                        <li>
                            The application fee for UG Programmes is ₹ 1000, for PG Programmes and PG Diploma Programmes is ₹ 1200,
                            and for Doctoral Programmes (PhD) is ₹ 1000.
                            For programmes with an entrance test, an additional fee of ₹ 200 will be charged (additional bank charges may apply).
                            The application fee is not refundable under any circumstances.
                        </li>
                        <li>Applicants for all bachelor's programmes should update their XII Standard / II PU marks in their application form.</li>
                        <li>
                            The programmes with an entrance test for admission are clearly specified. Requests for changes to date/time/venue/mode
                            of test/interview will not be entertained. Failure to attend the entrance test/interview is considered as “not selected”.
                        </li>
                        <li>
                            For details of the St Joseph's University Entrance Tests (SJUET), please refer to the web page of the respective programme.
                        </li>
                        <li>
                            St Joseph's University Entrance Tests (SJUET) for Cycle-I will be conducted across 5 states in the following cities:
                            Chennai, Kolkata, Ranchi, Cochin/Ernakulam, and Bengaluru.
                        </li>
                    </ol>

                    <div className="center-btn">
                        <button className="go-btn" onClick={() => { setView('programmes'); window.scrollTo(0, 0); }}>GO TO PROGRAMMES</button>
                    </div>
                </div>
            )}

            {view === 'programmes' && (
                <div className="container programmes-page" style={{ display: 'block' }}>
                    <div className="breadcrumb">
                        <a onClick={() => onNavigate('home')}>Home</a> &gt;&gt; <a onClick={() => { setView('instructions'); window.scrollTo(0, 0); }}>Admissions 2026</a> &gt;&gt; <span>Programmes</span>
                    </div>

                    <h2 style={{ fontSize: '34px', fontWeight: '900', color: '#0b2c4a', marginBottom: '8px' }}>
                        PROGRAMMES
                    </h2>

                    <div className="tabs">
                        <button className={`tab ${activeTab === 'ug' ? 'active' : ''}`} onClick={() => setActiveTab('ug')}>UNDERGRADUATE</button>
                        <button className={`tab ${activeTab === 'pg' ? 'active' : ''}`} onClick={() => setActiveTab('pg')}>POSTGRADUATE</button>
                        <button className={`tab ${activeTab === 'diploma' ? 'active' : ''}`} onClick={() => setActiveTab('diploma')}>PG DIPLOMA</button>
                    </div>

                    <div className="note">
                        The dates might be subject to change. Kindly look out for latest updates.<br />
                        The dates, timings and venues will be updated on the applicant portal.
                    </div>

                    <div className="table-wrap">
                        <table id="programmeTable">
                            <thead>
                                <tr>
                                    <th style={{ width: '80px' }}>SL. No.</th>
                                    <th>Name</th>
                                    <th style={{ width: '250px' }}>Batch Timing</th>
                                    <th style={{ width: '160px' }}>SJU Entrance Test (SJUET)</th>
                                    <th style={{ width: '260px' }}>Fees</th>
                                </tr>
                            </thead>
                            <tbody>
                                {renderProgrammeRows()}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Apply Modal */}
            {applyModalOpen && (
                <div className="modal" style={{ display: 'flex' }} onClick={(e) => { if (e.target.className === 'modal') setApplyModalOpen(false); }}>
                    <div className="modal-box">
                        <div className="modal-header">
                            <div className="modal-title">Apply for {selectedProgramme}</div>
                            <button className="close-btn" onClick={() => setApplyModalOpen(false)}>X</button>
                        </div>

                        <div className="form-group">
                            <label>Full Name</label>
                            <input type="text" placeholder="Enter your name" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />
                        </div>

                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" placeholder="Enter your email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                        </div>

                        <div className="form-group">
                            <label>Phone Number</label>
                            <input type="tel" placeholder="Enter your phone number" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                        </div>

                        <div className="form-group">
                            <label>Selected Programme</label>
                            <input type="text" value={selectedProgramme} readOnly />
                        </div>

                        <button className="submit-btn" onClick={handleSubmit}>SUBMIT APPLICATION</button>
                        {submitted && <div className="success-msg" style={{ display: 'block' }}>✅ Application submitted successfully!</div>}
                    </div>
                </div>
            )}

            {/* Fee Modal */}
            {feeModalOpen && (
                <div className="modal" style={{ display: 'flex' }} onClick={(e) => { if (e.target.className === 'modal') setFeeModalOpen(false); }}>
                    <div className="fee-modal-box">
                        <div className="fee-scroll-content">
                            <h3 style={{ color: '#0b2c4a', marginBottom: '15px' }}>Fee Structure - {feeProgramme}</h3>

                            <table className="fee-structure-table">
                                <thead>
                                    <tr>
                                        <th>Programme</th>
                                        <th>Karnataka</th>
                                        <th>Non-Karnataka</th>
                                        <th>NRI / OCI</th>
                                        <th>SAARC</th>
                                        <th>Foreign</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Admission fee (Non-refundable One-Time Fee)</td>
                                        <td>5,000</td>
                                        <td>5,000</td>
                                        <td>5,000</td>
                                        <td>5,000</td>
                                        <td>5,000 / US $56</td>
                                    </tr>
                                    <tr>
                                        <td>I Year</td>
                                        <td>1,05,000</td>
                                        <td>1,20,000</td>
                                        <td>1,65,000</td>
                                        <td>1,65,000</td>
                                        <td>2,05,000 / US $2278</td>
                                    </tr>
                                    <tr>
                                        <td>II year</td>
                                        <td>1,10,000</td>
                                        <td>1,25,000</td>
                                        <td>1,70,000</td>
                                        <td>1,70,000</td>
                                        <td>2,10,000 / US $2333</td>
                                    </tr>
                                    <tr>
                                        <td>III year</td>
                                        <td>1,15,000</td>
                                        <td>1,30,000</td>
                                        <td>1,75,000</td>
                                        <td>1,75,000</td>
                                        <td>2,15,000 / US $2388</td>
                                    </tr>
                                </tbody>
                            </table>

                            <div className="extra-fees-section">
                                <div className="extra-fees-title">The additional fee to be paid is as follows:</div>

                                <div className="fee-row">
                                    <span>German / French / Addl. English / Introductory French / Introductory Spanish (2nd Lang)</span>
                                    <span className="fee-amount">20,000</span>
                                </div>
                                <div className="fee-row">
                                    <span>Introductory Kannada</span>
                                    <span className="fee-amount">1,000</span>
                                </div>
                                <div className="fee-row">
                                    <span>Sanskrit</span>
                                    <span className="fee-amount">5,000</span>
                                </div>
                                <div className="fee-row">
                                    <span>Field Visit</span>
                                    <span className="fee-amount">3,000</span>
                                </div>
                            </div>

                            <div className="fee-footer-note">
                                <p>• Students opting for Kannada / Hindi / Tamil will not be charged any additional fee.</p>
                                <p>• <strong>Note:</strong> If admitted, the fee must be paid in full within the time prescribed.</p>
                                <p style={{ color: 'red', fontWeight: 'bold', marginTop: '10px' }}>
                                    The Management / University does not collect any type of Capitation fees / Donation other than the fees mentioned above.
                                </p>
                            </div>
                        </div>

                        <div className="modal-footer-action">
                            <button className="btn-close-gray" onClick={() => setFeeModalOpen(false)}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admissions;
