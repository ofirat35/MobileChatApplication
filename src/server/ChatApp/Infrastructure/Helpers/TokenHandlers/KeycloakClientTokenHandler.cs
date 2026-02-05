using ChatApp.Core.Domain.Dtos;
using ChatApp.Core.Domain.Models;
using ChatApp.Extensions;
using Microsoft.Extensions.Options;

namespace ChatApp.Infrastructure.Helpers.TokenHandlers
{

    public class KeycloakClientTokenProvider(
        IOptions<KeycloakConfig> options,
        HttpClient httpClient) : ITokenProvider
    {
        private DateTime? expire = null;
        private string? token = null;

        public async Task<string?> GetTokenAsync()
        {
            if (expire != null && expire > DateTime.UtcNow && token != null) return token;
            var values = new Dictionary<string, string>
            {
                ["grant_type"] = options.Value.GrantType,
                ["client_id"] = options.Value.ClientId,
                ["client_secret"] = options.Value.ClientSecret
            };
            var openIdConfigs = await httpClient.GetAsync<OpenIdConfigurationResponse>(
                  options.Value.OpenIdConfigurationUrl);
            if (!openIdConfigs.IsSuccess) throw new Exception(openIdConfigs.ErrorMessage);

            var response = await httpClient.PostFormAsync<KeycloakTokenResponse>(
                openIdConfigs.Data.TokenEndpoint,
                values);
            if (!response.IsSuccess) throw new Exception(response.ErrorMessage);

            expire = DateTime.UtcNow.AddSeconds(response.Data!.ExpiresIn);
            token = response.Data!.AccessToken;

            return token;
        }
    }

    public class KeycloakClientTokenHandler(KeycloakClientTokenProvider tokenProvider)
        : BearerTokenHandlerBase
    {
        protected async override Task<string?> GetTokenAsync()
            => await tokenProvider.GetTokenAsync();
    }
}
