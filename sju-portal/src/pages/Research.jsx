import React from 'react';
import './Research.css';
import frVictorImg from '../assets/fr_victor.jpg';
import frDionysiusImg from '../assets/fr_dionysius_new.jpg';
import frRoshanImg from '../assets/fr_roshan.jpg';

const Research = ({ onNavigate }) => {
    return (
        <div className="research-container">
            {/* BANNER */}
            <div className="page-banner">
                <h2>Research & Development Cell</h2>
                <div className="breadcrumb">
                    <a onClick={() => onNavigate && onNavigate('home')}>Home</a> <span>»</span> Research & Development Cell
                </div>
            </div>

            {/* VISION MISSION */}
            <section className="vision-mission-section">
                <div className="vm-container">
                    {/* Vision */}
                    <div className="vm-box">
                        <h3>Vision</h3>
                        <p>To investigate, analyse and assess varied and varying domains of reality in nature and society through
                            research characterised by academic excellence and marked by relevance to the human community and to the
                            biosphere as a whole.</p>
                    </div>

                    {/* Center Image */}
                    <div className="vm-center-img">
                        <img src="https://cdn-icons-png.flaticon.com/512/2857/2857433.png" alt="Mission Vision Signpost" />
                    </div>

                    {/* Mission */}
                    <div className="vm-box">
                        <h3>Mission</h3>
                        <p>To nurture the habit of enquiry among the students, scholars and faculty of St Joseph’s University (SJU), and
                            to promote state-of-the-art academic research in diverse fields in order to realise ideas, policies and
                            technology for the betterment of humankind.</p>
                    </div>
                </div>
            </section>

            {/* MESSAGES */}
            <section className="messages-section">
                <div className="section-title">Messages</div>

                {/* Message 1: Chancellor */}
                <div className="message-card">
                    <div className="msg-sidebar">
                        <img src={frDionysiusImg} alt="Fr Dionysius Vaz SJ" />
                        <div className="msg-name">Fr Dionysius Vaz SJ</div>
                        <div className="msg-title">The Chancellor</div>
                    </div>
                    <div className="msg-content">
                        <p>A Jesuit carries out research as a pilgrim involved in Community-Based Participatory Action Research (CBPAR)
                            through an Ignatian lens. Throughout its history, the Jesuit order has been filled with scientific thinkers
                            who have helped shape our understanding of the world. They have made contributions to scientific conversations
                            and discovery. Pope Francis and the Jesuit Universal Apostolic Preferences too emphasise "care for our common
                            home" and promotion of the dignity of environmental migrants.</p>
                        <p>The Jesuits of Karnataka province have before them the inspirational legacy of veteran scientists like Fr
                            Cecil Saldanha (taxonomical research) and Fr Leo D'Souza (molecular biology and tissue culture), as also
                            scholars like Fr Devasahayam (English literature), Fr Prashant Madtha (Kannada language) and Fr Ambrose Pinto
                            (political thought and Dalit studies).</p>
                        <p>I hope that, besides excelling in academic research, our researchers at SJU will form partnerships with local
                            communities and grassroots movements working for social equity, especially in the vital area of food and water
                            security.</p>
                    </div>
                </div>

                {/* Message 2: Vice Chancellor */}
                <div className="message-card">
                    <div className="msg-sidebar">
                        <img src={frVictorImg} alt="Fr Dr Victor Lobo SJ" />
                        <div className="msg-name">Fr Dr Victor Lobo SJ</div>
                        <div className="msg-title">The Vice Chancellor</div>
                    </div>
                    <div className="msg-content">
                        <p>It is a matter of great joy that, following the upgradation of St. Joseph’s College to a University, we now
                            have a separate institute within SJU to focus on research. I am confident that SJRI will play a transformative
                            role in promoting a culture of research within SJU – research that meets the highest standards of academic
                            rigour while at the same time being socially relevant.</p>
                        <p>While we are all grateful for the vast body of available knowledge that has been produced by generations of
                            scholars and researchers all over the world, we find ourselves situated at a time in history where there are
                            numerous unknowns in every domain that arouse our curiosity. It is towards these knowledge gaps that current
                            research needs to be directed. I am hopeful that SJRI will serve as a vital catalyst in the process of
                            engendering new knowledge in the various disciplines and inter-disciplinary domains.</p>
                        <p>I hope that this noble endeavour of pushing back the frontiers of existing knowledge will enrich, transform
                            and expand the academic horizons of our University in the years to come.</p>
                    </div>
                </div>

                {/* Message 3: Director */}
                <div className="message-card">
                    <div className="msg-sidebar">
                        <img src={frRoshanImg}
                            alt="Rev Dr Roshan Castelino SJ" />
                        <div className="msg-name">Rev Dr Roshan Castelino SJ</div>
                        <div className="msg-title">Director of Research<br />St Joseph's Research Institute</div>
                    </div>
                    <div className="msg-content">
                        <p>The primary objective of SJRI is to enable and facilitate research at SJU as well as to set benchmarks and
                            standards for the same. The hallmark of a University is the generation of knowledge through research in
                            diverse domains carried out by its faculty and students. Through their engagements, facilitated by SJRI, we
                            wish to create a scholarly community that spans the widest range of academic domains, making a positive
                            difference in the world.</p>
                        <p>To enable this, SJRI, in addition to facilitating doctoral programmes, would provide state-of-the-art
                            infrastructure, industry-academia interface, seed money funding for faculty at the early stages of their
                            careers, faculty training programmes in research-related areas, as well as seminars and symposia on current
                            thrust areas.</p>
                        <p>It is my earnest hope that students and faculty will wholeheartedly participate in the various programmes
                            offered by SJRI and thus make possible a thriving culture of research at SJU.</p>
                    </div>
                </div>
            </section>

            <footer className="research-footer">
                <p>&copy; 2026 St Joseph's University. All Rights Reserved.</p>
            </footer>
        </div>
    );
};

export default Research;
