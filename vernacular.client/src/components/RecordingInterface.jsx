import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveAudioRecording, getRecordingsByStudentId, getAllRecordings, deleteRecording, updateRecording } from '../functions/IndexedDB';
import './RecordingInterface.css';
import micLogo from '../assets/Mic_Logo.png';

export default function RecordingInterface() {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState('00:00:00');
  const [sortBy, setSortBy] = useState('recent');
  const [filterText, setFilterText] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentPeriod, setCurrentPeriod] = useState('');
  const [recordings, setRecordings] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Refs for recording
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);
  const recordingTimerRef = useRef(null);
  const recordingSecondsRef = useRef(0);

  // Refs for real-time sound wave visualizer
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Update current time and determine period
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);

      // Calculate current period based on time
      const hour = now.getHours();
      if (hour >= 10 && hour < 11) {
        setCurrentPeriod('Period 1 (10:00 AM)');
      } else if (hour >= 11 && hour < 12) {
        setCurrentPeriod('Period 2 (11:00 AM)');
      } else if (hour >= 12 && hour < 13) {
        setCurrentPeriod('Period 3 (12:00 PM)');
      } else if (hour >= 13 && hour < 14) {
        setCurrentPeriod('Period 4 (1:00 PM)');
      } else if (hour >= 14 && hour < 15) {
        setCurrentPeriod('Period 5 (2:00 PM)');
      } else if (hour >= 15 && hour < 16) {
        setCurrentPeriod('Period 6 (3:00 PM)');
      } else {
        setCurrentPeriod('Period 7 (4:00 PM)');
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Extract section and grade from roll number
  const getGradeFromRollNumber = (roll) => {
    // Example: 25BCAP11 -> extract grade from the roll number
    // Assuming format: YY[CLASS][CODE][NUMBER]
    if (roll.length >= 3) {
      const gradeMatch = roll.match(/\D(\d+)\D/);
      return gradeMatch ? `Grade ${gradeMatch[1]}-B` : 'Grade ***';
    }
    return 'Grade ***';
  };

  const getSectionFromRollNumber = (roll) => {
    // Example: 25BCAP11 -> SEC: would be based on middle letters
    if (roll.length >= 2) {
      return `SEC: ${roll.substring(2, 4).toUpperCase()}`;
    }
    return 'SEC: ***';
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  const formatRecordingTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Load recordings from IndexedDB
  const loadRecordings = async () => {
    try {
      let data = [];
      if (rollNumber && rollNumber.trim() !== '') {
        data = await getRecordingsByStudentId(rollNumber.trim());
      } else {
        data = await getAllRecordings();
      }
      setRecordings(data || []);
    } catch (error) {
      console.error('Failed to load recordings from IndexedDB:', error);
      setRecordings([]);
    }
  };

  // Load recordings whenever rollNumber changes, or on initial load
  useEffect(() => {
    loadRecordings();
  }, [rollNumber]);

  // Clean up Web Audio and media stream on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  // Live voice recorder wave animation loop on canvas
  useEffect(() => {
    let animId;

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      ctx.clearRect(0, 0, width, height);

      // Subtle horizontal guidelines
      ctx.strokeStyle = '#f1f5f9';
      ctx.lineWidth = 1;
      for (let y = 15; y < height; y += 25) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Center reference zero-line
      ctx.strokeStyle = isRecording ? 'rgba(59, 130, 246, 0.3)' : 'rgba(203, 213, 225, 0.6)';
      ctx.lineWidth = 1;
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.stroke();
      ctx.setLineDash([]);

      if (isRecording && analyserRef.current) {
        const bufferLength = analyserRef.current.fftSize;
        const dataArray = new Uint8Array(bufferLength);
        analyserRef.current.getByteTimeDomainData(dataArray);

        // Draw primary voice sound wave
        ctx.beginPath();
        const sliceWidth = width / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const v = (dataArray[i] - 128) / 128.0;
          // Amplify response for natural speech sensitivity
          const y = centerY + v * (height * 0.75);

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
          x += sliceWidth;
        }

        // Gradient wave line
        const gradient = ctx.createLinearGradient(0, 0, width, 0);
        gradient.addColorStop(0, '#2563eb');
        gradient.addColorStop(0.5, '#4f46e5');
        gradient.addColorStop(1, '#06b6d4');

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.shadowColor = 'rgba(37, 99, 235, 0.45)';
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Secondary softer harmonic wave for depth
        ctx.beginPath();
        x = 0;
        for (let i = 0; i < bufferLength; i++) {
          const v = (dataArray[i] - 128) / 128.0;
          const y = centerY - v * 0.55 * (height * 0.55);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
          x += sliceWidth;
        }
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.35)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

      } else {
        // Idle state: gentle calm resting sine wave
        const t = Date.now() * 0.003;
        ctx.beginPath();
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1.8;
        for (let curX = 0; curX < width; curX += 4) {
          const waveHeight = 3.5;
          const curY = centerY + Math.sin(curX * 0.025 + t) * waveHeight;
          if (curX === 0) ctx.moveTo(curX, curY);
          else ctx.lineTo(curX, curY);
        }
        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animId) {
        cancelAnimationFrame(animId);
      }
    };
  }, [isRecording]);

  // Start Recording
  const handleStartRecord = async () => {
    if (!rollNumber || rollNumber.trim() === '') {
      alert('Please enter a student roll number first');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        }
      });

      streamRef.current = stream;
      chunksRef.current = [];
      recordingSecondsRef.current = 0;

      // Set up Web Audio API Analyser for real-time sound waves
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          const audioCtx = new AudioCtx();
          if (audioCtx.state === 'suspended') {
            await audioCtx.resume();
          }
          const source = audioCtx.createMediaStreamSource(stream);
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 512;
          analyser.smoothingTimeConstant = 0.8;
          source.connect(analyser);

          audioContextRef.current = audioCtx;
          analyserRef.current = analyser;
        }
      } catch (err) {
        console.warn('AudioContext visualization setup note:', err);
      }

      // Create MediaRecorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event.error);
        alert('Recording error: ' + event.error);
      };

      mediaRecorder.start(250);
      setIsRecording(true);

      // Start recording timer
      recordingTimerRef.current = setInterval(() => {
        recordingSecondsRef.current += 1;
        setRecordingTime(formatRecordingTime(recordingSecondsRef.current));
      }, 1000);

    } catch (error) {
      console.error('Failed to start recording:', error);
      let errorMessage = 'Could not access microphone. ';
      if (error.name === 'NotAllowedError') {
        errorMessage += 'Please allow microphone access when prompted by your browser.';
      } else if (error.name === 'NotFoundError') {
        errorMessage += 'No microphone found on your device.';
      } else if (error.name === 'NotReadableError') {
        errorMessage += 'Microphone is already in use by another application.';
      } else if (error.name === 'SecurityError') {
        errorMessage += 'Microphone access requires HTTPS connection.';
      }
      alert(errorMessage);
    }
  };

  // Stop Recording & Save to IndexedDB
  const handleStopRecord = async () => {
    if (!mediaRecorderRef.current || !isRecording) {
      return;
    }

    try {
      setIsSaving(true);
      const mediaRecorder = mediaRecorderRef.current;

      mediaRecorder.onstop = async () => {
        try {
          // Release hardware audio tracks
          if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
          }

          // Close AudioContext
          if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
            audioContextRef.current.close().catch(() => {});
            audioContextRef.current = null;
            analyserRef.current = null;
          }

          // Combine chunks into a single Blob
          const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });

          // Save to IndexedDB
          await saveAudioRecording(audioBlob, rollNumber, {
            timestamp: new Date().toISOString(),
            period: currentPeriod,
            duration: recordingTime,
          });

          // Reset recording state
          setIsRecording(false);
          setRecordingTime('00:00:00');
          recordingSecondsRef.current = 0;

          // Reload recordings from IndexedDB
          await loadRecordings();

          alert('Recording saved to IndexedDB successfully!');
        } catch (error) {
          console.error('Failed to save recording:', error);
          alert('Failed to save recording. Please try again.');
        } finally {
          setIsSaving(false);
        }
      };

      mediaRecorder.stop();

      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
    } catch (error) {
      console.error('Failed to stop recording:', error);
      setIsRecording(false);
      setIsSaving(false);
    }
  };

  // Delete recording from IndexedDB
  const handleDeleteRecording = async (id) => {
    if (!window.confirm('Delete this recording from IndexedDB?')) {
      return;
    }
    try {
      await deleteRecording(id);
      await loadRecordings();
    } catch (err) {
      console.error('Failed to delete recording:', err);
      alert('Failed to delete recording');
    }
  };

  // Helper to upload a single recording to C# backend -> SQL Server
  const uploadRecordingToServer = async (recording) => {
    const formData = new FormData();
    const fileExtension = recording.fileType?.includes('webm') ? 'webm' : 'wav';
    const fileName = `${recording.studentId || 'student'}_${recording.id}.${fileExtension}`;

    formData.append('audioFile', recording.audio, fileName);
    formData.append('rollNumber', recording.studentId || 'UNKNOWN');

    const durSec = parseDuration(recording.metadata?.duration);
    formData.append('durationSeconds', durSec > 0 ? durSec : 1);

    const response = await fetch('/api/AudioRecordings/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Server responded with status ${response.status}`);
    }

    const data = await response.json();
    recording.isSynced = true;
    recording.serverRecordingId = data.recordingId;
    recording.serverAudioPath = data.audioFilePath;
    recording.syncedAt = data.savedAt || new Date().toISOString();

    await updateRecording(recording);
    return data;
  };

  // Sync recordings handler: transfers IndexedDB records to C# backend -> SQL Server
  const handleSyncRecordings = async () => {
    if (isSyncing) return;

    if (!navigator.onLine) {
      alert('You are currently offline. Recordings are safely stored in IndexedDB and will sync once connected to the network.');
      return;
    }

    try {
      setIsSyncing(true);

      // Get all recordings from IndexedDB
      const allLocal = await getAllRecordings();

      if (!allLocal || allLocal.length === 0) {
        alert('No recordings found in IndexedDB to sync.');
        setIsSyncing(false);
        return;
      }

      // Filter to find recordings that haven't been synced yet
      const unsyncedRecordings = allLocal.filter((rec) => !rec.isSynced);

      if (unsyncedRecordings.length === 0) {
        alert(`All ${allLocal.length} recording(s) are already synced to the SQL Server database!`);
        setIsSyncing(false);
        return;
      }

      let successCount = 0;
      let failCount = 0;

      for (let i = 0; i < unsyncedRecordings.length; i++) {
        const recording = unsyncedRecordings[i];
        try {
          await uploadRecordingToServer(recording);
          successCount++;
        } catch (err) {
          console.error(`Error syncing recording ID ${recording.id}:`, err);
          failCount++;
        }
      }

      // Reload recordings to reflect updated sync statuses
      await loadRecordings();

      if (failCount === 0) {
        alert(`✅ Successfully synced ${successCount} recording(s) to the database!`);
      } else {
        alert(`Synced ${successCount} recording(s) to database. (${failCount} failed to sync). Check console for details.`);
      }
    } catch (err) {
      console.error('Sync process error:', err);
      alert('Sync failed due to an unexpected error. Please try again.');
    } finally {
      setIsSyncing(false);
    }
  };

  // Single recording sync handler
  const handleSyncSingle = async (recording) => {
    if (isSyncing) return;
    if (!navigator.onLine) {
      alert('You are currently offline. Recording will sync once connected to the network.');
      return;
    }

    try {
      setIsSyncing(true);
      await uploadRecordingToServer(recording);
      await loadRecordings();
      alert(`✅ Recording #${recording.id} (${recording.studentId}) synced successfully to the database!`);
    } catch (err) {
      console.error('Single sync failed:', err);
      alert('Failed to sync recording to the database. Please try again.');
    } finally {
      setIsSyncing(false);
    }
  };

  // Filter recordings
  const filteredRecordings = recordings.filter((recording) => {
    if (!filterText || !filterText.trim()) return true;
    const term = filterText.trim().toLowerCase();
    const student = (recording.studentId || '').toLowerCase();
    const period = (recording.metadata?.period || '').toLowerCase();
    const dateStr = recording.createdAt ? new Date(recording.createdAt).toLocaleString().toLowerCase() : '';
    return student.includes(term) || period.includes(term) || dateStr.includes(term);
  });

  // Sort recordings
  const sortedRecordings = [...filteredRecordings].sort((a, b) => {
    const timeA = new Date(a.createdAt || 0).getTime();
    const timeB = new Date(b.createdAt || 0).getTime();
    return sortBy === 'recent' ? timeB - timeA : timeA - timeB;
  });

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
            {/* Student Info */}
            <div className="student-info-card">
              <div className="student-id-header">
                <div>
                  <label>📌 STUDENT ROLL NUMBER / ID</label>
                  <span className="section-code">{getSectionFromRollNumber(rollNumber)}</span>
                </div>
              </div>
              <div className="student-id-input-wrapper">
                <input
                  type="text"
                  className="student-id-input"
                  placeholder="Enter Roll Number (e.g., 25BCAP11)"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value.toUpperCase())}
                />
              </div>
              {/* View Student Report Button */}
              <div className="view-report-button-wrapper">
                <button
                  type="button"
                  className="view-report-btn"
                  onClick={() => {
                    if (!rollNumber || rollNumber.trim() === '') {
                      alert('Please enter a student roll number first');
                      return;
                    }
                    navigate(`/${rollNumber.trim()}_Report`);
                  }}
                  title="View student report"
                >
                  📊 View Student Report
                </button>
              </div>
              <div className="student-details-row">
                <span className="verified-badge">✓ Verified: {rollNumber || 'Student Name'}</span>
                <span className="grade-info">{getGradeFromRollNumber(rollNumber)}</span>
              </div>
              <div className="student-tags">
                <span className="tag">🎓 Oral English Fluency</span>
                <span className="tag">📅 Term: Q2 Benchmark</span>
              </div>
              <div className="student-period">
                <span>🕐 {currentPeriod}</span>
              </div>
              <div className="student-timestamp">
                <span>⏰ Current Time: {formatTime(currentTime)}</span>
              </div>
            </div>

            {/* Voice Recorder Waveform Section */}
            <div className="waveform-section">
              <div className="waveform-header">
                <div className="recorder-status">
                  {isRecording ? (
                    <span className="status-live-indicator">
                      <span className="live-dot"></span> LIVE RECORDING
                    </span>
                  ) : (
                    <span className="status-standby-indicator">● Ready to Record</span>
                  )}
                </div>
                <span className="timer">⏱ {recordingTime}</span>
              </div>
              <div className="waveform-container">
                <canvas
                  ref={canvasRef}
                  className="voice-recorder-canvas"
                  width={640}
                  height={110}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons-group">
              <div className="primary-actions">
                <button
                  type="button"
                  className={`start-record-btn ${isRecording ? 'recording' : ''}`}
                  onClick={handleStartRecord}
                  disabled={isRecording}
                >
                  ● Start Record
                </button>
                <button
                  type="button"
                  className={`stop-save-btn ${isSaving ? 'saving' : ''}`}
                  onClick={handleStopRecord}
                  disabled={!isRecording || isSaving}
                >
                  {isSaving ? '⏳ Saving...' : '⊙ Stop & Save'}
                </button>
              </div>          
            </div>

            {/* Assessment Info */}
            <div className="assessment-card">
              <div className="assessment-header">
                <h4>📋 ASSESSMENT TOPIC / RUBRIC NOTE</h4>
                <span className="ai-scoring-badge">AI SCORING ACTIVATED</span>
              </div>
              <p className="assessment-text">
                              This section is for the audio assessment content that is to be filled by the teacher as 
                per the syllabus.
              </p>
            </div>
          </div>

          {/* Right Section - Saved Recordings */}
          <div className="ri-right-section">
            <div className="saved-recordings-section">
              <div className="recordings-header">
                <h3>Recordings</h3>
                <div className="recordings-meta">
                  <span className="meta-badge">
                    {filteredRecordings.length} {filteredRecordings.length === 1 ? 'Audio Log' : 'Audio Logs'}
                  </span>
                  <button
                    className="sync-btn"
                    onClick={() => window.location.reload()}
                    title="Refresh entire page"
                  >
                    ↻ Refresh
                  </button>
                  <button
                    className="sync-recordings-btn"
                    onClick={handleSyncRecordings}
                    disabled={isSyncing}
                    title="Sync recordings"
                  >
                    {isSyncing ? '⏳ Syncing...' : '☁️ Sync'}
                  </button>
                </div>
              </div>

              <div className="recordings-filters">
                <div className="search-box">
                  <span>🔍</span>
                  <input
                    type="text"
                    placeholder="Search by student, period or date..."
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                  />
                  {filterText && (
                    <button className="clear-search-btn" onClick={() => setFilterText('')}>✕</button>
                  )}
                </div>
                <button
                  className="sort-btn"
                  onClick={() => setSortBy(sortBy === 'recent' ? 'oldest' : 'recent')}
                >
                  ≡ {sortBy === 'recent' ? 'Recent First' : 'Oldest First'}
                </button>
              </div>

              <div className="recordings-list">
                {sortedRecordings.length > 0 ? (
                  sortedRecordings.map((recording, index) => (
                    <SavedAudioPlayer
                      key={recording.id || index}
                      index={index}
                      recording={recording}
                      onDelete={handleDeleteRecording}
                      onSyncSingle={handleSyncSingle}
                    />
                  ))
                ) : (
                  <div className="no-recordings">
                    <div className="no-rec-icon">🎙️</div>
                    <p>No recordings found in IndexedDB.</p>
                    <span className="no-rec-sub">
                      {rollNumber
                        ? `No recordings found for ${rollNumber}. Enter roll number and hit Start Record.`
                        : 'Audio recordings will appear here once saved in IndexedDB.'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper to parse duration string "HH:MM:SS" or "MM:SS" into seconds
function parseDuration(str) {
  if (!str) return 0;
  const parts = str.split(':').map(Number);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return 0;
}

// Subcomponent for each saved recording voice player
function SavedAudioPlayer({ recording, index, onDelete, onSyncSingle }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    if (recording.audio instanceof Blob) {
      const url = URL.createObjectURL(recording.audio);
      setAudioUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [recording.audio]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.error('Playback failed:', err);
      });
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current && !isNaN(audioRef.current.duration) && audioRef.current.duration !== Infinity) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleSeek = (e) => {
    if (!audioRef.current) return;
    const totalDuration = duration || (recording.metadata?.duration ? parseDuration(recording.metadata.duration) : 0);
    if (!totalDuration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const fraction = Math.max(0, Math.min(1, clickX / rect.width));
    const newTime = fraction * totalDuration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatSec = (sec) => {
    if (!sec || isNaN(sec)) return '00:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const displayDuration = recording.metadata?.duration || formatSec(duration);

  return (
    <div className="recording-item">
      <div className="recording-header-row">
        <div className="recording-title-section">
          <span className="recording-icon">🎙️</span>
          <div className="recording-title-info">
            <h4>Audio Log #{recording.id || index + 1}</h4>
            <p>{recording.createdAt ? new Date(recording.createdAt).toLocaleString() : 'Just now'}</p>
          </div>
        </div>
        <div className="recording-header-actions">
          <span className="recording-duration">{displayDuration}</span>
          {!recording.isSynced && onSyncSingle && (
            <button
              className="single-sync-btn"
              onClick={() => onSyncSingle(recording)}
              title="Sync this recording to SQL Server database"
            >
              ☁️ Sync
            </button>
          )}
          <button
            className="delete-rec-btn"
            onClick={() => onDelete(recording.id)}
            title="Delete from IndexedDB"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Voice Recorder Audio Player */}
      <div className="recording-player">
        <button
          type="button"
          className={`play-btn ${isPlaying ? 'playing' : ''}`}
          onClick={togglePlay}
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
        <div className="progress-bar" onClick={handleSeek} title="Click to seek">
          <div
            className="progress-fill"
            style={{
              width: `${
                duration > 0
                  ? (currentTime / duration) * 100
                  : currentTime > 0
                  ? 50
                  : 0
              }%`,
            }}
          ></div>
          <span className="progress-time">
            {formatSec(currentTime)} / {displayDuration}
          </span>
        </div>
        {isPlaying && (
          <div className="voice-playing-waves" title="Playing">
            <span className="vp-bar vp1"></span>
            <span className="vp-bar vp2"></span>
            <span className="vp-bar vp3"></span>
            <span className="vp-bar vp4"></span>
          </div>
        )}
      </div>

      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
          preload="metadata"
          style={{ display: 'none' }}
        />
      )}

      <div className="recording-badges">
        <span className="badge-synthesized">ID: #{recording.id}</span>
        {recording.studentId && (
          <span className="badge-grade">Roll: {recording.studentId}</span>
        )}
        {recording.metadata?.period && (
          <span className="badge-period">{recording.metadata.period}</span>
        )}
        {recording.isSynced ? (
          <span className="badge-synced" title={`Synced to Database (Server ID: ${recording.serverRecordingId || 'Saved'})`}>
            ✓ Synced {recording.serverRecordingId ? `(DB #${recording.serverRecordingId})` : ''}
          </span>
        ) : (
          <span className="badge-local" title="Stored locally in browser IndexedDB, not yet uploaded to SQL Server">
            ● Local Only
          </span>
        )}
      </div>

      <div className="recording-footer">
        {recording.isSynced ? (
          <span className="db-badge db-badge-synced">✅ Synced to SQL Server</span>
        ) : (
          <span className="db-badge">💾 Stored in IndexedDB</span>
        )}
        {audioUrl && (
          <a
            href={audioUrl}
            download={`Audio_Recording_${recording.studentId || 'student'}_${recording.id || Date.now()}.wav`}
            className="link-transcript"
          >
            ⬇ Download WAV
          </a>
        )}
      </div>
    </div>
  );
}
