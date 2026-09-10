CREATE DATABASE SkillZDB;
GO

USE SkillZDB;
GO

CREATE TABLE dbo.AudioRecordings (
    RecordingId      INT IDENTITY(1,1)           NOT NULL,
    RollNumber       VARCHAR(30)                 NOT NULL,
    AudioFilePath    NVARCHAR(500)               NOT NULL, -- e.g., "/uploads/audio/20260908_25bcap11.wav"
    DurationSeconds  INT                         NULL,     -- Optional audio length
    SavedAt          DATETIME2(7)                NOT NULL DEFAULT SYSUTCDATETIME(),
    
    CONSTRAINT PK_AudioRecordings PRIMARY KEY CLUSTERED (RecordingId)
);
GO

CREATE NONCLUSTERED INDEX IX_AudioRecordings_RollNumber 
ON dbo.AudioRecordings (RollNumber);
GO