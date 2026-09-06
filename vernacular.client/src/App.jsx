import React from 'react';
import AudioRecorder from './AudioRecorder';
import './App.css';

function App() {
    return (
        <div className="container" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <h1>Audio Recorder Project</h1>
                <p>Record audio locally and store it directly in IndexedDB.</p>
            </header>

            <main>
                <AudioRecorder />
            </main>
        </div>
    );
}

export default App;