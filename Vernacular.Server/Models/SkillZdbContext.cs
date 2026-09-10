using System;
using System.Collections.Generic;
using System.IO;
using Microsoft.EntityFrameworkCore;

namespace Vernacular.Server.Models;

public partial class SkillZdbContext : DbContext
{
    public SkillZdbContext()
    {
    }

    public SkillZdbContext(DbContextOptions<SkillZdbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<AudioRecording> AudioRecordings { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {
            var connectionString = GetConnectionStringFromEnv();
            if (!string.IsNullOrWhiteSpace(connectionString))
            {
                optionsBuilder.UseSqlServer(connectionString);
            }
        }
    }

    private static string? GetConnectionStringFromEnv()
    {
        // 1. Check process environment variables first
        var envVar = Environment.GetEnvironmentVariable("DB_Connection_String");
        if (!string.IsNullOrWhiteSpace(envVar))
        {
            return CleanConnectionString(envVar);
        }

        // 2. Search upwards from current directory for .env.local
        var dir = new DirectoryInfo(Directory.GetCurrentDirectory());
        while (dir != null)
        {
            var filePath = Path.Combine(dir.FullName, ".env.local");
            if (File.Exists(filePath))
            {
                var val = ReadKeyFromFile(filePath, "DB_Connection_String");
                if (!string.IsNullOrWhiteSpace(val)) return val;
            }
            dir = dir.Parent;
        }

        // 3. Search upwards from application base directory as fallback
        dir = new DirectoryInfo(AppContext.BaseDirectory);
        while (dir != null)
        {
            var filePath = Path.Combine(dir.FullName, ".env.local");
            if (File.Exists(filePath))
            {
                var val = ReadKeyFromFile(filePath, "DB_Connection_String");
                if (!string.IsNullOrWhiteSpace(val)) return val;
            }
            dir = dir.Parent;
        }

        return null;
    }

    private static string? ReadKeyFromFile(string filePath, string key)
    {
        foreach (var line in File.ReadAllLines(filePath))
        {
            var trimmed = line.Trim();
            if (string.IsNullOrEmpty(trimmed) || trimmed.StartsWith("#"))
                continue;

            var separatorIndex = trimmed.IndexOf('=');
            if (separatorIndex > 0)
            {
                var lineKey = trimmed.Substring(0, separatorIndex).Trim();
                if (string.Equals(lineKey, key, StringComparison.OrdinalIgnoreCase))
                {
                    var value = trimmed.Substring(separatorIndex + 1).Trim();
                    return CleanConnectionString(value);
                }
            }
        }
        return null;
    }

    private static string CleanConnectionString(string value)
    {
        // Remove surrounding quotes if present
        if ((value.StartsWith("\"") && value.EndsWith("\"")) ||
            (value.StartsWith("'") && value.EndsWith("'")))
        {
            value = value.Substring(1, value.Length - 2);
        }

        // Unescape escaped backslashes (\\ to \) from C#-style strings
        value = value.Replace(@"\\", @"\");

        return value;
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AudioRecording>(entity =>
        {
            entity.Property(e => e.SavedAt).HasDefaultValueSql("(sysutcdatetime())");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}

