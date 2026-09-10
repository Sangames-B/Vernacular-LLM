import { useState, useRef, useEffect } from 'react';
import { saveAudioRecording, getRecordingById } from './functions/IndexedDB';

export default function AudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState([]);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);

  // On component load, fetch saved recordings from IndexedDB
  useEffect(() => {
    loadAllRecordings();
  }, []);

  // Load all recordings from IndexedDB (iterate through likely IDs)
  const loadAllRecordings = async () => {
    try {
      const allRecordings = [];
      // Attempt to load recordings by ID; in production, consider a getAllRecordings function
      for (let i = 1; i <= 100; i++) {
        const recording = await getRecordingById(i);
        if (recording) {
          allRecordings.push({ id: i, ...recording });
        }
      }
      setRecordings(allRecordings);
    } catch (error) {
      console.error('Failed to load recordings:', error);
    }
  };

  // Start Recording
  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        chunksRef.current.push(event.data);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  // Stop Recording & Save
  const handleStopRecording = async () => {
    try {
      if (!mediaRecorderRef.current || !isRecording) return;

      mediaRecorderRef.current.stop();

      mediaRecorderRef.current.onstop = async () => {
        // Stop all tracks to release hardware
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
        }

        // Combine chunks into a single Blob
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });

        // Save to IndexedDB
        try {
          const recordingId = await saveAudioRecording(audioBlob, {
            createdAt: new Date().toISOString(),
          });
          console.log('Recording saved with ID:', recordingId);

          // Refresh the recordings list
          await loadAllRecordings();
        } catch (error) {
          console.error('Failed to save recording:', error);
        }

        setIsRecording(false);
      };
    } catch (error) {
      console.error('Failed to stop recording:', error);
      setIsRecording(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Audio Recorder</h1>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={handleStartRecording}
          disabled={isRecording}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            backgroundColor: isRecording ? '#ccc' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isRecording ? 'not-allowed' : 'pointer',
          }}
        >
          Start Recording
        </button>

        <button
          onClick={handleStopRecording}
          disabled={!isRecording}
          style={{
            padding: '10px 20px',
            backgroundColor: isRecording ? '#f44336' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isRecording ? 'pointer' : 'not-allowed',
          }}
        >
          Stop Recording
        </button>

        {isRecording && (
          <span
            style={{
              marginLeft: '20px',
              fontSize: '16px',
              color: '#f44336',
              fontWeight: 'bold',
            }}
          >
            🔴 Recording...
          </span>
        )}
      </div>

      <h2>Saved Recordings</h2>
      {recordings.length === 0 ? (
        <p>No recordings yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {recordings.map((recording) => (
            <li
              key={recording.id}
              style={{
                marginBottom: '15px',
                padding: '10px',
                backgroundColor: '#f5f5f5',
                borderRadius: '4px',
              }}
            >
              <div style={{ marginBottom: '8px' }}>
                <strong>Recording {recording.id}</strong>
                {recording.createdAt && (
                  <span style={{ marginLeft: '10px', fontSize: '0.9em', color: '#666' }}>
                    {new Date(recording.createdAt).toLocaleString()}
                  </span>
                )}
              </div>
              {recording.audio && (
                <audio
                  controls
                  src={URL.createObjectURL(recording.audio)}
                  style={{ width: '100%' }}
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}