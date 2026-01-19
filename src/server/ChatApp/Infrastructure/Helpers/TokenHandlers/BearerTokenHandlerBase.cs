using System.Net.Http.Headers;

namespace ChatApp.Infrastructure.Helpers.TokenHandlers
{
    public abstract class BearerTokenHandlerBase : DelegatingHandler
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

            return await base.SendAsync(request, cancellationToken);
        }
    }
}
