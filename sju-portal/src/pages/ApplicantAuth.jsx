import React, { useState } from 'react';
import './ApplicantAuth.css';
import emblem from '../assets/St Joseph\'s University Emblem.png';

const ApplicantAuth = ({ onNavigate, onLoginSuccess }) => {
    const [mode, setMode] = useState('login'); // 'login' or 'register'
    const [showPassword, setShowPassword] = useState(false);
    const [isRobotTicked, setIsRobotTicked] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Form States
    const [loginData, setLoginData] = useState({ username: '', password: '' });
    const [registerData, setRegisterData] = useState({
        username: '',
        course: '',
        email: '',
        password: '',
        mobile: '',
        countryCode: '+91'
    });

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await fetch('http://127.0.0.1:5001/api/applicant/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData)
            });
            const data = await response.json();
            if (data.success) {
                // Pass full user data to App
                onLoginSuccess(data.name || loginData.username, 'applicant', true);
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError(`Connection error: ${err.message}. Is the server running on port 5001?`);
        }
        setLoading(false);
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        if (!isRobotTicked) {
            setError('Please verify that you are not a robot.');
            return;
        }
        setError('');
        setLoading(true);
        try {
            const response = await fetch('http://127.0.0.1:5001/api/applicant/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(registerData)
            });
            const data = await response.json();
            if (data.success) {
                alert('Registration successful! Please login.');
                setMode('login');
                setLoginData({ ...loginData, username: registerData.username });
            } else {
                setError(data.message || 'Registration failed');
            }
        } catch (err) {
            console.error('Registration error:', err);
            setError(`Connection error: ${err.message}. Is the server running on port 5001?`);
        }
        setLoading(false);
    };

    const handleBackToHome = () => {
        onNavigate('home');
    };

    return (
        <div className="applicant-auth-container">
            <button className="back-nav-btn" onClick={handleBackToHome} aria-label="Back to Home">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
            </button>
            <header className="auth-header">
                <img src={emblem} alt="SJU Emblem" className="sju-emblem" />
                <h1 className="university-title">St Joseph's University</h1>
                <div className="location-tag">BENGALURU, INDIA</div>
                <div style={{ color: '#fff', fontSize: '0.9rem', marginTop: '10px', fontStyle: 'italic' }}>Forming people for others</div>
            </header>

            <div className="auth-card">
                <div className="auth-tabs">
                    <button
                        className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
                        onClick={() => { setMode('login'); setError(''); }}
                    >
                        Login
                    </button>
                    <button
                        className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
                        onClick={() => { setMode('register'); setError(''); }}
                    >
                        Register
                    </button>
                </div>

                {error && <div className="login-error" style={{ backgroundColor: 'rgba(255,0,0,0.1)', padding: '10px', borderRadius: '5px', marginBottom: '15px' }}>{error}</div>}

                {mode === 'login' ? (
                    <form className="auth-form" onSubmit={handleLoginSubmit}>
                        <div className="input-group">
                            <label>User Name <span className="required-star">*</span></label>
                            <input
                                type="text"
                                className="auth-input"
                                placeholder="user name"
                                value={loginData.username}
                                onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label>Password <span className="required-star">*</span></label>
                            <div className="password-container">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="auth-input"
                                    placeholder="Password"
                                    value={loginData.password}
                                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                    required
                                />
                                <button
                                    type="button"
                                    className="toggle-password"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? '👁️' : '👁️‍🗨️'}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="auth-submit-btn" disabled={loading}>
                            {loading ? 'Logging in...' : 'Login'}
                        </button>

                        <div className="auth-footer-links">
                            <span className="footer-link">Previous Year Login?</span>
                            <span className="footer-link">Forgot Password?</span>
                        </div>
                    </form>
                ) : (
                    <form className="auth-form" onSubmit={handleRegisterSubmit}>
                        <div className="input-group">
                            <label>User Name <span className="required-star">*</span></label>
                            <input
                                type="text"
                                className="auth-input"
                                placeholder="Choose a username"
                                value={registerData.username}
                                onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label>Course <span className="required-star">*</span></label>
                            <input
                                type="text"
                                className="auth-input"
                                placeholder="Course Type"
                                value={registerData.course}
                                onChange={(e) => setRegisterData({ ...registerData, course: e.target.value })}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label>Candidate Email Address <span className="required-star">*</span></label>
                            <input
                                type="email"
                                className="auth-input"
                                placeholder="Email Address"
                                value={registerData.email}
                                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label>Password <span className="required-star">*</span></label>
                            <input
                                type="password"
                                className="auth-input"
                                placeholder="Create Password"
                                value={registerData.password}
                                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label>Candidate Mobile Number <span className="required-star">*</span></label>
                            <div className="mobile-input-container">
                                <input
                                    type="text"
                                    className="auth-input country-code"
                                    value={registerData.countryCode}
                                    onChange={(e) => setRegisterData({ ...registerData, countryCode: e.target.value })}
                                    placeholder="Code"
                                />
                                <input
                                    type="text"
                                    className="auth-input mobile-number"
                                    placeholder="Mobile Number"
                                    value={registerData.mobile}
                                    onChange={(e) => setRegisterData({ ...registerData, mobile: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="recaptcha-mock" onClick={() => setIsRobotTicked(!isRobotTicked)} style={{ cursor: 'pointer', border: isRobotTicked ? '1px solid #4cd137' : '1px solid #d1d5db' }}>
                            <div className={`recaptcha-checkbox ${isRobotTicked ? 'ticked' : ''}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {isRobotTicked && <span style={{ color: '#4cd137', fontWeight: 'bold' }}>✓</span>}
                            </div>
                            <div className="recaptcha-text">
                                I'm not a robot
                                <div style={{ fontSize: '0.7rem', color: '#666' }}>reCAPTCHA is changing its terms of service.</div>
                            </div>
                            <div className="recaptcha-logo">
                                <img src="https://www.gstatic.com/recaptcha/api2/logo_48.png" alt="reCAPTCHA" width="24" />
                                <span>reCAPTCHA</span>
                                <div style={{ fontSize: '0.6rem' }}>Privacy - Terms</div>
                            </div>
                        </div>

                        <button type="submit" className="auth-submit-btn" disabled={loading}>
                            {loading ? 'Processing...' : 'Register'}
                        </button>
                        <button type="reset" className="auth-reset-btn" onClick={() => { setIsRobotTicked(false); setError(''); }}>Reset</button>
                    </form>
                )}

                <div className="form-footer-nav">
                    <span onClick={handleBackToHome}>Home</span> |
                    <span>Contact Details</span> |
                    <span>Terms and Conditions</span> |
                    <span>Refund Policy</span> |
                    <span>Privacy Policy</span>
                </div>
            </div>

            <div style={{ marginTop: '20px', fontSize: '1.2rem', fontWeight: 'bold' }}>
                Apply Now at sju.edu.in
            </div>
        </div>
    );
};

export default ApplicantAuth;
