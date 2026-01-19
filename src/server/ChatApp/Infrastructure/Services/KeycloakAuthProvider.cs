using ChatApp.Core.Application.Services;
using ChatApp.Core.Domain.Dtos;
using ChatApp.Core.Domain.Dtos.Auth;
using ChatApp.Core.Domain.Dtos.Users;
using ChatApp.Core.Domain.Models;
using ChatApp.Extensions;
using Microsoft.Extensions.Options;

namespace ChatApp.Infrastructure.Services
{
    public sealed class KeyCloakAuthProvider(
        IOptions<KeycloakConfig> options,
        IHttpClientFactory factory) : IAuthProvider
    {
        private readonly HttpClient _clientHttpClient = factory.CreateClient("keycloak_client");
        private readonly HttpClient _publicHttpClient = factory.CreateClient("keycloak_public");

        public async Task<OpenIdConfigurationResponse> GetOpenIdConfigurationAsync()
        {
            var response = await _clientHttpClient.GetAsync<OpenIdConfigurationResponse>(
                options.Value.OpenIdConfigurationUrl);
            if (!response.IsSuccess) throw new Exception(response.ErrorMessage);

            return response.Data!;
        }
      
        public async Task<Result<TokenResponse>> LoginAsync(LoginDto user)
        {
            var configurations = await GetOpenIdConfigurationAsync();
            var values = new Dictionary<string, string>
            {
                ["grant_type"] = "password",
                ["client_id"] = options.Value.ClientId,
                ["client_secret"] = options.Value.ClientSecret,
                ["username"] = user.Username,
                ["password"] = user.Password
            };
            var response = await _publicHttpClient.PostFormAsync<TokenResponse>(
                configurations.TokenEndpoint,
                values);

            return response.IsSuccess
               ? Result<TokenResponse>.Success(response.Data!, response.StatusCode)
               : Result<TokenResponse>.Fail(response.ErrorMessage);
        }

        public async Task<Result<bool>> RegisterAsync(UserCreateDto user)
        {
            var request = new KeycloakCreateUser
            {
                Username = user.Username,
                Enabled = true,
                Credentials =
                    [
                        new()
                        {
                            Value = user.Password,
                            Temporary = false
                        }
                    ]
            };

            var response = await _clientHttpClient
                    .PostJsonAsync<KeycloakCreateUser, object>(
                $"{options.Value.BaseUrl}/admin/realms/{options.Value.Realm}/users",
                request);

            return response.IsSuccess
                ? Result<bool>.Success(true, response.StatusCode)
                : Result<bool>.Fail(response.ErrorMessage);
        }
    }
}
