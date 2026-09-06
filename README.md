# SkillZ - Vernacular Foundational Literacy Assessment Infrastructure

**One Device. Many Students. Any Connectivity. Multiple Indian Languages.**

---

## **Project Overview**

SkillZ is an offline-first assessment platform that captures student audio, transcribes regional languages via Whisper Large v3, and generates teacher recommendations via Llama 3.1. Teachers assess reading fluency without individual devices or continuous internet.

---

## **Functional Requirements**

### **Core Features**
- ✅ Student audio recording (Web Audio API)
- ✅ Offline storage (IndexedDB) with auto-sync
- ✅ Speech-to-text transcription (Whisper Large v3)
- ✅ Reading error analysis (Llama 3.1)
- ✅ Teacher dashboard (student scores, recommendations)
- ✅ Simple login (username-based)

### **Out-of-Scope**
- Production security (encryption, JWT, validation)
- Real database persistence (using mock data in hackathon)
- Advanced error handling
- Mobile app (PWA only)
- ✅ What gets seeded (Teachers, Students, Passages only)
✅ What doesn't get seeded (audio, evaluations, AI outputs)
✅ Empty state UI on first login
✅ Real demo flow (record live → real AI → real results)
✅ DbInitializer.cs approach

### **Acceptance Criteria**
- Record audio offline → stored locally
- Online connection triggers auto-sync
- Whisper returns transcript + timing
- Llama returns JSON recommendations
- Dashboard displays results

---

## **System Architecture**

### **Tech Stack**
| Layer | Technology |
|-------|-----------|
| **Frontend** | ReactJS (PWA) + IndexedDB |
| **Backend** | ASP.NET Core (.NET 10) + C# |
| **Database** | SQL Server (T-SQL) |
| **AI** | Whisper Large v3 (Hugging Face) + Llama 3.1 8B (Hugging Face) |
| **Auth** | Simple localStorage token |

### **Data Flow**
```
Student Reads Audio
        ↓
React PWA (Web Audio API)
        ↓
IndexedDB (offline queue)
        ↓
[Network Active] → C# API
        ↓
┌─────────────────────────┐
│ Whisper (speech→text)   │
│ (Hugging Face API)      │
└────────────┬────────────┘
             ↓
┌─────────────────────────┐
│ Basic Scoring Engine    │
│ (Accuracy %, WPM, etc)  │
└────────────┬────────────┘
             ↓
┌─────────────────────────┐
│ Llama (diagnosis)       │
│ (Hugging Face API)      │
│ Returns JSON            │
└────────────┬────────────┘
             ↓
SQL Server (store result)
        ↓
React Dashboard
```

### **API Endpoints**

**Authentication:**
- `POST /api/auth/login` → `{ username, password }` → returns token

**Audio:**
- `POST /api/audio/upload` → receives audio blob → returns `{ transcription, errors }`

**Assessments:**
- `POST /api/assessments` → creates assessment record
- `GET /api/assessments/{studentId}` → returns assessment history + recommendations

**Dashboard:**
- `GET /api/dashboard/students` → returns all students + latest scores
- `GET /api/dashboard/student/{studentId}/progress` → returns student progress

---

## **Database Schema**

### **Core Tables**

**Teachers**
```sql
CREATE TABLE Teachers (
    TeacherId INT PRIMARY KEY IDENTITY,
    Username NVARCHAR(100),
    Password NVARCHAR(100),
    CreatedAt DATETIME DEFAULT GETDATE()
);
```

**Students**
```sql
CREATE TABLE Students (
    StudentId INT PRIMARY KEY IDENTITY,
    TeacherId INT FOREIGN KEY,
    Name NVARCHAR(100),
    AnonymousId NVARCHAR(50),
    CreatedAt DATETIME DEFAULT GETDATE()
);
```

**ReadingPassages**
```sql
CREATE TABLE ReadingPassages (
    PassageId INT PRIMARY KEY IDENTITY,
    Title NVARCHAR(200),
    Content NVARCHAR(MAX),
    Language NVARCHAR(50),
    CreatedAt DATETIME DEFAULT GETDATE()
);
```

**EvaluationLogs**
```sql
CREATE TABLE EvaluationLogs (
    LogId INT PRIMARY KEY IDENTITY,
    StudentId INT FOREIGN KEY,
    PassageId INT FOREIGN KEY,
    AudioPath NVARCHAR(500),
    Transcript NVARCHAR(MAX),
    AccuracyScore FLOAT,
    WPM FLOAT,
    HesitationCount INT,
    LlamaRecommendations NVARCHAR(MAX),
    CreatedAt DATETIME DEFAULT GETDATE()
);
```

---

## **Design & UX**

### **User Flows**

**Teacher Login**
1. Enter username
2. Redirect to dashboard

**Student Recording**
1. Select student
2. Select passage
3. Click "Record"
4. Speak (record audio)
5. Submit → offline queue if no internet
6. Auto-sync when online

**Teacher Dashboard**
1. View all students
2. Click student → see assessment history
3. View Llama recommendations

---

## **Non-Functional Requirements**

### **Performance**
- Audio upload: <2 seconds
- Whisper transcription: <5 seconds (depends on audio length)
- Llama analysis: <3 seconds
- Dashboard load: <2 seconds

### **Authentication**
- Simple login: username → localStorage token
- No JWT validation (raw skeleton)

### **Privacy & Data**
- Anonymous Student IDs (no names in audio paths)
- Audio encrypted at rest (mention but not implemented in skeleton)
- Parent consent (documented, not enforced in code)
- Auto-delete audio option (UI only, backend mock)

