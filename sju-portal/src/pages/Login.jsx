import React, { useState } from 'react';
import bgImage from '../assets/background.jpg';

const Login = ({ onLoginSuccess }) => {
    const [loginType, setLoginType] = useState('student'); // 'student' or 'staff'
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        try {
            const body = {
                registerNumber: id,
                password,
                type: loginType === 'staff' ? 'Staff' : 'Student'
            };

            const response = await fetch('http://127.0.0.1:5001/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const data = await response.json();
            if (data.success) {
                const role = loginType === 'staff' ? 'staff' : 'student';
                onLoginSuccess(data.studentId || data.id, role);
            } else {
                setError(data.message);
            }
        } catch {
            setError('Connection failed. Is the server running?');
        }
    };

    return (
        <div className="login-portal-wrapper" style={{ backgroundImage: `url(${bgImage})` }}>
            <div className="login-card">
                <div className="sju-logo">SJU</div>
                <div className="university-name">St Joseph's University</div>
                <div className="portal-label">
                    {loginType === 'student' ? 'Student Portal Login' : 'Staff Login'}
                </div>

                {error && <div className="login-error-message">{error}</div>}

                <input
                    type="text"
                    className="input-field"
                    placeholder={loginType === 'student' ? "Register Number" : "Staff ID"}
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                />
                <input
                    type="password"
                    className="input-field"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button className="sign-in-btn" onClick={handleLogin}>SIGN IN</button>

                <div className="footer-links">
                    <a href="#" onClick={(e) => {
                        e.preventDefault();
                        setLoginType(loginType === 'student' ? 'staff' : 'student');
                        setError('');
                        setId('');
                        setPassword('');
                    }} className="switch-link">
                        {loginType === 'student' ? 'Are you Staff? Login here' : 'Are you Student? Login here'}
                    </a>
                    <hr className="login-divider" />
                    <a href="/" onClick={(e) => { e.preventDefault(); window.location.href = '/'; }} className="back-home">← Back to Home</a>
                </div>
            </div>
        </div>
    );
};

export default Login;
