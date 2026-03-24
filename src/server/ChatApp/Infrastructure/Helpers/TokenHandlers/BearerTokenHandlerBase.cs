using System.Net.Http.Headers;

namespace ChatApp.Infrastructure.Helpers.TokenHandlers
{
    public abstract class BearerTokenHandlerBase(ILogger<BearerTokenHandlerBase> logger) : DelegatingHandler
    {
        protected abstract Task<string?> GetTokenAsync();

        protected override async Task<HttpResponseMessage> SendAsync(
            HttpRequestMessage request,
            CancellationToken cancellationToken)
        {
            var token = await GetTokenAsync();

            if (!string.IsNullOrWhiteSpace(token))
            {
                request.Headers.Authorization =
                    new AuthenticationHeaderValue("Bearer", token);
            }

            var start = DateTime.UtcNow;
            var response = await base.SendAsync(request, cancellationToken);
            var duration = DateTime.UtcNow - start;

            if (!response.IsSuccessStatusCode)
            {
                string? responseBody = null;
                if (response.Content != null) responseBody = await response.Content.ReadAsStringAsync();

                logger.LogError(
                    "HTTP {Method} {Url} failed with {StatusCode} in {Duration}ms. Response: {ResponseBody}",
                    request.Method,
                    request.RequestUri,
                    (int)response.StatusCode,
                    duration.TotalMilliseconds,
                    responseBody);
            }

            return response;
        }
    }
}