---

## **Timeline (Aug 28 - Sep 14)**

### **Days 1-5 (Aug 28 - Sep 1): Backend & AI Pipeline**
- [ ] SQL Server setup + schema
- [ ] ASP.NET Core project scaffold
- [ ] Hugging Face API integration (Whisper + Llama)
- [ ] Basic API endpoints (POST /upload, GET /results)
- [ ] Postman testing

### **Days 6-10 (Sep 2 - Sep 6): React Frontend & Offline**
- [ ] React PWA scaffold
- [ ] Audio recording UI (Web Audio API)
- [ ] IndexedDB offline storage + sync logic
- [ ] Network detection (navigator.onLine)
- [ ] Wire frontend to backend

### **Days 11-13 (Sep 7 - Sep 9): End-to-End Testing**
- [ ] Seed mock data (students, passages)
- [ ] Offline mode simulation (DevTools)
- [ ] Test auto-sync
- [ ] Test full flow: record → transcribe → analyze → display

### **Days 14-17 (Sep 10 - Sep 13): Video & Polish**
- [ ] Video script (day 14)
- [ ] Screen recording (day 15)
- [ ] Video editing (day 16)
- [ ] Final testing (day 17)

### **Day 18 (Sep 14): Submission**
- [ ] Final sanity checks
- [ ] Upload repo + video

---

## **Project Structure**

```
skillz/
├── skillz-backend/
│   ├── Features/
│   │   ├── Authentication/
│   │   │   ├── LoginController.cs
│   │   │   └── AuthService.cs
│   │   ├── AudioRecording/
│   │   │   ├── AudioController.cs
│   │   │   ├── AudioService.cs
│   │   │   └── HuggingFaceClient.cs
│   │   ├── StudentAssessment/
│   │   │   ├── AssessmentController.cs
│   │   │   └── AssessmentService.cs
│   │   ├── TeacherDashboard/
│   │   │   ├── DashboardController.cs
│   │   │   └── DashboardService.cs
│   │   └── Recommendations/
│   │       ├── RecommendationService.cs
│   │       └── LlamaClient.cs
│   ├── Shared/
│   │   └── Models/
│   │       ├── Student.cs
│   │       ├── ReadingPassage.cs
│   │       ├── EvaluationLog.cs
│   │       └── Teacher.cs
│   ├── Infrastructure/
│   │   ├── Database/
│   │   │   └── SkillzDbContext.cs
│   │   └── Configuration/
│   │       └── appsettings.json
│   ├── Core/
│   │   └── Interfaces/
│   │       ├── IAudioService.cs
│   │       └── IHuggingFaceClient.cs
│   ├── Program.cs
│   └── skillz-backend.csproj
│
├── skillz-frontend/
│   ├── src/
│   │   ├── features/
│   │   │   ├── authentication/
│   │   │   │   ├── LoginPage.jsx
│   │   │   │   └── useAuth.js
│   │   │   ├── audioRecording/
│   │   │   │   ├── RecordingPage.jsx
│   │   │   │   ├── useAudioRecording.js
│   │   │   │   └── indexedDBService.js
│   │   │   ├── studentAssessment/
│   │   │   │   └── StudentSelector.jsx
│   │   │   ├── recommendations/
│   │   │   │   └── RecommendationsDisplay.jsx
│   │   │   └── teacherDashboard/
│   │   │       ├── Dashboard.jsx
│   │   │       └── StudentProgressChart.jsx
│   │   ├── shared/
│   │   │   ├── components/
│   │   │   │   └── Header.jsx
│   │   │   ├── hooks/
│   │   │   │   ├── useNetworkStatus.js
│   │   │   │   └── useSyncQueue.js
│   │   │   └── services/
│   │   │       ├── apiClient.js
│   │   │       └── offlineSyncManager.js
│   │   ├── App.jsx
│   │   └── index.js
│   └── package.json
│
└── tests/
    ├── backend.tests/
    └── frontend.tests/
```

---

## **Setup Instructions**

### **Backend**
```bash
cd skillz-backend
dotnet restore
dotnet build
dotnet run
# API runs on http://localhost:5000
```

### **Frontend**
```bash
cd skillz-frontend
npm install
npm start
# PWA runs on http://localhost:3000
```

### **Database**
- SQL Server local instance required
- Connection string in `appsettings.json`
- Run migrations or manual schema creation

---

## **Key Implementation Notes**

1. **Whisper Integration:** Use Hugging Face Inference API (no local model)
2. **Llama Integration:** Use Hugging Face Inference API with structured JSON prompt
3. **Offline Sync:** IndexedDB queue + network event listeners
4. **No Security:** Skip auth validation, just store username in localStorage
5. **No Error Handling:** Happy path only (for hackathon)

---

## **Testing Checklist**

- [ ] Can record audio offline
- [ ] Audio stored in IndexedDB
- [ ] Online → auto-syncs to backend
- [ ] Whisper transcribes correctly
- [ ] Llama returns valid JSON
- [ ] Dashboard displays results
- [ ] Multiple offline sessions work
- [ ] Network reconnection handles partial uploads

---

## **References**

- Hugging Face Inference API: https://huggingface.co/inference-api
- Whisper Large v3: https://huggingface.co/openai/whisper-large-v3
- Llama 3.1 8B: https://huggingface.co/meta-llama/Llama-3.1-8B-Instruct
- Web Audio API: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API
- IndexedDB: https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API

---

**Build fast. Ship it. 🚀**
