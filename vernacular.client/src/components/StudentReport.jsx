import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './StudentReport.css';
import micLogo from '../assets/Mic_Logo.png';

export default function StudentReport() {
  const params = useParams();
  const studentId = params.studentId_Report;
  const navigate = useNavigate();
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStudentReport = async () => {
      try {
        setLoading(true);

        // Simulate 3 seconds loading time
        await new Promise(resolve => setTimeout(resolve, 3000));

        // TODO: Replace with actual API call to fetch student report
        // Example: const response = await fetch(`/api/reports/${studentId}`);

        // Mock data structure with realistic data
        const mockData = {
          studentId: studentId,
          name: `Student ${studentId}`,
          section: 'BCA',
          grade: 'B.C.A - Semester II',
          reportDate: new Date().toLocaleDateString(),
          totalRecordings: 4,
          averageScore: 78.5,
          assessmentStatus: 'Completed',
          fluencyScore: 82,
          pronunciationScore: 75,
          grammarScore: 76,
          vocabularyScore: 80,
          overallFeedback: 'Good performance with consistent improvement in oral communication skills. Student demonstrates clear pronunciation with areas for improvement in grammatical accuracy.',
          recordingsList: [
            { id: 1, title: 'Recording 1 - Introduction', date: '2024-01-15', score: 80 },
            { id: 2, title: 'Recording 2 - Story Telling', date: '2024-01-16', score: 82 },
            { id: 3, title: 'Recording 3 - Conversation', date: '2024-01-17', score: 75 },
            { id: 4, title: 'Recording 4 - Presentation', date: '2024-01-18', score: 78 },
            { id: 5, title: 'Recording 5 - Q&A Session', date: '2024-01-19', score: 81 },
            { id: 6, title: 'Recording 6 - Final Assessment', date: '2024-01-22', score: 76 },
            { id: 7, title: 'Recording 7 - Revision', date: '2024-01-23', score: 79 },
            { id: 8, title: 'Recording 8 - Final Test', date: '2024-01-24', score: 77 }
          ]
        };

        setReportData(mockData);
        setLoading(false);
      } catch (err) {
        console.error('Failed to load student report:', err);
        setError('Failed to load student report. Please try again.');
        setLoading(false);
      }
    };

    if (studentId) {
      loadStudentReport();
    }
  }, [studentId]);

  const handleBackClick = () => {
    navigate('/teacherDashboard');
  };

  if (loading) {
    return (
      <div className="student-report">
        <div className="report-loading">
          <p>Loading report...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="student-report">
        <div className="report-error">
          <p>{error}</p>
          <button onClick={handleBackClick} className="back-to-dashboard-btn">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="student-report">
      {/* Header */}
      <header className="report-header">
        <div className="report-header-left">
          <button className="back-btn" onClick={handleBackClick}>
            ←
          </button>
          <div className="header-branding">
            <div className="logo-icon">
              <img src={micLogo} alt="EduRecord" className="logo-img" />
            </div>
            <div className="branding-text">
              <h2>Student Report</h2>
              <p>EduRecord AI</p>
            </div>
          </div>
        </div>
        <div className="report-header-right">
          <span className="role-badge">TEACHER</span>
          <button className="icon-btn">🔔</button>
          <button className="icon-btn">📋</button>
          <img src={micLogo} alt="User" className="user-avatar" />
        </div>
      </header>

      {/* Main Content */}
      <div className="report-container">
        {/* Student Information Card */}
        <div className="report-student-info">
          <div className="student-header-section">
            <h3>📋 Student Information</h3>
            <div className="student-details">
              <div className="detail-item">
                <span className="detail-label">Roll Number / ID:</span>
                <span className="detail-value">{reportData?.studentId}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Name:</span>
                <span className="detail-value">{reportData?.name}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Section:</span>
                <span className="detail-value">{reportData?.section}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Grade:</span>
                <span className="detail-value">{reportData?.grade}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Report Generated:</span>
                <span className="detail-value">{reportData?.reportDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Report Statistics */}
        <div className="report-statistics">
          <div className="stat-card">
            <div className="stat-label">Total Recordings</div>
            <div className="stat-value">{reportData?.totalRecordings || 0}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Average Score</div>
            <div className="stat-value">{reportData?.averageScore || 0}%</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Assessment Status</div>
            <div className={`stat-value status-badge ${reportData?.assessmentStatus === 'Completed' ? 'completed' : 'pending'}`}>
              {reportData?.assessmentStatus}
            </div>
          </div>
        </div>

        {/* Skill Scores */}
        <div className="skill-scores-section">
          <h3>🎯 Skill Performance Scores</h3>
          <div className="skill-scores-grid">
            <div className="skill-card">
              <div className="skill-label">Fluency</div>
              <div className="skill-bar-container">
                <div className="skill-bar" style={{ width: `${reportData?.fluencyScore}%` }}></div>
              </div>
              <div className="skill-percentage">{reportData?.fluencyScore}%</div>
            </div>
            <div className="skill-card">
              <div className="skill-label">Pronunciation</div>
              <div className="skill-bar-container">
                <div className="skill-bar" style={{ width: `${reportData?.pronunciationScore}%` }}></div>
              </div>
              <div className="skill-percentage">{reportData?.pronunciationScore}%</div>
            </div>
            <div className="skill-card">
              <div className="skill-label">Grammar</div>
              <div className="skill-bar-container">
                <div className="skill-bar" style={{ width: `${reportData?.grammarScore}%` }}></div>
              </div>
              <div className="skill-percentage">{reportData?.grammarScore}%</div>
            </div>
            <div className="skill-card">
              <div className="skill-label">Vocabulary</div>
              <div className="skill-bar-container">
                <div className="skill-bar" style={{ width: `${reportData?.vocabularyScore}%` }}></div>
              </div>
              <div className="skill-percentage">{reportData?.vocabularyScore}%</div>
            </div>
          </div>
        </div>

        {/* Overall Feedback */}
        <div className="feedback-section">
          <h3>💬 Overall Feedback</h3>
          <div className="feedback-content">
            <p>{reportData?.overallFeedback}</p>
          </div>
        </div>

        {/* Recordings List */}
        <div className="report-recordings-section">
          <h3>🎙️ Assessment Recordings</h3>
          {reportData?.recordingsList && reportData.recordingsList.length > 0 ? (
            <div className="recordings-list">
              {reportData.recordingsList.map((recording, index) => (
                <div key={index} className="recording-item">
                  <div className="recording-info">
                    <span className="recording-number">#{index + 1}</span>
                    <div className="recording-details">
                      <span className="recording-title">{recording.title}</span>
                      <span className="recording-date">{recording.date}</span>
                    </div>
                  </div>
                  <div className="recording-score">
                    <span className="score-label">Score:</span>
                    <span className="score-value">{recording.score}%</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-recordings">
              <p>No recordings available for this student yet.</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="report-actions">
          <button className="action-btn primary-btn" onClick={handleBackClick}>
            ← Back to Dashboard
          </button>
          <button className="action-btn secondary-btn" title="Download Report">
            ⬇️ Download Report
          </button>
          <button className="action-btn secondary-btn" title="Print Report">
            🖨️ Print Report
          </button>
        </div>
      </div>
    </div>
  );
}