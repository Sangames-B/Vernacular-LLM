using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Vernacular.Server.Models;

namespace Vernacular.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AudioRecordingsController : ControllerBase
    {
        private readonly IWebHostEnvironment _env;

        public AudioRecordingsController(IWebHostEnvironment env)
        {
            _env = env;
        }

        /// <summary>
        /// Uploads and syncs a student audio recording to the server and records it in SkillZDB.
        /// Route: POST /api/AudioRecordings/upload or POST /api/AudioRecordings/sync
        /// </summary>
        [HttpPost("upload")]
        [HttpPost("sync")]
        public async Task<IActionResult> UploadRecording(
            [FromForm] IFormFile? file,
            [FromForm] IFormFile? audioFile,
            [FromForm] string? rollNumber,
            [FromForm] int? durationSeconds)
        {
            // Support either 'file' or 'audioFile' parameter names from client
            var uploadFile = file ?? audioFile;

            if (uploadFile == null || uploadFile.Length == 0)
            {
                return BadRequest(new { message = "Audio file is required and cannot be empty." });
            }

            if (string.IsNullOrWhiteSpace(rollNumber))
            {
                return BadRequest(new { message = "Roll number is required." });
            }

            try
            {
                // Determine target directory on server (wwwroot/uploads/audio or uploads/audio)
                var webRoot = _env.WebRootPath ?? Path.Combine(_env.ContentRootPath, "wwwroot");
                var uploadsFolder = Path.Combine(webRoot, "uploads", "audio");

                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                // Sanitize roll number for filename
                var cleanRollNumber = string.Concat(rollNumber.Where(c => char.IsLetterOrDigit(c) || c == '-' || c == '_')).ToLowerInvariant();
                var timestamp = DateTime.UtcNow.ToString("yyyyMMdd_HHmmss");
                var uniqueId = Guid.NewGuid().ToString("N").Substring(0, 8);
                var extension = Path.GetExtension(uploadFile.FileName);
                if (string.IsNullOrWhiteSpace(extension))
                {
                    extension = ".wav";
                }

                var fileName = $"{timestamp}_{cleanRollNumber}_{uniqueId}{extension}";
                var physicalPath = Path.Combine(uploadsFolder, fileName);

                // Save audio file to physical disk
                using (var stream = new FileStream(physicalPath, FileMode.Create))
                {
                    await uploadFile.CopyToAsync(stream);
                }

                // Relative URL path stored in database
                var relativePath = $"/uploads/audio/{fileName}";

                // Insert metadata record into SkillZDB
                using var context = new SkillZdbContext();

                var recording = new AudioRecording
                {
                    RollNumber = rollNumber.Trim(),
                    AudioFilePath = relativePath,
                    DurationSeconds = durationSeconds,
                    SavedAt = DateTime.UtcNow
                };

                context.AudioRecordings.Add(recording);
                await context.SaveChangesAsync();

                return Ok(new
                {
                    message = "Recording synced successfully.",
                    recordingId = recording.RecordingId,
                    rollNumber = recording.RollNumber,
                    audioFilePath = recording.AudioFilePath,
                    durationSeconds = recording.DurationSeconds,
                    savedAt = recording.SavedAt
                });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    message = "An error occurred while saving the recording to the database.",
                    error = ex.Message
                });
            }
        }

        /// <summary>
        /// Retrieves all audio recording records from SkillZDB.
        /// Route: GET /api/AudioRecordings
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetAllRecordings()
        {
            try
            {
                using var context = new SkillZdbContext();
                var recordings = await context.AudioRecordings
                    .OrderByDescending(r => r.SavedAt)
                    .ToListAsync();

                return Ok(recordings);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    message = "Failed to retrieve recordings from the database.",
                    error = ex.Message
                });
            }
        }

        /// <summary>
        /// Retrieves audio recordings for a specific student roll number.
        /// Route: GET /api/AudioRecordings/student/{rollNumber}
        /// </summary>
        [HttpGet("student/{rollNumber}")]
        public async Task<IActionResult> GetRecordingsByStudent(string rollNumber)
        {
            try
            {
                using var context = new SkillZdbContext();
                var recordings = await context.AudioRecordings
                    .Where(r => r.RollNumber == rollNumber)
                    .OrderByDescending(r => r.SavedAt)
                    .ToListAsync();

                return Ok(recordings);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    message = "Failed to retrieve student recordings from the database.",
                    error = ex.Message
                });
            }
        }
    }
}
