using System;
using System.IO;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Threading.Tasks;

namespace Vernacular.Server.Agents
{
    public class ReadingAssessmentAgent
    {
        private readonly HttpClient _httpClient;
        private readonly string _endpoint = "https://router.huggingface.co/hf-inference/models/openai/whisper-large-v3";

        public ReadingAssessmentAgent(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<string> TranscribeAudioAsync(Stream audioStream, string fileName)
        {
            var apiKey = GetHfToken();
            if (string.IsNullOrWhiteSpace(apiKey) || apiKey == "HF_Token")
            {
                throw new Exception("Hugging Face token is missing or still set to 'HF_Token'. Please set HF_TOKEN in your .env.local file.");
            }

            using var request = new HttpRequestMessage(HttpMethod.Post, _endpoint);
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);

            // Hugging Face inference API accepts the raw binary audio stream directly
            using var streamContent = new StreamContent(audioStream);
            streamContent.Headers.ContentType = new MediaTypeHeaderValue("audio/wav");
            request.Content = streamContent;

            var response = await _httpClient.SendAsync(request);

            if (!response.IsSuccessStatusCode)
            {
                var errorResponse = await response.Content.ReadAsStringAsync();
                throw new Exception($"Transcription API failed: {response.StatusCode} - {errorResponse}");
            }

            var responseJson = await response.Content.ReadAsStringAsync();
            using var jsonDocument = JsonDocument.Parse(responseJson);

            // Hugging Face Whisper returns: {"text": "transcribed text here"}
            if (jsonDocument.RootElement.TryGetProperty("text", out var textElement))
            {
                return textElement.GetString() ?? string.Empty;
            }

            return responseJson;
        }

        private static string? GetHfToken()
        {
            // 1. Check environment variables
            var envVar = Environment.GetEnvironmentVariable("HF_TOKEN")
                      ?? Environment.GetEnvironmentVariable("HF_Token");
            if (!string.IsNullOrWhiteSpace(envVar)) return envVar;

            // 2. Search upwards for .env.local file (matching SkillZdbContext pattern)
            var dir = new DirectoryInfo(Directory.GetCurrentDirectory());
            while (dir != null)
            {
                var filePath = Path.Combine(dir.FullName, ".env.local");
                if (File.Exists(filePath))
                {
                    var val = ReadKeyFromFile(filePath, "HF_TOKEN") ?? ReadKeyFromFile(filePath, "HF_Token");
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
                        var val = trimmed.Substring(separatorIndex + 1).Trim();
                        return val.Trim('"', '\'');
                    }
                }
            }
            return null;
        }
    }
}