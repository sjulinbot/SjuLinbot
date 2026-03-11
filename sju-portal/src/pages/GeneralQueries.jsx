import React, { useState, useEffect, useRef } from 'react';
import './GeneralQueries.css';
import emblem from '../assets/St Joseph\'s University Emblem.png';

const GeneralQueries = ({ onNavigate }) => {
    const [messages, setMessages] = useState([
        {
            text: (
                <span>
                    Welcome to&nbsp;&nbsp;<strong>St Joseph's University</strong><br />
                    I am your virtual assistant here to guide you through the queries you're having.<br />
                    To begin, may I please know your <strong>Full Name</strong>?
                </span>
            ),
            sender: 'bot'
        }
    ]);
    const [userName, setUserName] = useState('');
    const [isNameEntered, setIsNameEntered] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');
    const chatBodyRef = useRef(null);

    useEffect(() => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const newUserMessage = { text: inputValue, sender: 'user' };
        setMessages(prev => [...prev, newUserMessage]);

        if (!isNameEntered) {
            const name = inputValue.trim();
            setUserName(name);
            setIsNameEntered(true);
            setInputValue('');

            // Bot response after name entry
            setTimeout(() => {
                setMessages(prev => [...prev, {
                    text: (
                        <div className="gq-post-name-response">
                            <div className="gq-thanks-text">Thank you,</div>
                            <div className="gq-user-name-display">{name}</div>
                            <div className="gq-info-text">
                                We are now accepting applications for the<br />
                                Academic Year 2026-27.<br />
                                Please select an option below.
                            </div>
                            <div className="gq-select-option-container">
                                <button
                                    className="gq-select-btn"
                                    type="button"
                                    onClick={() => setIsModalOpen(true)}
                                >
                                    <svg viewBox="0 0 24 24" width="20" height="20" className="gq-grid-icon">
                                        <path fill="currentColor" d="M3,4H21V6H3V4M3,11H21V13H3V11M3,18H21V20H3V18Z" />
                                        <circle cx="1.5" cy="5" r="1.5" fill="currentColor" />
                                        <circle cx="1.5" cy="12" r="1.5" fill="currentColor" />
                                        <circle cx="1.5" cy="19" r="1.5" fill="currentColor" />
                                    </svg>
                                    Select an option
                                </button>
                            </div>
                        </div>
                    ),
                    sender: 'bot'
                }]);
            }, 800);
        } else {
            setInputValue('');
            // Optional: Mock bot response for other queries
            setTimeout(() => {
                setMessages(prev => [...prev, {
                    text: "Thank you for your query. Our team will get back to you soon, or you can check our FAQ section.",
                    sender: 'bot'
                }]);
            }, 1000);
        }
    };

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
    };

    const handleSendOption = () => {
        if (!selectedOption) return;

        setIsModalOpen(false);
        const userMsg = { text: selectedOption, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);

        // Mock bot response based on selection
        setTimeout(() => {
            let botReply = `You selected "${selectedOption}". How can I provide more details about this?`;

            if (selectedOption === "Hostel") {
                botReply = (
                    <span>
                        🏠 <strong>Hostel Facilities</strong><br />
                        St Joseph's University provides accommodation primarily for <strong>Male Students</strong> who have secured admission.<br /><br />
                        📍 <strong>Locations: Campus Hostel:</strong> Located inside the main campus (Limited seats: ~220). <em>Ejipura Hostel:</em> Located 6km away (Dormitory style). <br />
                        <em>Note: Hostel admissions are only for Shift 1 & Shift 2 students.</em><br /><br />
                        📝 <strong>How to Apply:</strong> You can apply <strong>*ONLY</strong> after paying your University Academic Fee. Use your registered email ID to login to the portal.<br /><br />
                        📞 <strong>Contact:</strong> +91-94808-11925 | <a href="mailto:sjuhosteladmission@sju.edu.in" style={{ color: '#25d366', textDecoration: 'underline' }}>sjuhosteladmission@sju.edu.in</a>
                    </span>
                );
            } else if (selectedOption === 'Programmes Offered') {
                botReply = (
                    <span>
                        We offer a wide range of Undergraduate, Postgraduate, and PG Diploma programmes.<br />
                        <strong>Click here to view the complete Programmes list:</strong>&nbsp;👇&nbsp;
                        <a href="https://sju.edu.in/all-courses" target="_blank" rel="noopener noreferrer" style={{ color: '#25d366', textDecoration: 'underline' }}>
                            https://sju.edu.in/all-courses
                        </a>
                    </span>
                );
            } else if (selectedOption === "FAQ's") {
                botReply = (
                    <span>
                        <span style={{ color: '#ff4d4d' }}>❓</span> <strong>SJU Help Center</strong><br />
                        Have a specific question? We have compiled a list of answers regarding Admissions, Languages, Fees, and NIOS eligibility.<br />
                        <strong>Click here to read the full FAQ:</strong>&nbsp;👇&nbsp;
                        <a href="https://sju.edu.in/faq" target="_blank" rel="noopener noreferrer" style={{ color: '#25d366', textDecoration: 'underline' }}>
                            https://sju.edu.in/faq
                        </a>
                    </span>
                );
            } else if (selectedOption === "International Admissions") {
                botReply = (
                    <span>
                        St Joseph's University is home to students from many countries. We have a dedicated <strong>Office for International Affairs</strong> to assist you:<br /><br />
                        📍 <strong>Contact the International Office:</strong>&nbsp;
                        <a href="https://sju.edu.in/sjuoiacontactus" target="_blank" rel="noopener noreferrer" style={{ color: '#25d366', textDecoration: 'underline' }}>
                            https://sju.edu.in/sjuoiacontactus
                        </a><br />
                        🌐 <strong>Visit the International Affairs Page:</strong><br />
                        <a href="https://sju.edu.in/sjuofficeforinternationalaffairs" target="_blank" rel="noopener noreferrer" style={{ color: '#25d366', textDecoration: 'underline' }}>
                            https://sju.edu.in/sjuofficeforinternationalaffairs
                        </a>
                    </span>
                );
            } else if (selectedOption === 'Reach out to us') {
                botReply = (
                    <span>
                        📞 <strong>Contact St Joseph's University</strong><br />
                        We are happy to assist you! Please reach out to the specific department for faster resolution:<br /><br />
                        🎓 <strong>Admission Queries:</strong> Email: <a href="mailto:admission@sju.edu.in" style={{ color: '#25d366' }}>admission@sju.edu.in</a> • Phone: <span style={{ color: '#25d366' }}>080 2227 4079 / 080 2221 1429</span><br />
                        🏠 <strong>Hostel Queries:</strong> Email: <a href="mailto:sjuhosteladmission@sju.edu.in" style={{ color: '#25d366' }}>sjuhosteladmission@sju.edu.in</a> • Phone: <span style={{ color: '#25d366' }}>+91-94808-11925</span><br />
                        💼 <strong>Placements:</strong> Email: <a href="mailto:placement@sju.edu.in" style={{ color: '#25d366' }}>placement@sju.edu.in</a><br />
                        🕒 <strong>Office Hours:</strong> Mon-Fri: 9:00 AM - 4:00 PM • Sat: 9:00 AM - 12:30 PM<br />
                        📍 <strong>Address:</strong> St Joseph's University, 36, Lalbagh Road, Bengaluru-560027.<br />
                        🌐 <strong>Visit Contact Page:</strong> <a href="https://sju.edu.in/contact-us" target="_blank" rel="noopener noreferrer" style={{ color: '#25d366', textDecoration: 'underline' }}>https://sju.edu.in/contact-us</a>
                    </span>
                );
            }

            setMessages(prev => [...prev, {
                text: botReply,
                sender: 'bot'
            }]);
        }, 800);

        setSelectedOption('');
    };

    const handleExit = () => {
        // Clear all stored data
        setMessages([]);
        setUserName('');
        setIsNameEntered(false);
        setInputValue('');

        // Redirect back home
        onNavigate('home');
    };

    return (
        <div className="gq-container">
            <header className="gq-header">
                <div className="gq-header-left">
                    <img src={emblem} alt="SJU Emblem" className="gq-logo-img" />
                    <div className="gq-header-text">
                        <div className="gq-uni-badge-container">
                            <span className="gq-university-name">St Joseph's University</span>
                        </div>
                    </div>
                </div>
                <button className="gq-exit-btn" onClick={handleExit}>EXIT</button>
            </header>

            <main className="gq-chat-body" ref={chatBodyRef}>
                <div className="gq-messages-container">
                    {messages.map((msg, index) => (
                        <div key={index} className={`gq-message-wrapper ${msg.sender}`}>
                            <div className={`gq-message ${msg.sender}`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            {!isNameEntered && (
                <footer className="gq-footer">
                    <form className="gq-input-container" onSubmit={handleSendMessage}>
                        <input
                            type="text"
                            placeholder="Type your message here"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            className="gq-input"
                        />
                        <button type="submit" className="gq-send-btn">
                            <svg viewBox="0 0 24 24" width="24" height="24" className="">
                                <path fill="currentColor" d="M1.101 21.757L23.8 12.028 1.101 2.3 l.011 7.912 13.623 1.816-13.623 1.817-.011 7.912z"></path>
                            </svg>
                        </button>
                    </form>
                </footer>
            )}

            {isModalOpen && (
                <div className="gq-modal-overlay">
                    <div className="gq-modal-content">
                        <div className="gq-modal-header">
                            <button className="gq-modal-close" onClick={() => setIsModalOpen(false)}>
                                <svg viewBox="0 0 24 24" width="24" height="24">
                                    <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                                </svg>
                            </button>
                            <span>Select an option</span>
                        </div>
                        <div className="gq-modal-options">
                            {[
                                'Hostel',
                                'Programmes Offered',
                                'International Admissions',
                                "FAQ's",
                                'Reach out to us'
                            ].map((option) => (
                                <div
                                    key={option}
                                    className={`gq-modal-option ${selectedOption === option ? 'selected' : ''}`}
                                    onClick={() => handleOptionSelect(option)}
                                >
                                    <span className="gq-option-text">{option}</span>
                                    <div className={`gq-option-radio ${selectedOption === option ? 'checked' : ''}`}>
                                        {selectedOption === option && <div className="gq-option-radio-inner" />}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="gq-modal-footer">
                            <span className="gq-selected-preview">{selectedOption}</span>
                            <button
                                className={`gq-option-send-btn ${selectedOption ? 'active' : ''}`}
                                onClick={handleSendOption}
                                disabled={!selectedOption}
                            >
                                <svg viewBox="0 0 24 24" width="24" height="24">
                                    <path fill="currentColor" d="M1.101 21.757L23.8 12.028 1.101 2.3l.011 7.912 13.623 1.816-13.623 1.817-.011 7.912z"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GeneralQueries;
