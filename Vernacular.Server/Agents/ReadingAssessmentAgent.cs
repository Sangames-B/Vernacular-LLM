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
        private readonly string _apiKey = "HF_Token"; // To be replaced by .env.local value later
        private readonly string _modelName = "openai/whisper-large-v3";
        // Using the OpenAI-compatible audio transcriptions endpoint on the Hugging Face router
        private readonly string _routerEndpoint = "https://router.huggingface.co/v1/audio/transcriptions";

        // "System prompt" for the Whisper model. 
        // While Whisper isn't an LLM, it uses the 'prompt' parameter to guide context, vocabulary, and punctuation.
        private readonly string _systemPrompt = "This is a clear recording of a student reading an educational passage in a regional Indian language. Please provide an accurate transcription with proper punctuation and spelling.";

        public ReadingAssessmentAgent(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<string> TranscribeAudioAsync(Stream audioStream, string fileName)
        {
            using var request = new HttpRequestMessage(HttpMethod.Post, _routerEndpoint);
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _apiKey);

            using var content = new MultipartFormDataContent();
            
            // Add the model parameter
            content.Add(new StringContent(_modelName), "model");
            
            // Add the system prompt to guide the transcription
            content.Add(new StringContent(_systemPrompt), "prompt");

            // Add the audio file (adjust content type depending on the file format you send)
            var streamContent = new StreamContent(audioStream);
            streamContent.Headers.ContentType = new MediaTypeHeaderValue("audio/wav");
            content.Add(streamContent, "file", fileName);

            request.Content = content;

            var response = await _httpClient.SendAsync(request);
            
            if (!response.IsSuccessStatusCode)
            {
                var errorResponse = await response.Content.ReadAsStringAsync();
                throw new Exception($"Transcription API failed: {response.StatusCode} - {errorResponse}");
            }

            var responseJson = await response.Content.ReadAsStringAsync();
            using var jsonDocument = JsonDocument.Parse(responseJson);
            
            if (jsonDocument.RootElement.TryGetProperty("text", out var textElement))
            {
                return textElement.GetString() ?? string.Empty;
            }

            return string.Empty;
        }
    }
}
