import { useNavigate } from 'react-router-dom';
import './StudentDashboard.css';
import micLogo from '../assets/Mic_Logo.png';

export default function StudentDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  const handleBackClick = () => {
    navigate('/');
  };

  return (
    <div className="student-dashboard">
      {/* Header */}
      <header className="sd-header">
        <div className="sd-header-left">
          <button className="sd-back-btn" onClick={handleBackClick}>←</button>
          <div className="sd-header-branding">
            <div className="sd-logo-icon">
              <img src={micLogo} alt="EduRecord" className="sd-logo-img" />
            </div>
            <div className="sd-branding-text">
              <h2>Student Portal</h2>
              <p>EduRecord AI</p>
            </div>
          </div>
        </div>
        <div className="sd-header-right">
          <span className="sd-role-badge">STUDENT</span>
          <button className="sd-logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="sd-container">
        <div className="sd-content">
          {/* Placeholder Section */}
          <div className="sd-placeholder-section">
            <div className="sd-empty-icon">📋</div>
            <h1 className="sd-placeholder-title">No Reports Available</h1>
            <p className="sd-placeholder-text">
              Right now there are no reports to show
            </p>
            <p className="sd-placeholder-subtitle">
              Your evaluation reports and audio assessments will appear here once they are available.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
