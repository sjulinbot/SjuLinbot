import React, { useState } from 'react';
import Header from './components/Header';
import AttendanceReport from './components/AttendanceReport';
import Chatbot from './components/Chatbot';

import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Admissions from './pages/Admissions';
import Research from './pages/Research';
import Library from './pages/Library';
import DashboardNew from './pages/DashboardNew';
import StaffDashboard from './pages/StaffDashboard';
import GeneralQueries from './pages/GeneralQueries';
import ApplicantAuth from './pages/ApplicantAuth';
import ApplicantDashboard from './pages/ApplicantDashboard';
import Footer from './components/Footer';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [studentId, setStudentId] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState(null);
  const [isChatbotNav, setIsChatbotNav] = useState(false);

  const handleNavigate = (page, fromChat = false) => {
    setCurrentPage(page);
    setIsChatbotNav(fromChat);
  };

  const handleLoginSuccess = (idOrName, role = 'student', redirect = true, viaChatbot = false) => {
    if (role === 'applicant') {
      setUserName(idOrName);
    } else {
      setStudentId(idOrName);
    }
    setUserRole(role);
    if (redirect) {
      setCurrentPage(role === 'staff' ? 'staffDashboard' : (role === 'applicant' ? 'applicantDashboard' : 'dashboard')); // Redirect after login
      setIsChatbotNav(role === 'student' ? viaChatbot : false);
    }
  };

  const handleLogout = () => {
    setStudentId(null);
    setUserRole(null);
    setUserName(null);
    setCurrentPage('home');
    setIsChatbotNav(false);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={handleNavigate} />;
      case 'login':
        return <Login onLoginSuccess={handleLoginSuccess} />;
      case 'staffDashboard':
        return <StaffDashboard onLogout={handleLogout} />;
      case 'dashboard':
      case 'attendance':
      case 'fees':
      case 'result':
      case 'leave':
        // Check if the student is the specific user
        if (studentId === '233bcac30') {
          return <DashboardNew type={currentPage} studentId={studentId} onNavigate={handleNavigate} onLogout={handleLogout} shouldCollapse={isChatbotNav} />;
        }
        return <Dashboard type={currentPage} studentId={studentId} onNavigate={handleNavigate} onLogout={handleLogout} shouldCollapse={isChatbotNav} />;
      case 'admissions':
        return <Admissions onNavigate={handleNavigate} initialView="instructions" />;
      case 'programmes':
        return <Admissions onNavigate={handleNavigate} initialView="programmes" />;
      case 'research':
        return <Research onNavigate={handleNavigate} />;
      case 'library':
        return <Library onNavigate={handleNavigate} />;
      case 'generalQueries':
        return <GeneralQueries onNavigate={handleNavigate} />;
      case 'applicantAuth':
        return <ApplicantAuth onNavigate={handleNavigate} onLoginSuccess={handleLoginSuccess} />;
      case 'applicantDashboard':
        return <ApplicantDashboard onLogout={handleLogout} userName={userName} />;
      default:
        return <Home />;
    }
  };

  const isDashboard = ['dashboard', 'attendance', 'fees', 'result', 'staffDashboard'].includes(currentPage);
  const chatPageContext = isDashboard ? "STUDENT_DASHBOARD" : "MAIN_PAGE";
  const isLoggedIn = !!studentId;

  if (currentPage === 'staffDashboard') {
    return <StaffDashboard onLogout={handleLogout} onNavigate={handleNavigate} />;
  }

  const isApplicantPage = ['applicantAuth', 'applicantDashboard'].includes(currentPage);
  if (isApplicantPage) {
    return <main id="applicant-flow">{renderPage()}</main>;
  }

  return (
    <div className="App">
      {!isDashboard && <Header onNavigate={handleNavigate} />}

      <main id="main-content">
        {renderPage()}
      </main>
      {!isDashboard && <Footer />}

      {!['generalQueries', 'admissions', 'login', 'research', 'library', 'programmes'].includes(currentPage) && (!isDashboard || isChatbotNav) && (
        <Chatbot
          onNavigate={handleNavigate}
          onLoginSuccess={handleLoginSuccess}
          pageContext={chatPageContext}
          isLoggedIn={isLoggedIn}
          userRole={isLoggedIn ? userRole : null}
          onLogout={handleLogout}
          isChatbotNav={isChatbotNav}
        />
      )}
    </div>
  );
}

export default App;
