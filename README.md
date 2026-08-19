# Vernacular Foundational Literacy Assessment (SkillZ)

A comprehensive reading assessment platform that enables teachers in rural and semi-urban Indian schools to conduct frequent, objective oral-reading assessments at scale using AI-powered insights and offline-first architecture.

---

## Table of Contents

- [Project Title](#project-title)
- [Overview](#overview)
- [Problem Statement](#problem-statement)
- [Solution Architecture](#solution-architecture)
- [System Architecture & Tech Stack](#system-architecture--tech-stack)
- [Directory & File Tree Blueprint](#directory--file-tree-blueprint)
- [Data Models & Database Schemas](#data-models--database-schemas)
- [API Endpoint Specifications](#api-endpoint-specifications)
- [AI Tool-Calling & Agent Workflow Specs](#ai-tool-calling--agent-workflow-specs)
- [Environment Configuration](#environment-configuration)
- [PowerShell Scripts](#powershell-scripts)
- [Usage Workflow](#usage-workflow)
- [Security & Performance](#security--performance)
- [Troubleshooting](#troubleshooting)
- [Getting Started](#getting-started)

---

## Overview

**SkillZ** is an intelligent reading assessment system designed to revolutionize how teachers evaluate student literacy in vernacular languages (Tamil, Telugu, Kannada, Malayalam, etc.) across Indian schools. 

The platform captures student audio through a Progressive Web App (PWA), leverages state-of-the-art AI models (SeamlessM4T for multilingual transcription + Llama 3.1 for diagnostic insights), and provides teachers with actionable recommendations—all while maintaining strict child privacy standards through encryption, anonymous IDs, and automatic data deletion.

**Key Impact:**
- ✅ Reduce teacher assessment time by >60% annually
- ✅ Replace 40+ tablets with one shared device
- ✅ Enable early intervention before reading gaps become persistent deficits
- ✅ Process assessments in <3 minutes per student
- ✅ Works offline with automatic sync when connectivity returns

---

## Problem Statement

### Current Challenges

Teachers in rural and semi-urban Indian schools face significant barriers to conducting regular literacy assessments:

1. **Time Constraint:** Assessing 40 students (5 min each) = 200 minutes = 33+ teacher hours/year per class
2. **Resource Scarcity:** Individual devices required for digital solutions are often unavailable
3. **Internet Dependency:** Most existing tools require continuous connectivity, infeasible in rural settings
4. **Manual Scoring Burden:** Labor-intensive assessment processes delay intervention identification
5. **Language Gap:** Lack of vernacular assessment tools tailored to regional languages
6. **Delayed Intervention:** Reading difficulties go undetected until they become persistent learning deficits

These challenges result in:
- Unidentified reading patterns and learning gaps
- Delayed intervention and corrective measures
- Inefficient resource allocation for teacher support
- Limited data for evidence-based instructional planning

---

## Solution Architecture

### High-Level System Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    STUDENT LAYER (Offline-First PWA)            │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐  │
│  │  Audio Capture   │→ │  IndexedDB Cache │→ │  Auto-Sync   │  │
│  │   (Microphone)   │  │  (Offline Store) │  │  (On WiFi)   │  │
│  └──────────────────┘  └──────────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    [REST API - ASP.NET Core]
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                     AI PROCESSING LAYER                         │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐  │
│  │  SeamlessM4T     │→ │ Scoring Engine   │→ │  Llama 3.1   │  │
│  │ (Speech→Text)    │  │(Accuracy/WPM)   │  │ (Diagnosis)  │  │
│  └──────────────────┘  └──────────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    DATA PERSISTENCE LAYER                       │
│               SQL Server + Entity Framework Core                │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐   │
│  │ Refactoring  │  │ Agent Tasks  │  │ Validation Results │   │
│  │ Requests     │  │              │  │                    │   │
│  └──────────────┘  └──────────────┘  └────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                   TEACHER DASHBOARD LAYER                       │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐  │
│  │ Student Profiles │→ │ Error Patterns   │→ │ Recommended  │  │
│  │                  │  │ & Analytics      │  │ Interventions│  │
│  └──────────────────┘  └──────────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Detailed Tier-Level Architecture

**Tier 1: Frontend (ReactJS PWA)**
- Audio capture and student management UI
- Offline-first design with IndexedDB
- Real-time transcription display
- Role-based access control (Teacher/Admin)
- Responsive, mobile-optimized dashboard

**Tier 2: API Layer (ASP.NET Core .NET 10)**
- RESTful endpoints for assessment data
- Authentication & authorization middleware
- Request validation and business logic
- Orchestration of AI pipeline calls
- Automated sync & queuing mechanisms

**Tier 3: AI Processing Layer**
- **SeamlessM4T:** Converts student audio to regional language transcripts
- **Llama 3.1 8B:** Analyzes patterns, generates recommendations
- **Scoring Engine:** Calculates accuracy %, WPM, hesitation metrics
- **Error Pattern Matcher:** Identifies consistent error patterns across sessions

**Tier 4: Data Persistence (SQL Server)**
- Encrypted student data storage
- Assessment history and analytics
- Teacher recommendations and interventions
- Audit logs for compliance

---

## System Architecture & Tech Stack

### Frontend Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **UI Framework** | ReactJS | Component-based UI development |
| **State Management** | React Context API / Redux | Global state management |
| **Offline Storage** | IndexedDB | Browser-based persistent cache |
| **HTTP Client** | Axios / Fetch API | API communication |
| **Styling** | Tailwind CSS / CSS Modules | Responsive design |
| **PWA Support** | Service Workers | Offline functionality |
| **Build Tool** | Vite / Create React App | Development & production builds |

### Backend Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Framework** | ASP.NET Core (.NET 10) | Web application framework |
| **API Type** | RESTful API | Backend services |
| **ORM** | Entity Framework Core | Database abstraction |
| **Validation** | FluentValidation / Data Annotations | Request/entity validation |
| **Dependency Injection** | Built-in DI Container | Service management |
| **Configuration** | Environment variables (.env) | Environment-specific settings |

### AI & LLM Integration

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Speech-to-Text** | SeamlessM4T | Multilingual transcription (regional languages) |
| **LLM Model** | Llama 3.1 8B | Error pattern recognition & teacher recommendations |
| **Model Hosting** | Ollama / Local Inference | On-premise AI inference (privacy-first) |
| **Prompt Engineering** | Custom System Prompts | Orchestrator & agent prompts |
| **Tool Calling** | Function calling via LLM | Agent task execution |

### Database Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **DBMS** | SQL Server (T-SQL) | Relational data storage |
| **Encryption** | Transparent Data Encryption (TDE) | At-rest encryption |
| **Backup** | SQL Server Backup | Data redundancy |
| **Audit Logging** | SQL Server Audit / Custom Logging | Compliance tracking |

### Development Tools

| Tool | Purpose |
|------|---------|
| **Git** | Version control |
| **Visual Studio / VS Code** | Development IDEs |
| **Postman / Insomnia** | API testing |
| **SQL Server Management Studio** | Database administration |
| **PowerShell** | Automation scripts |

---

## Directory & File Tree Blueprint

```
Vernacular-LLM/
├── README.md                          # Project documentation
├── .env.example                       # Environment variables template
├── .gitignore                         # Git ignore rules
│
├── frontend/                          # ReactJS PWA
│   ├── public/
│   │   ├── index.html
│   │   ├── manifest.json             # PWA manifest
│   │   └── service-worker.js         # Offline support
│   ├── src/
│   │   ├── components/
│   │   │   ├── AudioRecorder.jsx    # Capture component
│   │   │   ├── StudentForm.jsx
│   │   │   ├── Dashboard.jsx        # Teacher dashboard
│   │   │   └── ResultsDisplay.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Assessment.jsx
│   │   │   ├── Results.jsx
│   │   │   └── Profile.jsx
│   │   ├── services/
│   │   │   ├── api.js              # API client
│   │   │   ├── storage.js          # IndexedDB operations
│   │   │   └── sync.js             # Auto-sync logic
│   │   ├── hooks/
│   │   │   ├── useOffline.js       # Offline detection
│   │   │   └── useAuth.js
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── DataContext.jsx
│   │   ├── styles/
│   │   │   └── globals.css
│   │   ├── App.jsx
│   │   └── index.js
│   ├── package.json
│   └── vite.config.js (or webpack.config.js)
│
├── backend/                           # ASP.NET Core API
│   ├── SkillZ.API/
│   │   ├── Controllers/
│   │   │   ├── AssessmentController.cs
│   │   │   ├── StudentController.cs
│   │   │   ├── TeacherController.cs
│   │   │   └── ValidationController.cs
│   │   ├── Services/
│   │   │   ├── AssessmentService.cs
│   │   │   ├── AIOrchestrationService.cs
│   │   │   ├── SeamlessM4TService.cs
│   │   │   └── LlamaAnalysisService.cs
│   │   ├── Models/
│   │   │   ├── DTOs/
│   │   │   │   ├── AssessmentRequestDTO.cs
│   │   │   │   └── RecommendationResponseDTO.cs
│   │   │   └── Entities/ (see Data Models section)
│   │   ├── Data/
│   │   │   ├── ApplicationDbContext.cs
│   │   │   └── Migrations/
│   │   ├── Middleware/
│   │   │   ├── AuthenticationMiddleware.cs
│   │   │   └── ErrorHandlingMiddleware.cs
│   │   ├── appsettings.json
│   │   ├── appsettings.Development.json
│   │   ├── Program.cs
│   │   └── SkillZ.API.csproj
│   │
│   └── SkillZ.Core/                  # Shared business logic
│       ├── Entities/
│       ├── Interfaces/
│       ├── Services/
│       └── SkillZ.Core.csproj
│
├── scripts/
│   ├── setup.ps1                     # Initial setup script
│   ├── start-dev.ps1                 # Development startup
│   └── seed-database.ps1             # Database seeding
│
├── docs/
│   ├── API_DOCUMENTATION.md
│   ├── AI_PIPELINE.md
│   └── DEPLOYMENT_GUIDE.md
│
└── .github/
    └── workflows/
        └── ci-cd.yml                 # CI/CD pipeline

```

---

## Data Models & Database Schemas

### C# Entity Classes

#### RefactoringRequest (Main Aggregate Root)

```csharp
public class RefactoringRequest
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid StudentId { get; set; }
    public Guid TeacherId { get; set; }
    
    // Audio & Transcription
    public byte[] AudioData { get; set; }      // Encrypted
    public string AudioHash { get; set; }      // For integrity check
    public string TranscriptText { get; set; } // From SeamlessM4T
    public string AssessmentLanguage { get; set; } // e.g., "Tamil", "Telugu"
    
    // Assessment Metadata
    public DateTime AssessmentDate { get; set; }
    public int DurationSeconds { get; set; }
    public string TextPassage { get; set; }    // Student read from this
    
    // Status & Tracking
    public AssessmentStatus Status { get; set; } // Pending, Processing, Completed
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? CompletedAt { get; set; }
    public DateTime? DeletedAt { get; set; }   // Soft delete for auto-removal
    
    // Navigation Properties
    public Student Student { get; set; }
    public Teacher Teacher { get; set; }
    public ValidationResult ValidationResult { get; set; }
    public ICollection<AgentTask> AgentTasks { get; set; } = new List<AgentTask>();
    public ICollection<TeacherRecommendation> Recommendations { get; set; } = new List<TeacherRecommendation>();
}

public enum AssessmentStatus
{
    Pending,
    TranscribingAudio,
    ScoringAccuracy,
    AnalyzingPatterns,
    GeneratingRecommendations,
    Completed,
    Failed
}
```

#### AgentTask (Task for Each Agent)

```csharp
public class AgentTask
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid RefactoringRequestId { get; set; }
    
    // Agent Workflow
    public string AgentName { get; set; }      // "TranscriptionAgent", "ScoringAgent", "AnalysisAgent"
    public string TaskType { get; set; }       // "Transcribe", "Score", "Analyze", "Recommend"
    public string SystemPrompt { get; set; }   // AI instructions
    public string UserPrompt { get; set; }     // Specific input
    
    // Execution Details
    public TaskStatus Status { get; set; }     // Pending, Running, Completed, Failed
    public string Input { get; set; }          // JSON serialized input
    public string Output { get; set; }         // JSON serialized output from LLM
    public string ErrorMessage { get; set; }   // If failed
    
    // Retry Logic
    public int RetryCount { get; set; } = 0;
    public int MaxRetries { get; set; } = 3;
    public DateTime? NextRetryTime { get; set; }
    
    // Timestamps
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? StartedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    
    // Navigation
    public RefactoringRequest RefactoringRequest { get; set; }
}

public enum TaskStatus
{
    Pending,
    Running,
    Completed,
    Failed,
    Retrying
}
```

#### ValidationResult

```csharp
public class ValidationResult
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid RefactoringRequestId { get; set; }
    
    // Accuracy Metrics
    public double WordAccuracyPercentage { get; set; }
    public int TotalWordsRead { get; set; }
    public int CorrectWords { get; set; }
    public int MissedWords { get; set; }
    
    // Fluency Metrics
    public double WordsPerMinute { get; set; }
    public int HesitationCount { get; set; }
    public int SelfCorrectionCount { get; set; }
    public double AveragePauseLength { get; set; }
    
    // Error Patterns
    public List<string> ErrorPatterns { get; set; } = new List<string>();
    public Dictionary<string, int> ErrorFrequency { get; set; } = new Dictionary<string, int>();
    
    // Progress Tracking
    public int SessionNumber { get; set; }
    public double ProgressPercentage { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public RefactoringRequest RefactoringRequest { get; set; }
}
```

#### Additional Core Entities

```csharp
public class Student
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string AnonymousStudentId { get; set; } // Privacy-first approach
    public Guid ClassroomId { get; set; }
    
    public string GradeLevel { get; set; }        // e.g., "Grade 2"
    public string PreferredLanguage { get; set; } // Vernacular language
    public bool ParentConsentGiven { get; set; }
    
    // Privacy
    public bool DataDeletionScheduled { get; set; }
    public DateTime? ScheduledDeletionDate { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public ICollection<RefactoringRequest> Assessments { get; set; }
}

public class Teacher
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; }
    public string Email { get; set; }
    public string PasswordHash { get; set; }
    
    public Guid? SchoolId { get; set; }
    public string PreferredLanguage { get; set; }
    public bool IsAdmin { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public ICollection<RefactoringRequest> CreatedAssessments { get; set; }
    public ICollection<TeacherRecommendation> Recommendations { get; set; }
}

public class TeacherRecommendation
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid RefactoringRequestId { get; set; }
    public Guid TeacherId { get; set; }
    
    public string RecommendationText { get; set; } // From Llama
    public List<string> SuggestedActivities { get; set; }
    public string InterventionPriority { get; set; } // High, Medium, Low
    
    public bool IsImplemented { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public RefactoringRequest RefactoringRequest { get; set; }
    public Teacher Teacher { get; set; }
}
```

### EF Core DbContext

```csharp
public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) 
        : base(options) { }
    
    public DbSet<Student> Students { get; set; }
    public DbSet<Teacher> Teachers { get; set; }
    public DbSet<RefactoringRequest> RefactoringRequests { get; set; }
    public DbSet<AgentTask> AgentTasks { get; set; }
    public DbSet<ValidationResult> ValidationResults { get; set; }
    public DbSet<TeacherRecommendation> TeacherRecommendations { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        // Relationships
        modelBuilder.Entity<RefactoringRequest>()
            .HasOne(r => r.Student)
            .WithMany(s => s.Assessments)
            .HasForeignKey(r => r.StudentId);
            
        modelBuilder.Entity<RefactoringRequest>()
            .HasOne(r => r.ValidationResult)
            .WithOne(v => v.RefactoringRequest)
            .HasForeignKey<ValidationResult>(v => v.RefactoringRequestId);
        
        // Indexes for performance
        modelBuilder.Entity<RefactoringRequest>()
            .HasIndex(r => r.StudentId);
        
        modelBuilder.Entity<RefactoringRequest>()
            .HasIndex(r => r.Status);
        
        // Soft delete configuration
        modelBuilder.Entity<RefactoringRequest>()
            .Property(r => r.DeletedAt)
            .IsRequired(false);
    }
}
```

### Database Schema (T-SQL)

```sql
-- Students Table
CREATE TABLE Students (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    AnonymousStudentId NVARCHAR(50) UNIQUE NOT NULL,
    ClassroomId UNIQUEIDENTIFIER NOT NULL,
    GradeLevel NVARCHAR(50),
    PreferredLanguage NVARCHAR(50),
    ParentConsentGiven BIT NOT NULL DEFAULT 0,
    DataDeletionScheduled BIT NOT NULL DEFAULT 0,
    ScheduledDeletionDate DATETIME2 NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    INDEX IX_ClassroomId (ClassroomId),
    INDEX IX_CreatedAt (CreatedAt)
);

-- Teachers Table
CREATE TABLE Teachers (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    Name NVARCHAR(MAX) NOT NULL,
    Email NVARCHAR(255) UNIQUE NOT NULL,
    PasswordHash NVARCHAR(MAX) NOT NULL,
    SchoolId UNIQUEIDENTIFIER NULL,
    PreferredLanguage NVARCHAR(50),
    IsAdmin BIT NOT NULL DEFAULT 0,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    INDEX IX_Email (Email),
    INDEX IX_SchoolId (SchoolId)
);

-- RefactoringRequests (Assessments) Table
CREATE TABLE RefactoringRequests (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    StudentId UNIQUEIDENTIFIER NOT NULL,
    TeacherId UNIQUEIDENTIFIER NOT NULL,
    AudioData VARBINARY(MAX),           -- Encrypted
    AudioHash NVARCHAR(MAX),
    TranscriptText NVARCHAR(MAX),
    AssessmentLanguage NVARCHAR(50),
    AssessmentDate DATETIME2 NOT NULL,
    DurationSeconds INT,
    TextPassage NVARCHAR(MAX),
    Status NVARCHAR(50) NOT NULL DEFAULT 'Pending',
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    CompletedAt DATETIME2 NULL,
    DeletedAt DATETIME2 NULL,           -- Soft delete
    FOREIGN KEY (StudentId) REFERENCES Students(Id),
    FOREIGN KEY (TeacherId) REFERENCES Teachers(Id),
    INDEX IX_StudentId (StudentId),
    INDEX IX_TeacherId (TeacherId),
    INDEX IX_Status (Status),
    INDEX IX_CreatedAt (CreatedAt),
    INDEX IX_DeletedAt (DeletedAt)
);

-- AgentTasks Table
CREATE TABLE AgentTasks (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    RefactoringRequestId UNIQUEIDENTIFIER NOT NULL,
    AgentName NVARCHAR(255),
    TaskType NVARCHAR(50),
    SystemPrompt NVARCHAR(MAX),
    UserPrompt NVARCHAR(MAX),
    Status NVARCHAR(50) NOT NULL DEFAULT 'Pending',
    Input NVARCHAR(MAX),
    Output NVARCHAR(MAX),
    ErrorMessage NVARCHAR(MAX),
    RetryCount INT NOT NULL DEFAULT 0,
    MaxRetries INT NOT NULL DEFAULT 3,
    NextRetryTime DATETIME2 NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    StartedAt DATETIME2 NULL,
    CompletedAt DATETIME2 NULL,
    FOREIGN KEY (RefactoringRequestId) REFERENCES RefactoringRequests(Id),
    INDEX IX_RefactoringRequestId (RefactoringRequestId),
    INDEX IX_Status (Status),
    INDEX IX_AgentName (AgentName)
);

-- ValidationResults Table
CREATE TABLE ValidationResults (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    RefactoringRequestId UNIQUEIDENTIFIER NOT NULL UNIQUE,
    WordAccuracyPercentage FLOAT,
    TotalWordsRead INT,
    CorrectWords INT,
    MissedWords INT,
    WordsPerMinute FLOAT,
    HesitationCount INT,
    SelfCorrectionCount INT,
    AveragePauseLength FLOAT,
    ErrorPatterns NVARCHAR(MAX),       -- JSON
    ErrorFrequency NVARCHAR(MAX),       -- JSON
    SessionNumber INT,
    ProgressPercentage FLOAT,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    FOREIGN KEY (RefactoringRequestId) REFERENCES RefactoringRequests(Id),
    INDEX IX_RefactoringRequestId (RefactoringRequestId),
    INDEX IX_SessionNumber (SessionNumber)
);

-- TeacherRecommendations Table
CREATE TABLE TeacherRecommendations (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    RefactoringRequestId UNIQUEIDENTIFIER NOT NULL,
    TeacherId UNIQUEIDENTIFIER NOT NULL,
    RecommendationText NVARCHAR(MAX),
    SuggestedActivities NVARCHAR(MAX),  -- JSON array
    InterventionPriority NVARCHAR(50),
    IsImplemented BIT NOT NULL DEFAULT 0,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    FOREIGN KEY (RefactoringRequestId) REFERENCES RefactoringRequests(Id),
    FOREIGN KEY (TeacherId) REFERENCES Teachers(Id),
    INDEX IX_RefactoringRequestId (RefactoringRequestId),
    INDEX IX_TeacherId (TeacherId),
    INDEX IX_InterventionPriority (InterventionPriority)
);

-- Enable Transparent Data Encryption (TDE) for sensitive data
-- ALTER DATABASE YourDatabaseName SET ENCRYPTION ON;
```

---

## API Endpoint Specifications

### Base URL

```
Development:  http://localhost:5000/api
Production:   https://skillz-api.example.com/api
```

### Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <jwt-token>
```

**Obtain Token:**
```http
POST /api/auth/login
Content-Type: application/json

{
    "email": "teacher@example.com",
    "password": "password123"
}

Response (200):
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600,
    "userId": "guid-here"
}
```

### Assessment Endpoints

#### Create Assessment

```http
POST /api/assessments
Authorization: Bearer <token>
Content-Type: application/json

{
    "studentId": "guid-student",
    "assessmentLanguage": "Tamil",
    "audioData": "base64-encoded-audio",
    "audioHash": "sha256-hash",
    "textPassage": "ஆ அ இ ஈ உ ஊ...",
    "durationSeconds": 120
}

Response (201):
{
    "id": "guid-assessment",
    "studentId": "guid-student",
    "status": "TranscribingAudio",
    "createdAt": "2024-01-15T10:30:00Z"
}
```

#### Get Assessment Status

```http
GET /api/assessments/{assessmentId}
Authorization: Bearer <token>

Response (200):
{
    "id": "guid-assessment",
    "studentId": "guid-student",
    "status": "Completed",
    "transcriptText": "ஆ அ இ ஈ உ...",
    "createdAt": "2024-01-15T10:30:00Z",
    "completedAt": "2024-01-15T10:35:00Z"
}
```

#### List Student Assessments

```http
GET /api/assessments?studentId={studentId}&skip=0&take=10
Authorization: Bearer <token>

Response (200):
{
    "data": [
        {
            "id": "guid-1",
            "studentId": "guid-student",
            "status": "Completed",
            "createdAt": "2024-01-15T10:30:00Z"
        }
    ],
    "total": 15,
    "skip": 0,
    "take": 10
}
```

#### Delete Assessment (Soft Delete)

```http
DELETE /api/assessments/{assessmentId}
Authorization: Bearer <token>

Response (204): No Content
```

### Agent Status Endpoints

#### Get Agent Task Status

```http
GET /api/agent-tasks/{taskId}
Authorization: Bearer <token>

Response (200):
{
    "id": "guid-task",
    "refactoringRequestId": "guid-assessment",
    "agentName": "AnalysisAgent",
    "taskType": "Analyze",
    "status": "Completed",
    "output": {
        "errorPatterns": ["retroflex_consonant_issue", "vowel_confusion"],
        "recommendations": ["Practice retroflex sounds...", "Vowel drills..."]
    },
    "completedAt": "2024-01-15T10:35:00Z"
}
```

#### List Agent Tasks for Assessment

```http
GET /api/assessments/{assessmentId}/agent-tasks
Authorization: Bearer <token>

Response (200):
{
    "tasks": [
        {
            "id": "guid-task-1",
            "agentName": "TranscriptionAgent",
            "status": "Completed"
        },
        {
            "id": "guid-task-2",
            "agentName": "ScoringAgent",
            "status": "Completed"
        }
    ]
}
```

### Validation Endpoints

#### Get Validation Results

```http
GET /api/assessments/{assessmentId}/validation
Authorization: Bearer <token>

Response (200):
{
    "id": "guid-validation",
    "wordAccuracyPercentage": 92.5,
    "wordsPerMinute": 78,
    "totalWordsRead": 40,
    "correctWords": 37,
    "missedWords": 3,
    "hesitationCount": 2,
    "selfCorrectionCount": 1,
    "errorPatterns": ["retroflex_consonants", "vowel_length"],
    "sessionNumber": 3,
    "progressPercentage": 15.5
}
```

### Recommendations Endpoints

#### Get Teacher Recommendations

```http
GET /api/assessments/{assessmentId}/recommendations
Authorization: Bearer <token>

Response (200):
{
    "id": "guid-recommendation",
    "refactoringRequestId": "guid-assessment",
    "recommendationText": "Student shows consistent difficulty with retroflex consonants (ள், ற, ண). This affects comprehension in words like... Recommend 5-minute daily drills focusing on ள் vs ல் distinction.",
    "suggestedActivities": [
        "Minimal pair drills: ளை - லை (20 repetitions)",
        "Word segmentation practice for retroflex words",
        "Phoneme blending exercises for ற combinations"
    ],
    "interventionPriority": "High",
    "isImplemented": false,
    "createdAt": "2024-01-15T10:35:00Z"
}
```

#### Mark Recommendation as Implemented

```http
PATCH /api/recommendations/{recommendationId}
Authorization: Bearer <token>
Content-Type: application/json

{
    "isImplemented": true
}

Response (200):
{
    "id": "guid-recommendation",
    "isImplemented": true,
    "updatedAt": "2024-01-15T14:30:00Z"
}
```

### Student & Teacher Endpoints

#### Create Student

```http
POST /api/students
Authorization: Bearer <token>
Content-Type: application/json

{
    "classroomId": "guid-classroom",
    "gradeLevel": "Grade 2",
    "preferredLanguage": "Tamil",
    "parentConsentGiven": true
}

Response (201):
{
    "id": "guid-student",
    "anonymousStudentId": "ANON-2024-001",
    "classroomId": "guid-classroom",
    "gradeLevel": "Grade 2",
    "createdAt": "2024-01-15T10:00:00Z"
}
```

#### Get Teacher Dashboard

```http
GET /api/teachers/dashboard
Authorization: Bearer <token>

Response (200):
{
    "totalStudents": 45,
    "assessmentsThisWeek": 18,
    "studentsByRiskLevel": {
        "high": 5,
        "medium": 12,
        "low": 28
    },
    "commonErrorPatterns": [
        "retroflex_consonants",
        "vowel_length_distinction"
    ],
    "pendingRecommendations": 8
}
```

---

## AI Tool-Calling & Agent Workflow Specs

### System Prompts

#### Orchestrator System Prompt

```
You are SkillZ Orchestrator, an AI system managing multi-agent reading assessment workflow.

Your responsibility:
1. Coordinate agent tasks (Transcription → Scoring → Analysis → Recommendation)
2. Monitor agent health and retry failures
3. Ensure data quality between agents
4. Manage tool-calling for agent execution

Workflow Rules:
- Start TranscriptionAgent first
- Only proceed to ScoringAgent if transcript is valid (non-empty, >10 words)
- Run AnalysisAgent and RecommendationAgent in parallel after scoring
- If any agent fails 3 times, escalate to human review

Output Format (JSON):
{
    "orchestrationId": "guid",
    "currentStage": "Scoring|Analysis|Complete",
    "nextAction": "RunScoringAgent|RunAnalysisAgent|ScheduleRetry|EscalateToHuman",
    "agentsToRun": ["ScoringAgent", "AnalysisAgent"],
    "failedAgents": [],
    "summary": "Assessment progressing normally..."
}

Tool Calling:
- Call execute_agent(agent_name, input_data) for each agent
- Call log_event() for audit trails
- Call notify_teacher() only when assessment completes
```

#### Transcription Agent System Prompt

```
You are SkillZ TranscriptionAgent responsible for converting student audio to accurate Tamil/Telugu/Kannada/Malayalam text.

Input: Raw audio bytes or base64 audio

Your Task:
1. Validate audio quality (>3 seconds, <5MB)
2. Detect language automatically
3. Transcribe using SeamlessM4T
4. Return clean transcript with timing data

Output JSON:
{
    "success": true,
    "transcript": "ஆ அ இ ஈ உ ஊ...",
    "language": "Tamil",
    "confidence": 0.94,
    "wordTimings": [
        { "word": "ஆ", "startMs": 0, "endMs": 500 },
        { "word": "அ", "startMs": 500, "endMs": 1000 }
    ],
    "qualityIssues": []
}

Error Handling:
- If audio < 3 seconds: Return error "Audio too short"
- If language unclear: Return error "Cannot detect language"
- If transcription fails: Retry with reduced quality settings
```

#### Scoring Agent System Prompt

```
You are SkillZ ScoringAgent responsible for analyzing accuracy, fluency, and reading patterns.

Input JSON:
{
    "transcript": "ஆ அ இ ஈ...",
    "expectedText": "ஆ அ இ ஈ...",
    "wordTimings": [...],
    "audioLength": 120
}

Your Task (DO NOT CALCULATE - RETURN METRICS):
1. Match transcript words to expected text (regex matching)
2. Calculate: Accuracy % = (correct_words / total_words) * 100
3. Calculate: WPM = (word_count / audio_length_minutes)
4. Identify: Hesitations, self-corrections, repetitions
5. Flag: Unknown words, mispronunciations

Output JSON:
{
    "accuracy": 92.5,
    "correctWords": 37,
    "totalWords": 40,
    "wordsPerMinute": 78,
    "hesitationCount": 2,
    "selfCorrectionCount": 1,
    "errorWords": [
        { "expected": "ஆ", "spoken": "அ", "position": 0 },
        { "expected": "கூ", "spoken": "கு", "position": 15 }
    ]
}

Important: Do NOT generate recommendations here. Only scoring.
```

#### Analysis Agent System Prompt

```
You are SkillZ AnalysisAgent responsible for error pattern recognition and diagnostic insights.

Input JSON:
{
    "transcript": "...",
    "expectedText": "...",
    "accuracy": 92.5,
    "errorWords": [...],
    "sessionHistory": [
        { "date": "2024-01-10", "accuracy": 85.0, "wpm": 72 },
        { "date": "2024-01-12", "accuracy": 89.0, "wpm": 75 }
    ]
}

Your Task:
1. Identify PATTERNS: Which phonemes/graphemes cause consistent errors?
2. Cross-reference with session history: Is this improving?
3. Categorize error types:
   - Vowel confusion (short vs long)
   - Consonant substitution (retroflex, dental, alveolar)
   - Fluency issues (hesitation, pausing)
4. Assess impact: Does error affect comprehension?

Output JSON:
{
    "errorPatterns": [
        {
            "pattern": "retroflex_consonants",
            "affectedGraphemes": ["ள்", "ற", "ண"],
            "frequency": 5,
            "trend": "stable|improving|deteriorating",
            "severity": "high|medium|low"
        }
    ],
    "strengthAreas": ["vowel_accuracy", "fluency"],
    "readinessForAdvancement": false,
    "diagnosticSummary": "Student demonstrates strong vowel accuracy (95%) but consistent difficulty with retroflex consonant articulation (78% accuracy). This is typical for Grade 2 in Tamil learning but warrants targeted intervention."
}

DO NOT generate recommendations. Only diagnosis.
```

#### Recommendation Agent System Prompt

```
You are SkillZ RecommendationAgent responsible for generating actionable teacher interventions.

Input JSON (from previous agents):
{
    "studentGrade": "Grade 2",
    "language": "Tamil",
    "diagnosticSummary": "...",
    "errorPatterns": [...],
    "sessionHistory": [...]
}

Your Task:
Generate teacher-specific recommendations that are:
1. SPECIFIC: Name the exact grapheme/phoneme to practice
2. ACTIONABLE: Provide concrete drill words and activities
3. TIME-BOUND: "5-min daily drills" not vague "practice more"
4. EVIDENCE-BASED: Reference the student's actual errors
5. PROGRESSIVE: Suggest next steps after current focus area

Output JSON:
{
    "mainRecommendation": "Focus on retroflex consonant ள் articulation through minimal pair contrasts. Student confused ள் with ல் in 5 of 40 words. This is impacting comprehension of words like... Start with 5-minute daily drills using the words below.",
    "focusAreas": [
        {
            "area": "Retroflex ள் vs Dental ல் Contrast",
            "priority": "High",
            "rationale": "5 errors in 40 words (12.5% error rate) significantly above Grade 2 benchmark (5% tolerance)"
        }
    ],
    "suggestedActivities": [
        "Day 1-3: Minimal pair drills (ளை - லை, பள - பல, வளை - வலை). 20 repetitions each word, 5 min daily.",
        "Day 4-5: Short word segmentation (பள்ளி, வளை, குளை). Emphasize retroflex articulation.",
        "Day 6+: Phoneme blending in CVC words (ள்ப, ள்ட). Prepare for complex word structures."
    ],
    "estimatedImprovementTimeframe": "2-3 weeks with consistent daily practice",
    "successCriteria": "Student achieves 90%+ accuracy on ள् words in next assessment",
    "nextFocusArea": "After retroflex mastery, assess nasal consonant clusters (ண்ட, ந்த)",
    "parentEngagementSuggestion": "Share drilling video with parents; 10-min home practice can accelerate improvement"
}

Remember: You are ENHANCING teacher capacity, not replacing teacher judgment. Teacher makes final decision.
```

### Self-Correction Retry Loop

```csharp
public class RetryOrchestrationService
{
    private readonly ILogger<RetryOrchestrationService> _logger;
    private readonly IAIAgentService _aiAgentService;
    private readonly IRefactoringRequestRepository _repo;
    
    public async Task ExecuteWithRetryAsync(AgentTask task, int maxRetries = 3)
    {
        int retryCount = 0;
        
        while (retryCount < maxRetries)
        {
            try
            {
                _logger.LogInformation($"Executing agent task: {task.AgentName}, Attempt {retryCount + 1}");
                
                // Execute agent
                var result = await _aiAgentService.ExecuteAgentAsync(
                    task.AgentName,
                    task.SystemPrompt,
                    task.UserPrompt
                );
                
                // Validate output
                if (!ValidateAgentOutput(result, task.AgentName))
                {
                    throw new InvalidOperationException("Agent output validation failed");
                }
                
                // Success
                task.Status = TaskStatus.Completed;
                task.Output = JsonSerializer.Serialize(result);
                task.CompletedAt = DateTime.UtcNow;
                await _repo.SaveChangesAsync();
                
                return;
            }
            catch (Exception ex)
            {
                retryCount++;
                _logger.LogWarning($"Agent task failed: {ex.Message}. Retry {retryCount}/{maxRetries}");
                
                if (retryCount >= maxRetries)
                {
                    task.Status = TaskStatus.Failed;
                    task.ErrorMessage = ex.Message;
                    await _repo.SaveChangesAsync();
                    
                    // Escalate to human review
                    await NotifyAdminAsync(task, "Agent task exhausted retries");
                    throw;
                }
                
                // Exponential backoff
                int delayMs = (int)Math.Pow(2, retryCount) * 1000;
                task.NextRetryTime = DateTime.UtcNow.AddMilliseconds(delayMs);
                task.RetryCount = retryCount;
                task.Status = TaskStatus.Retrying;
                await _repo.SaveChangesAsync();
                
                await Task.Delay(delayMs);
            }
        }
    }
    
    private bool ValidateAgentOutput(dynamic result, string agentName)
    {
        return agentName switch
        {
            "TranscriptionAgent" => !string.IsNullOrEmpty(result.transcript),
            "ScoringAgent" => result.accuracy >= 0 && result.accuracy <= 100,
            "AnalysisAgent" => result.errorPatterns != null,
            "RecommendationAgent" => !string.IsNullOrEmpty(result.mainRecommendation),
            _ => true
        };
    }
}
```

---

## Environment Configuration

### .env.example

```env
# Database
DB_SERVER=localhost
DB_PORT=1433
DB_NAME=SkillZ_Development
DB_USER=sa
DB_PASSWORD=YourComplexPassword123!
CONNECTION_STRING=Server=localhost,1433;Initial Catalog=SkillZ_Development;User Id=sa;Password=YourComplexPassword123;Encrypt=true;TrustServerCertificate=true;

# JWT Authentication
JWT_SECRET=your-super-secret-key-minimum-32-characters-here
JWT_EXPIRATION_MINUTES=60
JWT_ISSUER=skillz-app
JWT_AUDIENCE=skillz-users

# Frontend
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development

# AI Services
OLLAMA_BASE_URL=http://localhost:11434
SEAMLESS_M4T_MODEL=seamless-m4t-large
LLAMA_MODEL=llama2:latest
MAX_RETRIES=3
RETRY_DELAY_MS=1000

# Logging
LOG_LEVEL=Debug
LOG_FILE_PATH=./logs

# Security
ENCRYPTION_KEY=your-encryption-key-for-sensitive-data
ENABLE_HTTPS=false
CORS_ORIGINS=http://localhost:3000,http://localhost:5000

# File Upload
MAX_AUDIO_FILE_SIZE_MB=50
TEMP_UPLOAD_PATH=./uploads/temp

# Email (for notifications)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
ADMIN_EMAIL=admin@skillz.example.com
```

---

## PowerShell Scripts

### scripts/setup.ps1

```powershell
<#
.SYNOPSIS
    Initial setup script for SkillZ project
.DESCRIPTION
    Sets up database, installs dependencies, and initializes development environment
#>

param(
    [string]$Environment = "Development",
    [string]$DbServer = "localhost",
    [string]$DbName = "SkillZ_Development"
)

Write-Host "🚀 SkillZ Setup Script" -ForegroundColor Cyan

# 1. Validate prerequisites
Write-Host "✓ Checking prerequisites..." -ForegroundColor Yellow
$requiredTools = @("dotnet", "npm", "sqlcmd")

foreach ($tool in $requiredTools) {
    if (-not (Get-Command $tool -ErrorAction SilentlyContinue)) {
        Write-Host "✗ $tool not found. Please install it first." -ForegroundColor Red
        exit 1
    }
}

# 2. Create .env from .env.example
Write-Host "✓ Setting up environment variables..." -ForegroundColor Yellow
if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "  Created .env file. Please update it with your settings." -ForegroundColor Cyan
}

# 3. Install frontend dependencies
Write-Host "✓ Installing frontend dependencies..." -ForegroundColor Yellow
Push-Location "./frontend"
npm install
Pop-Location

# 4. Install backend dependencies
Write-Host "✓ Installing backend dependencies..." -ForegroundColor Yellow
Push-Location "./backend/SkillZ.API"
dotnet restore
Pop-Location

# 5. Create database
Write-Host "✓ Creating database..." -ForegroundColor Yellow
$connectionString = "Server=$DbServer;Integrated Security=true;"
sqlcmd -S $DbServer -Q "CREATE DATABASE [$DbName];" -ErrorAction SilentlyContinue

# 6. Run EF Core migrations
Write-Host "✓ Running database migrations..." -ForegroundColor Yellow
Push-Location "./backend/SkillZ.API"
dotnet ef database update
Pop-Location

# 7. Seed database (optional)
Write-Host "✓ Seeding database with sample data..." -ForegroundColor Yellow
& "./scripts/seed-database.ps1"

Write-Host "✅ Setup complete! Run 'start-dev.ps1' to start the application." -ForegroundColor Green
```

### scripts/start-dev.ps1

```powershell
<#
.SYNOPSIS
    Starts the development environment
.DESCRIPTION
    Launches both frontend and backend services
#>

Write-Host "🚀 Starting SkillZ Development Environment" -ForegroundColor Cyan

# Load environment variables
Get-Content .env | ForEach-Object {
    if ($_ -match "^\s*[^#]*=.*$") {
        $name, $value = $_.Split('=', 2)
        [Environment]::SetEnvironmentVariable($name.Trim(), $value.Trim())
    }
}

# Start backend
Write-Host "▶ Starting backend (ASP.NET Core)..." -ForegroundColor Yellow
Push-Location "./backend/SkillZ.API"
Start-Process dotnet -ArgumentList "run" -NoNewWindow
Pop-Location

# Wait for backend to start
Start-Sleep -Seconds 3

# Start frontend
Write-Host "▶ Starting frontend (React)..." -ForegroundColor Yellow
Push-Location "./frontend"
Start-Process npm -ArgumentList "start" -NoNewWindow
Pop-Location

Write-Host "✅ Development environment started!" -ForegroundColor Green
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "   Backend:  http://localhost:5000" -ForegroundColor Cyan
Write-Host "   API Docs: http://localhost:5000/swagger" -ForegroundColor Cyan
```

---

## Usage Workflow

### For Teachers

1. **Login to SkillZ Dashboard**
   - Navigate to `http://localhost:3000`
   - Enter credentials
   - Access classroom view

2. **Conduct Assessment**
   - Select student from class roster
   - Click "Start Assessment"
   - Read passage aloud into microphone
   - App records audio automatically
   - ~3 minutes per student

3. **View Automated Insights**
   - Assessment completes (2-3 minutes processing)
   - Accuracy %, WPM, hesitation count displayed
   - AI-generated recommendations appear
   - View error pattern analysis

4. **Act on Recommendations**
   - Review suggested interventions
   - Mark activities as completed
   - Track student progress across sessions
   - Generate class-level reports

### For Developers

1. **Clone Repository**
   ```bash
   git clone https://github.com/Sangames-B/Vernacular-LLM.git
   cd Vernacular-LLM
   ```

2. **Run Setup**
   ```powershell
   .\scripts\setup.ps1 -Environment Development
   ```

3. **Configure Environment**
   - Edit `.env` with local settings
   - Ensure SQL Server is running
   - Start Ollama service (for local LLM inference)

4. **Start Development**
   ```powershell
   .\scripts\start-dev.ps1
   ```

5. **Access Services**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api
   - Swagger UI: http://localhost:5000/swagger

---

## Security & Performance

### Security Features

| Feature | Implementation |
|---------|---|
| **Child Privacy** | Anonymous Student IDs, encrypted audio storage, automatic deletion |
| **Data Encryption** | TDE (Transparent Data Encryption) for at-rest, HTTPS for in-transit |
| **Authentication** | JWT tokens with 60-min expiration, role-based access control (RBAC) |
| **Parent Consent** | Explicit opt-in required before any data collection |
| **Audit Logging** | All access logged with timestamp, user, action, and IP |
| **Audio Deletion** | Automatic deletion option after transcription (configurable) |
| **Accent Bias Testing** | Regular testing to ensure no dialect/accent discrimination |
| **Teacher-Only Access** | Student data visible only to assigned teacher + admin |

### Performance Optimizations

| Optimization | Details |
|---|---|
| **Offline-First PWA** | IndexedDB caching eliminates network latency for common operations |
| **Auto-Sync Queue** | Batches uploads to reduce network traffic; syncs when WiFi available |
| **Lazy Loading** | React components load on-demand; reduces initial bundle size |
| **Database Indexing** | Indexes on StudentId, Status, TeacherId for fast queries |
| **Connection Pooling** | ASP.NET Core manages DB connection pool automatically |
| **AI Model Optimization** | Llama 3.1 8B quantized; runs on modest hardware (4GB RAM, CPU-only) |
| **Caching Layer** | Redis (optional) for frequently accessed recommendations |
| **Pagination** | API endpoints paginate results; prevents large data dumps |

---

## Troubleshooting

### Frontend Issues

**Problem:** "Cannot connect to backend"
```
Solution:
1. Verify backend is running: curl http://localhost:5000/health
2. Check CORS settings in appsettings.json
3. Ensure REACT_APP_API_URL in .env matches backend port
```

**Problem:** "Audio recording not working"
```
Solution:
1. Browser requires HTTPS (or localhost for testing)
2. Check microphone permissions in browser settings
3. Verify audio input device is available: navigator.mediaDevices.enumerateDevices()
```

**Problem:** "IndexedDB storage full"
```
Solution:
1. Clear old assessment data: Settings → Clear Cache
2. Manually clear browser storage: DevTools → Application → Storage → Clear All
3. Increase IndexedDB quota (browser-dependent, ~50MB typical)
```

### Backend Issues

**Problem:** "Database connection failed"
```
Solution:
1. Verify SQL Server is running: sqlcmd -S localhost
2. Check CONNECTION_STRING in .env
3. Ensure database exists: SELECT name FROM sys.databases
4. Validate credentials: sa user and password
```

**Problem:** "EF Core migration error"
```
Solution:
1. Check pending migrations: dotnet ef migrations list
2. Revert to last good state: dotnet ef database update [migration-name]
3. Create new migration: dotnet ef migrations add [name]
4. Update database: dotnet ef database update
```

### AI Pipeline Issues

**Problem:** "Transcription confidence too low"
```
Solution:
1. Check audio quality: >3 seconds, clear speech
2. Verify student language setting matches spoken language
3. Re-record assessment with better microphone
4. Check SeamlessM4T model is fully loaded
```

**Problem:** "Recommendation agent timeout"
```
Solution:
1. Increase timeout in appsettings.json: "AiTimeoutSeconds": 60
2. Check Llama model is loaded: ollama show llama2
3. Monitor system resources: CPU, RAM, disk space
4. Check application logs for detailed error
```

### Database Issues

**Problem:** "Soft-deleted records appearing in queries"
```
Solution:
1. Add `.Where(r => r.DeletedAt == null)` to queries
2. Or configure Global Query Filters in DbContext:
   modelBuilder.Entity<RefactoringRequest>()
       .HasQueryFilter(r => r.DeletedAt == null);
```

---

## Getting Started

### Quick Start (5 minutes)

1. **Install Prerequisites**
   ```bash
   # Windows
   choco install dotnet-sdk nodejs sql-server-express
   
   # macOS
   brew install dotnet nodejs
   # SQL Server via Docker: docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=YourPassword123!" -p 1433:1433 mcr.microsoft.com/mssql/server
   
   # Linux (Ubuntu)
   sudo apt-get install dotnet-sdk nodejs
   ```

2. **Clone & Setup**
   ```bash
   git clone https://github.com/Sangames-B/Vernacular-LLM.git
   cd Vernacular-LLM
   .\scripts\setup.ps1  # Windows
   # Or manually: npm install (frontend), dotnet restore (backend), dotnet ef database update
   ```

4. **Run Development Server**
   ```bash
   .\scripts\start-dev.ps1  # Windows
   ```

5. **Access Application**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000
   - Create teacher account and start assessing

