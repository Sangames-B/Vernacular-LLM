var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Register the ReadingAssessmentAgent with a typed HttpClient
builder.Services.AddHttpClient<Vernacular.Server.Agents.ReadingAssessmentAgent>();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

app.UseDefaultFiles();
app.MapStaticAssets();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

// =========================================================================================
// Health Check Endpoint: Database Connection Test
// Route: GET /api/test-db
// Purpose:
//   Instantiates SkillZdbContext and invokes CanConnect() against SQL Server.
//   This verifies that:
//     1. The .env.local file in the root directory is located and parsed correctly.
//     2. The connection string DB_Connection_String is valid and reachable.
//     3. SQL Server accepts the connection and the target database (SkillZDB) exists.
// Returns:
//   200 OK with success JSON if connected, or 500 Problem with detailed error message.
// =========================================================================================
app.MapGet("/api/test-db", () =>
{
    try
    {
        using var db = new Vernacular.Server.Models.SkillZdbContext();
        bool canConnect = db.Database.CanConnect();

        return canConnect
            ? Results.Ok(new
            {
                status = "Success",
                message = "Database connected successfully!",
                timestamp = DateTime.UtcNow
            })
            : Results.Problem(
                detail: "Database connection failed: The server could not establish a connection to SQL Server.",
                statusCode: 500);
    }
    catch (Exception ex)
    {
        return Results.Problem(
            detail: $"Database connection error: {ex.Message}",
            statusCode: 500);
    }
});

// =========================================================================================
// Whisper AI Test Endpoint
// Route: POST /api/test-whisper
// Purpose: Quick way to test if the Whisper AI is successfully transcribing an uploaded audio file.
// =========================================================================================
app.MapPost("/api/test-whisper", async (Microsoft.AspNetCore.Http.IFormFile file, Vernacular.Server.Agents.ReadingAssessmentAgent agent) =>
{
    try
    {
        using var stream = file.OpenReadStream();
        var transcription = await agent.TranscribeAudioAsync(stream, file.FileName);
        return Results.Ok(new { status = "Success", transcription });
    }
    catch (Exception ex)
    {
        return Results.Problem(detail: ex.Message, statusCode: 500);
    }
}).DisableAntiforgery();

app.MapFallbackToFile("/index.html");

app.Run();
