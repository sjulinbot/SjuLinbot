import React, { useState, useEffect, useRef } from 'react';

const Chatbot = ({ onNavigate, onLoginSuccess, pageContext, isLoggedIn, userRole, onLogout, isChatbotNav }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [view, setView] = useState('menu'); // 'menu', 'login_student', 'login_staff', 'student_options', 'staff_options'
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const chatbotRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            const chatbotIcon = document.getElementById('chatbot-icon');
            if (chatbotRef.current && 
                !chatbotRef.current.contains(event.target) && 
                chatbotIcon && 
                !chatbotIcon.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const toggleChat = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            if (isLoggedIn && userRole === 'student') setView('student_options');
            else if (isLoggedIn && userRole === 'staff') setView('staff_options');
            else setView('menu');
        }
        setError('');
        setId('');
        setPassword('');
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        const loginType = view === 'login_student' ? 'Student' : 'Staff';

        try {
            const response = await fetch('http://127.0.0.1:5001/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ registerNumber: id, password, type: loginType })
            });

            const data = await response.json();

            if (data.success) {
                const role = view === 'login_student' ? 'student' : 'staff';
                onLoginSuccess(view === 'login_student' ? data.studentId : data.id, role, role !== 'student', true);
                if (role !== 'student') {
                    setIsOpen(false);
                }
                setView(role === 'student' ? 'student_options' : 'staff_options');
            } else {
                setError(data.message || 'Invalid credentials');
            }
        } catch (err) {
            setError('Connection failed');
        }
    };

    const handleMenuOption = (option) => {
        if (option === 'student') {
            if (isLoggedIn && userRole === 'student') {
                setView('student_options');
            } else {
                setView('login_student');
            }
        } else if (option === 'staff') {
            if (isLoggedIn && userRole === 'staff') {
                setView('staff_options');
            } else {
                setView('login_staff');
            }
        } else if (option === 'applicant') {
            onNavigate('applicantAuth');
            setIsOpen(false);
        } else if (option === 'general') {
            onNavigate('generalQueries');
            setIsOpen(false);
        }
    };

    const handleNav = (page) => {
        onNavigate(page, true);
        setIsOpen(false);
    };

    return (
        <>
            <div id="chatbot-icon" onClick={() => {
                if (isChatbotNav && !isOpen) {
                    onNavigate('home');
                    setIsOpen(true);
                } else if (isLoggedIn && userRole === 'staff' && pageContext === 'MAIN_PAGE' && !isOpen) {
                    onNavigate('staffDashboard');
                } else if (isLoggedIn && userRole === 'applicant' && pageContext === 'MAIN_PAGE' && !isOpen) {
                    onNavigate('applicantDashboard');
                } else {
                    toggleChat();
                }
            }}>
                {isChatbotNav && !isOpen ? <i className="fas fa-arrow-left" style={{ color: 'white', fontSize: '24px' }}></i> : '🤖'}
            </div>

            <div id="chatbot" ref={chatbotRef} style={{ display: isOpen ? 'flex' : 'none' }}>
                <div className="chat-header" style={{ padding: '20px', background: '#001a33' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flex: 1 }}>
                        {view !== 'menu' && !isLoggedIn && (
                            <button className="back-btn" onClick={() => setView('menu')}>
                                <i className="fas fa-arrow-left"></i>
                            </button>
                        )}
                        <span style={{ fontSize: '18px', fontWeight: '700', whiteSpace: 'nowrap' }}>
                            SJU Digital Assistant {isLoggedIn ? (userRole === 'student' ? '(student)' : (userRole === 'staff' ? '(staff)' : '(applicant)')) : ''}
                        </span>
                        {isLoggedIn && (
                            <button className="chatbot-logout-btn" onClick={() => { onLogout(); setView('menu'); }}>
                                <i className="fas fa-sign-out-alt"></i>
                            </button>
                        )}
                    </div>
                    <button className="close-btn" onClick={toggleChat} style={{
                        background: 'transparent',
                        padding: '0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '24px',
                        marginLeft: '10px'
                    }}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                <div id="chat-body" style={{ background: '#fff', flex: 1, overflowY: 'auto' }}>
                    {view === 'menu' ? (
                        <>
                            <div className="linbot-welcome-box">
                                Welcome to SJU Linbot 🤖 .
                            </div>
                            <div className="chat-btn-container-centered">
                                <button className="option-btn-centered" onClick={() => handleMenuOption('student')}>
                                    <i className="fas fa-graduation-cap"></i> Student
                                </button>
                                <button className="option-btn-centered" onClick={() => handleMenuOption('staff')}>
                                    <i className="fas fa-chalkboard-user"></i> Staff
                                </button>
                                <button className="option-btn-centered" onClick={() => handleMenuOption('applicant')}>
                                    <i className="fas fa-file-signature"></i> Applicant
                                </button>
                                <button className="option-btn-centered" onClick={() => handleMenuOption('general')}>
                                    <i className="fas fa-question-circle"></i> General Queries
                                </button>
                            </div>
                        </>
                    ) : (view === 'student_options' || view === 'staff_options') ? (
                        <div style={{ width: '100%', padding: '20px 0' }}>

                            <div className="chat-btn-container-centered" style={{ gap: '20px' }}>
                                <button className="option-btn-centered" onClick={() => handleNav(userRole === 'staff' ? 'staffDashboard' : 'dashboard')} style={{ background: '#ffb100', color: '#000', borderRadius: '40px', padding: '18px', fontSize: '16px', textTransform: 'uppercase', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', border: 'none', fontWeight: '700' }}>
                                    HOME
                                </button>
                                <button className="option-btn-centered" onClick={() => handleNav('attendance')} style={{ background: '#ffb100', color: '#000', borderRadius: '40px', padding: '18px', fontSize: '16px', textTransform: 'uppercase', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', border: 'none', fontWeight: '700' }}>
                                    ATTENDANCE
                                </button>
                                <button className="option-btn-centered" onClick={() => handleNav('fees')} style={{ background: '#ffb100', color: '#000', borderRadius: '40px', padding: '18px', fontSize: '16px', textTransform: 'uppercase', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', border: 'none', fontWeight: '700' }}>
                                    FEES
                                </button>
                                <button className="option-btn-centered" onClick={() => handleNav('result')} style={{ background: '#ffb100', color: '#000', borderRadius: '40px', padding: '18px', fontSize: '16px', textTransform: 'uppercase', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', border: 'none', fontWeight: '700' }}>
                                    RESULT
                                </button>
                                <button className="option-btn-centered" onClick={() => handleNav('leave')} style={{ background: '#ffb100', color: '#000', borderRadius: '40px', padding: '18px', fontSize: '16px', textTransform: 'uppercase', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', border: 'none', fontWeight: '700' }}>
                                    LEAVE MANAGEMENT
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div style={{ padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', boxSizing: 'border-box' }}>
                            <h2 style={{ color: '#1a3a63', marginBottom: '30px', fontSize: '24px', fontWeight: '700' }}>
                                {view === 'login_student' ? 'Student Login' : 'Staff Login'}
                            </h2>
                            <form onSubmit={handleLogin} style={{ width: '100%' }}>
                                <input
                                    type="text"
                                    className="chat-input-field"
                                    placeholder={view === 'login_student' ? "Register Number" : "Staff ID"}
                                    value={id}
                                    onChange={(e) => setId(e.target.value)}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '18px',
                                        marginBottom: '20px',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '12px',
                                        fontSize: '16px',
                                        boxSizing: 'border-box'
                                    }}
                                />
                                <input
                                    type="password"
                                    className="chat-input-field"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '18px',
                                        marginBottom: '25px',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '12px',
                                        fontSize: '16px',
                                        boxSizing: 'border-box'
                                    }}
                                />
                                {error && <div className="login-error" style={{ marginBottom: '15px' }}>{error}</div>}
                                <button type="submit" className="chat-login-btn" style={{
                                    width: '100%',
                                    padding: '18px',
                                    background: '#003a70',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontWeight: '700',
                                    fontSize: '16px',
                                    cursor: 'pointer',
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px'
                                }}>
                                    SIGN IN
                                </button>
                            </form>
                            <div
                                onClick={() => setView('menu')}
                                style={{
                                    marginTop: '25px',
                                    color: '#004a99',
                                    textDecoration: 'underline',
                                    cursor: 'pointer',
                                    fontSize: '16px',
                                    fontWeight: '500'
                                }}
                            >
                                Back to Menu
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Chatbot;
