import React, { useState } from 'react';
import './AttendanceReport.css';

const AttendanceReport = ({ onNavigate, data }) => {
    const [selectedSemester, setSelectedSemester] = useState('');

    const currentData = (data && selectedSemester && data[selectedSemester]) ? data[selectedSemester] : { text: "", rows: [] };
    let totalTH = 0, totalAH = 0;

    const rows = currentData.rows
    ? currentData.rows.map((row, index) => {
        const th = row[1];
        const ah = row[2];
        const dl = 0;
        const total = ah + dl;
        const percentAH = th > 0 ? ((ah / th) * 100).toFixed(2) : "0.00";
        const percentAHDL = th > 0 ? ((ah / th) * 100).toFixed(2) : "0.00";

        return {
            index: index + 1,
            name: row[0],
            th,
            ah,
            dl,
            total,
            percentAH,
            percentAHDL
        };
    })
    : [];

    const totalPercent = totalTH > 0 ? ((totalAH / totalTH) * 100).toFixed(2) : "0.00";

    return (
        <div className="attendance-page-background">


            <div className="report">
                <div className="title">COURSE WISE REPORT</div>

                {/* Semester Selection */}
                <div className="semester-box">
                    <label><strong>Semester:</strong></label>
                    <select value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)}>
                        <option value="">-- Choose Term --</option>
                        {data && Object.keys(data).map(key => (
                            <option key={key} value={key}>Semester {key.replace('sem', '')}</option>
                        ))}
                    </select>
                </div>

                {!selectedSemester ? (
                    <div className="placeholder-container" style={{ textAlign: 'center', padding: '50px 20px', color: '#666' }}>
                        <span className="material-icons" style={{ fontSize: '64px', display: 'block', marginBottom: '10px' }}>manage_search</span>
                        <p style={{ fontSize: '16px' }}>Please select a semester to view attendance details.</p>
                    </div>
                ) : (
                    <>
                        <div className="note">
                            <strong>Note:</strong> When the rule “Attendance count from date of admission” is enabled,
                            data is shown from the date of admission.
                        </div>

                        <div className="sub-title">COURSE WISE REPORT</div>
                        <div className="sub-text" id="semesterText">
                            {currentData.text}
                        </div>

                        <table>
                            <thead>
                                <tr>
                                    <th>Sl.No</th>
                                    <th>Course Name</th>
                                    <th>TH</th>
                                    <th>AH</th>
                                    <th>DL</th>
                                    <th>AH + DL</th>
                                    <th>AH%</th>
                                    <th>AH+DL%</th>
                                </tr>
                            </thead>

                            <tbody id="attendanceBody">
                                {rows.map((row, i) => (
                                    <tr key={i}>
                                        <td>{row.index}</td>
                                        <td className="course">{row.name}</td>
                                        <td>{row.th}</td>
                                        <td>{row.ah}</td>
                                        <td>{row.dl}</td>
                                        <td>{row.total}</td>
                                        <td>{row.percentAH}%</td>
                                        <td>{row.percentAHDL}%</td>
                                    </tr>
                                ))}
                            </tbody>

                            <tfoot id="attendanceFooter">
                                <tr>
                                    <td colSpan="2">Total</td>
                                    <td>{totalTH}</td>
                                    <td>{totalAH}</td>
                                    <td>0</td>
                                    <td>{totalAH}</td>
                                    <td>{totalPercent}%</td>
                                    <td>{totalPercent}%</td>
                                </tr>
                            </tfoot>
                        </table>
                    </>
                )}
            </div>
        </div>
    );
};

export default AttendanceReport;
