import React from 'react';
import logo from '../assets/St Joseph\'s University Emblem.png';

const Header = ({ onNavigate }) => {
  return (
    <>
      <div className="top-bar">
        <div className="contact-info">
          <span><i className="fa-solid fa-map-location-dot"></i> St Joseph's University, 36, Lalbagh Road, Bengaluru-560027, Karnataka, India.</span>
          <span className="separator">|</span>
          <span><i className="fas fa-phone"></i> 9480811912</span>
          <span className="separator">|</span>
          <span><i className="fas fa-envelope"></i> desk@sju.edu.in</span>
        </div>
      </div>

      <header className="main-nav-header">
        <div className="logo-container" onClick={() => onNavigate('home')} style={{ cursor: 'pointer' }}>
          <img src={logo} alt="SJU Logo" height="60" />
          <div className="logo-text">
            <h2>St Joseph's University</h2>
            <p>Bengaluru, India</p>
          </div>
        </div>

        <nav>
          <ul>
            <li><a href="#admissions" onClick={(e) => { e.preventDefault(); onNavigate('admissions'); }}>Admissions</a></li>
            <li><a href="#login" onClick={(e) => { e.preventDefault(); onNavigate('login'); }}>Login</a></li>
            <li><a href="#research" onClick={(e) => { e.preventDefault(); onNavigate('research'); }}>Research</a></li>
            <li><a href="#library" onClick={(e) => { e.preventDefault(); onNavigate('library'); }}>Library</a></li>
          </ul>
        </nav>
      </header>
    </>
  );
};

export default Header;
