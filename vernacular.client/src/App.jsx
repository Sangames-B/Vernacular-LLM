import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import RecordingInterface from './components/RecordingInterface';
import StudentDashboard from './components/StudentDashboard';
import AudioRecorder from './AudioRecorder';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/teacherDashboard" element={<RecordingInterface />} />
        <Route path="/studentDashboard" element={<StudentDashboard />} />
        <Route path="/audioRecorder" element={<AudioRecorder />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;