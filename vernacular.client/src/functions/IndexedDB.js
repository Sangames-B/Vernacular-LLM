/*
  IndexedDB helper for storing audio recordings.
  Implements exactly the functions described in the file comments:
  - saveAudioRecording(audioBlob, metadata)
  - getRecordingById(id)
  - deleteRecording(id)

  The implementation is intentionally minimal and follows the instructions.
*/

const DB_NAME = 'AudioRecordingDB';
const DB_VERSION = 1;
const STORE_NAME = 'audio_files';

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }

      const store = event.currentTarget.transaction.objectStore(STORE_NAME);
      if (!store.indexNames.contains('studentId')) {
        store.createIndex('studentId', 'studentId', { unique: false });
      }
    };

    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = () => reject(request.error || new Error('Failed to open IndexedDB'));
  });
}

// Save Audio Records (write operation)
export function saveAudioRecording(audioBlob, studentId, metadata = {}) {
  if (!audioBlob) return Promise.reject(new Error('audioBlob is required'));
  if (!studentId || studentId.trim() === '') {
    return Promise.reject(new Error('studentId is required and cannot be empty'));
  }

  return openDatabase().then((db) =>
    new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);

      const entry = {
        audio: audioBlob,
        studentId: studentId.trim(),
        metadata: { ...metadata },
        createdAt: new Date().toISOString(),
        fileType: audioBlob.type || metadata.fileType || null,
      };

      const req = store.add(entry);
      req.onsuccess = (e) => {
        resolve(e.target.result);
        db.close();
      };
      req.onerror = () => {
        reject(req.error || new Error('Failed to save recording'));
        db.close();
      };
    })
  );
}

// Retrieve Saved Audio (read operation)
export function getRecordingById(id) {
  if (id === undefined || id === null) return Promise.reject(new Error('id is required'));

  return openDatabase().then((db) =>
    new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(Number(id));

      req.onsuccess = (e) => {
        resolve(e.target.result || null);
        db.close();
      };
      req.onerror = () => {
        reject(req.error || new Error('Failed to retrieve recording'));
        db.close();
      };
    })
  );
}

// Delete Audio Records (delete operation)
export function deleteRecording(id) {
  if (id === undefined || id === null) return Promise.reject(new Error('id is required'));

  return openDatabase().then((db) =>
    new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(Number(id));

      req.onsuccess = () => {
        resolve(true);
        db.close();
      };
      req.onerror = () => {
        reject(req.error || new Error('Failed to delete recording'));
        db.close();
      };
    })
  );
}

// Retrieve all recordings for a specific student
export function getRecordingsByStudentId(studentId) {
  if (!studentId || studentId.trim() === '') {
    return Promise.reject(new Error('studentId is required and cannot be empty'));
  }

  return openDatabase().then((db) =>
    new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const index = store.index('studentId');
      const req = index.getAll(studentId.trim());

      req.onsuccess = (e) => {
        resolve(e.target.result || []);
        db.close();
      };
      req.onerror = () => {
        reject(req.error || new Error('Failed to retrieve recordings by student ID'));
        db.close();
      };
    })
  );
}

// Retrieve all saved audio recordings
export function getAllRecordings() {
  return openDatabase().then((db) =>
    new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();

      req.onsuccess = (e) => {
        resolve(e.target.result || []);
        db.close();
      };
      req.onerror = () => {
        reject(req.error || new Error('Failed to retrieve all recordings'));
        db.close();
      };
    })
  );
}

// Update an existing audio record (e.g. mark as synced with server id)
export function updateRecording(recording) {
  if (!recording || !recording.id) {
    return Promise.reject(new Error('Valid recording with id is required to update'));
  }

  return openDatabase().then((db) =>
    new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(recording);

      req.onsuccess = () => {
        resolve(true);
        db.close();
      };
      req.onerror = () => {
        reject(req.error || new Error('Failed to update recording in IndexedDB'));
        db.close();
      };
    })
  );
}



