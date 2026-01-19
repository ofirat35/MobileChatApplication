using ChatApp.Core.Domain.Models;
using MediatR;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using static System.Runtime.InteropServices.JavaScript.JSType;

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
            CancellationToken ct = default)
        {
            var request = new HttpRequestMessage(HttpMethod.Post, url)
            {
                Content = JsonContent.Create(body)
            };

            //if (!string.IsNullOrWhiteSpace(bearerToken))
            //    request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", bearerToken);

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

        public static async Task<HttpResult<Unit>> DeleteResultAsync(
            this HttpClient client,
            string url,
            CancellationToken ct = default)
        {
            using var response = await client.DeleteAsync(url, ct);
            var body = await response.Content.ReadAsStringAsync(ct);
            if (!response.IsSuccessStatusCode)
            {
                var errorMessage = TryExtractErrorMessage(body);
                return new HttpResult<Unit>
                {
                    IsSuccess = false,
                    StatusCode = (int)response.StatusCode,
                    ErrorMessage = errorMessage
                };
            }

            return new HttpResult<Unit>
            {
                IsSuccess = true,
                StatusCode = (int)response.StatusCode,
            };
        }

        private static async Task<HttpResult<TResponse>> ReadResponse<TResponse>(
            HttpResponseMessage response,
            CancellationToken ct)
        {
            var body = await response.Content.ReadAsStringAsync(ct);

            if (response.IsSuccessStatusCode)
            {
                if (string.IsNullOrWhiteSpace(body))
                {
                    return new HttpResult<TResponse>
                    {
                        IsSuccess = true,
                        StatusCode = (int)response.StatusCode
                    };
                }
                try
                {
                    var data = JsonSerializer.Deserialize<TResponse>(body, JsonOptions);
                    return new HttpResult<TResponse>
                    {
                        IsSuccess = true,
                        StatusCode = (int)response.StatusCode,
                        Data = data
                    };
                }
                catch (Exception)
                {
                    return new HttpResult<TResponse>
                    {
                        IsSuccess = false,
                        StatusCode = (int)response.StatusCode,
                        ErrorMessage = "Invalid JSON response"
                    };
                }

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
