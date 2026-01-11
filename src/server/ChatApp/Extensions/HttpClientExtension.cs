using ChatApp.Core.Domain.Models;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace ChatApp.Extensions
{
    public static class HttpClientExtensions
    {
        private static readonly JsonSerializerOptions JsonOptions =
            new(JsonSerializerDefaults.Web);

        public static async Task<HttpResult<TResponse>> GetAsync<TResponse>(
            this HttpClient client,
            string url,
            CancellationToken ct = default)
        {
            using var response = await client.GetAsync(url, ct);
            return await ReadResponse<TResponse>(response, ct);
        }

        public static async Task<HttpResult<TResponse>> PostJsonAsync<TRequest, TResponse>(
            this HttpClient client,
            string url,
            TRequest body,
            string? bearerToken = null,
            CancellationToken ct = default)
        {
            var request = new HttpRequestMessage(HttpMethod.Post, url)
            {
                Content = JsonContent.Create(body)
            };

            if (!string.IsNullOrWhiteSpace(bearerToken))
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", bearerToken);

            using var response = await client.SendAsync(request, ct);
            return await ReadResponse<TResponse>(response, ct);
        }

        public static async Task<HttpResult<TResponse>> PostFormAsync<TResponse>(
            this HttpClient client,
            string url,
            IEnumerable<KeyValuePair<string, string>> formContent,
            CancellationToken ct = default)
        {
            using var content = new FormUrlEncodedContent(formContent);
            using var response = await client.PostAsync(url, content, ct);

            return await ReadResponse<TResponse>(response, ct);
        }

        public static async Task<HttpResult<TResponse>> PutJsonAsync<TRequest, TResponse>(
            this HttpClient client,
            string url,
            TRequest payload,
            CancellationToken ct = default)
        {
            var json = JsonSerializer.Serialize(payload, JsonOptions);
            using var content = new StringContent(json, Encoding.UTF8, "application/json");
            using var response = await client.PutAsync(url, content, ct);

            return await ReadResponse<TResponse>(response, ct);
        }

        public static async Task<HttpResult<bool>> DeleteAsync(
            this HttpClient client,
            string url,
            CancellationToken ct = default)
        {
            using var response = await client.DeleteAsync(url, ct);
            var body = await response.Content.ReadAsStringAsync(ct);
            if (!response.IsSuccessStatusCode)
            {
                var errorMessage = TryExtractErrorMessage(body);
                return new HttpResult<bool>
                {
                    IsSuccess = false,
                    StatusCode = (int)response.StatusCode,
                    ErrorMessage = errorMessage
                };
            }

            return new HttpResult<bool>
            {
                IsSuccess = true,
                StatusCode = (int)response.StatusCode,
                Data = true
            };
        }

        private static async Task<HttpResult<TResponse>> ReadResponse<TResponse>(
            HttpResponseMessage response,
            CancellationToken ct)
        {
            var body = await response.Content.ReadAsStringAsync(ct);

            if (response.IsSuccessStatusCode)
            {
                var data = JsonSerializer.Deserialize<TResponse>(body, JsonOptions);
                return new HttpResult<TResponse>
                {
                    IsSuccess = true,
                    StatusCode = (int)response.StatusCode,
                    Data = data
                };
            }

            var errorMessage = TryExtractErrorMessage(body);

            return new HttpResult<TResponse>
            {
                IsSuccess = false,
                StatusCode = (int)response.StatusCode,
                ErrorMessage = errorMessage
            };
        }

        private static string TryExtractErrorMessage(string body)
        {
            try
            {
                using var doc = JsonDocument.Parse(body);

                if (doc.RootElement.TryGetProperty("error_description", out var desc))
                    return desc.GetString()!;

                if (doc.RootElement.TryGetProperty("message", out var msg))
                    return msg.GetString()!;

                if (doc.RootElement.TryGetProperty("error", out var err))
                    return err.GetString()!;

                return body;
            }
            catch
            {
                return body;
            }
        }
    }

}
