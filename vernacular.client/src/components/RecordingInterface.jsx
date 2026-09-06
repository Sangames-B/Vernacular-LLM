import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RecordingInterface.css';
import micLogo from '../assets/Mic_Logo.png';

export default function RecordingInterface() {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState('00:00:00');
  const [sortBy, setSortBy] = useState('recent');
  const [filterText, setFilterText] = useState('');

  const mockRecordings = [
    {
      id: 3,
      title: 'Shakespeare',
      date: 'May 10, 2026 at 10:30 AM',
      duration: '02:45',
      status: 'ai-synthesized',
      playProgress: 65,
      evaluator: 'Dr. Aris Thorne',
      hasTranscript: true,
      hasRubric: true,
    },
    {
      id: 2,
      title: 'Pronunciation',
      date: 'May 08, 2026 at 02:15 PM',
      duration: '01:18',
      status: 'graded',
      grade: '92/100',
      testType: 'Phoneme clarity & stress test',
      playProgress: 40,
      evaluator: 'Dr. Aris Thorne',
      hasTranscript: true,
      hasRubric: true,
    },
    {
      id: 1,
      title: 'Initial Speech',
      date: 'Apr 29, 2026 at 11:05 AM',
      duration: '03:10',
      status: 'archived',
      testType: 'Baseline lexical pitch diagnostics',
      playProgress: 0,
    },
  ];

  const handleStartRecord = () => {
    setIsRecording(true);
    // Start timer logic here
  };

  const handleStopRecord = () => {
    setIsRecording(false);
  };

  const handleBackClick = () => {
    navigate('/');
  };

  return (
    <div className="recording-interface">
      {/* Header */}
      <header className="ri-header">
        <div className="ri-header-left">
          <button className="back-btn" onClick={handleBackClick}>←</button>
          <div className="header-branding">
            <div className="logo-icon">
              <img src={micLogo} alt="EduRecord" className="logo-img" />
            </div>
            <div className="branding-text">
              <h2>Record / Audio</h2>
              <p>EduRecord AI</p>
            </div>
          </div>
        </div>
        <div className="ri-header-right">
          <span className="role-badge">TEACHER</span>
          <button className="icon-btn">🔔</button>
          <button className="icon-btn">📋</button>
          <img src={micLogo} alt="User" className="user-avatar" />
        </div>
      </header>

      <div className="ri-container">
        {/* Main Content Wrapper */}
        <div className="ri-main">
          {/* Left Section */}
          <div className="ri-left-section">
            {/* Oral Eval Card */}
            <div className="oral-eval-card">
              <div className="mic-icon">🎤</div>
              <div className="eval-content">
                <div className="eval-header">
                  <h3>Oral Eval</h3>
                  <span className="live-sync-badge">LIVE SYNC</span>
                </div>
                <span className="active-badge">✓ Active: Teacher</span>
                <p className="eval-subtitle">Classroom Audio Benchmarking v2.4</p>
              </div>
            </div>

            {/* Student Info */}
            <div className="student-info-card">
              <div className="student-id-header">
                <div>
                  <label>📌 STUDENT ROLL NUMBER / ID</label>
                  <span className="section-code">SEC: 10-B</span>
                </div>
              </div>
              <div className="student-id-large">25BCAP11</div>
              <div className="student-details-row">
                <span className="verified-badge">✓ Verified: Maya Lin</span>
                <span className="grade-info">Grade 10-B</span>
              </div>
              <div className="student-tags">
                <span className="tag">🎓 Oral English Fluency</span>
                <span className="tag">📅 Term: Q2 Benchmark</span>
              </div>
              <div className="student-period">
                <span>🕐 Period 3 (10:15 AM)</span>
              </div>
            </div>

            {/* Status Section */}
            <div className="status-section">
              <button className="status-ready">● Status: Ready to Record</button>
              <button className="audio-format">⬇ Built-in (48kHz)</button>
            </div>

            {/* Waveform Section */}
            <div className="waveform-section">
              <div className="waveform-header">
                <div className="peak-info">
                  <span>🎤 Mic Peak: -12 dB</span>
                </div>
                <span className="timer">⏱ {recordingTime}</span>
              </div>
              <div className="waveform-container">
                <div className="waveform">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((i) => (
                    <div
                      key={i}
                      className="waveform-bar"
                      style={{
                        height: `${Math.random() * 80 + 20}%`,
                        backgroundColor:
                          i === 6 || i === 12 ? '#ef4444' : i === 8 ? '#8b5cf6' : '#3b82f6',
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className="waveform-legend">
                <span><span className="legend-dot" style={{ backgroundColor: '#3b82f6' }}></span>Primary Signal</span>
                <span><span className="legend-dot" style={{ backgroundColor: '#ef4444' }}></span>Frequency Saturation Peaks</span>
                <span><span className="legend-dot" style={{ backgroundColor: '#8b5cf6' }}></span>Low Latency AI Engine</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons-group">
              <div className="primary-actions">
                <button
                  className={`start-record-btn ${isRecording ? 'recording' : ''}`}
                  onClick={handleStartRecord}
                  disabled={isRecording}
                >
                  ● Start Record
                </button>
                <button
                  className="stop-save-btn"
                  onClick={handleStopRecord}
                  disabled={!isRecording}
                >
                  ⊙ Stop & Save
                </button>
              </div>
              <div className="secondary-actions">
                <button className="pause-btn">⏸ Pause Stream</button>
                <button className="reset-btn">↻ Reset Session</button>
              </div>
            </div>

            {/* Assessment Info */}
            <div className="assessment-card">
              <div className="assessment-header">
                <h4>📋 ASSESSMENT TOPIC / RUBRIC NOTE</h4>
                <span className="ai-scoring-badge">AI SCORING ACTIVATED</span>
              </div>
              <p className="assessment-text">
                Reading comprehension & pronunciation assessment for chapter 4 dialogue.
              </p>
            </div>
          </div>

          {/* Right Section - Saved Recordings */}
          <div className="ri-right-section">
            <div className="saved-recordings-section">
              <div className="recordings-header">
                <h3>Saved Recordings</h3>
                <div className="recordings-meta">
                  <span className="meta-badge">3 Audio Logs</span>
                  <button className="sync-btn">👥 Sync All</button>
                </div>
              </div>

              <div className="recordings-filters">
                <div className="search-box">
                  <span>🔍</span>
                  <input
                    type="text"
                    placeholder="Filter by topic or date..."
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                  />
                </div>
                <button className="sort-btn">
                  ≡ Recent First
                </button>
              </div>

              <div className="recordings-list">
                {mockRecordings.map((recording) => (
                  <div key={recording.id} className="recording-item">
                    <div className="recording-header-row">
                      <div className="recording-title-section">
                        <span className="recording-icon">♪</span>
                        <div className="recording-title-info">
                          <h4>Recording #{recording.id} - {recording.title}</h4>
                          <p>{recording.date}</p>
                        </div>
                      </div>
                      <span className="recording-duration">{recording.duration}</span>
                    </div>

                    <div className="recording-player">
                      <button className="play-btn">▶</button>
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: `${recording.playProgress}%` }}
                        ></div>
                        <span className="progress-time">{recording.playProgress > 0 ? `01:10` : '00:00'}</span>
                      </div>
                      <span className="total-duration">{recording.duration}</span>
                    </div>

                    <div className="recording-badges">
                      {recording.status === 'ai-synthesized' && (
                        <span className="badge-synthesized">AI SYNTHESIZED</span>
                      )}
                      {recording.status === 'graded' && (
                        <span className="badge-grade">Band {recording.grade ? '8.5' : '8'}</span>
                      )}
                      {recording.grade && (
                        <span className="badge-score">Grade: {recording.grade}</span>
                      )}
                      {recording.status === 'archived' && (
                        <span className="badge-archived">Archived</span>
                      )}
                    </div>

                    {recording.testType && (
                      <p className="recording-test-type">{recording.testType}</p>
                    )}

                    <div className="recording-footer">
                      {recording.evaluator && (
                        <span>Evaluator: {recording.evaluator}</span>
                      )}
                      {recording.hasTranscript && (
                        <a href="#" className="link-transcript">View Transcript</a>
                      )}
                      {recording.hasRubric && (
                        <a href="#" className="link-rubric">Rubric Details</a>
                      )}
                      {recording.status === 'archived' && (
                        <span className="archived-tag">Archived</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
