using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Vernacular.Server.Models;

[Index("RollNumber", Name = "IX_AudioRecordings_RollNumber")]
public partial class AudioRecording
{
    [Key]
    public int RecordingId { get; set; }

    [StringLength(30)]
    [Unicode(false)]
    public string RollNumber { get; set; } = null!;

    [StringLength(500)]
    public string AudioFilePath { get; set; } = null!;

    public int? DurationSeconds { get; set; }

    public DateTime SavedAt { get; set; }
}
