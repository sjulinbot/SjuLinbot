import React from 'react';
import './AdmissionTicker.css';

const AdmissionTicker = ({ onNavigate }) => {
    return (
        <div className="admission-ticker-container">
            <div className="admission-ticker-wrap">
                <div className="admission-ticker-content" onClick={() => onNavigate && onNavigate('admissions')} style={{ cursor: 'pointer' }}>
                    <span className="ticker-text">ADMISSIONS OPEN ACADEMIC YEAR 2026-27 | APPLY NOW</span>
                    <span className="ticker-text">ADMISSIONS OPEN ACADEMIC YEAR 2026-27 | APPLY NOW</span>
                    <span className="ticker-text">ADMISSIONS OPEN ACADEMIC YEAR 2026-27 | APPLY NOW</span>
                </div>
            </div>
        </div>
    );
};

export default AdmissionTicker;
