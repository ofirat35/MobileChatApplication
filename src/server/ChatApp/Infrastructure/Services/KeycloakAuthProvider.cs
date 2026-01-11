using ChatApp.Core.Application.Services;
using ChatApp.Core.Domain.Dtos;
using ChatApp.Core.Domain.Dtos.Auth;
using ChatApp.Core.Domain.Models;
using ChatApp.Extensions;
using Microsoft.Extensions.Options;

namespace ChatApp.Infrastructure.Services
{
    public class KeyCloakAuthProvider(
        IOptions<KeycloakConfig> options,
        IHttpClientFactory factory) : BaseService, IAuthProvider
    {
        private readonly HttpClient _httpClient = factory.CreateClient("keycloak");

        public async Task<Result<KeycloakTokenResponse>> GetAdminTokenAsync()
        {
            var values = new Dictionary<string, string>
            {
                ["grant_type"] = options.Value.GrantType,
                ["client_id"] = options.Value.ClientId,
                ["client_secret"] = options.Value.ClientSecret
            };
            var response = await _httpClient.PostFormAsync<KeycloakTokenResponse>(
                $"realms/{options.Value.Realm}/protocol/openid-connect/token",
                values);

            return response.IsSuccess
                ? ToSuccessResult(response.Data!, response.StatusCode)
                : ToFailResult<KeycloakTokenResponse>(response.ErrorMessage);
        }

        public async Task<Result<TokenResponse>> LoginAsync(string username, string password)
        {
            var values = new Dictionary<string, string>
            {
                ["grant_type"] = "password",
                ["client_id"] = options.Value.ClientId,
                ["client_secret"] = options.Value.ClientSecret,
                ["username"] = username,
                ["password"] = password
            };
            var response = await _httpClient.PostFormAsync<TokenResponse>(
                $"realms/ChatApp/protocol/openid-connect/token",
                values);


            return response.IsSuccess
               ? ToSuccessResult(response.Data!, response.StatusCode)
               : ToFailResult<TokenResponse>(response.ErrorMessage);
        }

        public async Task<Result<bool>> RegisterAsync(string username, string password)
        {
            var tokenResponse = await GetAdminTokenAsync();
            if (!tokenResponse.IsSuccess)
                return Result<bool>.Fail(tokenResponse.Error!, tokenResponse.StatusCode);

            var request = new KeycloakCreateUser
            {
                Username = username,
                Enabled = true,
                Credentials =
                    [
                        new()
                        {
                            Value = password,
                            Temporary = false
                        }
                    ]
            };
            var response = await _httpClient.PostJsonAsync<KeycloakCreateUser, object>(
                $"admin/realms/{options.Value.Realm}/users",
                request,
                tokenResponse.Value.Access_Token);

            return response.IsSuccess
                ? ToSuccessResult(true, response.StatusCode)
                : ToFailResult<bool>(response.ErrorMessage);
        }
    }
}
