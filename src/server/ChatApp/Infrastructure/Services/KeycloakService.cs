using ChatApp.Core.Application.Consts;
using ChatApp.Core.Application.Services;
using ChatApp.Core.Domain.Dtos;
using ChatApp.Core.Domain.Dtos.Auth;
using ChatApp.Core.Domain.Models;
using ChatApp.Extensions;
using MediatR;
using Microsoft.Extensions.Options;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace ChatApp.Infrastructure.Services
{
    public class KeycloakService(
        IOptions<KeycloakConfig> options,
        IHttpContextAccessor httpContext,
        IHttpClientFactory factory,
        ILogger<KeycloakService> logger)
        : BaseService(logger, httpContext, EventIds.KeycloakService), IKeycloakService
    {
        private readonly HttpClient _clientHttpClient = factory.CreateClient("keycloak_client");
        private string? _clientUuid;

        public async Task<Result<string>> CreateUserAsync(KeycloakUserCreateRequestDto user)
        {
            var request = new KeycloakUserCreateDto
            {
                Enabled = true,
                Email = user.Email,
                FirstName = user.FirstName.Trim(),
                LastName = user.LastName.Trim(),
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
                    .PostJsonAsync<KeycloakUserCreateDto, object>(
                $"{options.Value.BaseUrl}/admin/realms/{options.Value.Realm}/users",
                request);

            var location = response.Headers.Location?.ToString();
            if (string.IsNullOrEmpty(location))
            {
                var msj = "Keycloak did not return user location for new user [{FirstName} {LastName}- {Email}]";
                LogError(msj, user.FirstName, user.LastName, user.Email);

                return FailResult<string>(string.Format(msj, user.FirstName, user.LastName, user.Email));
            }

            var keycloakUserId = location.Split('/').Last();

            if (!response.IsSuccess)
            {
                LogError("{ErrorMsg} - [{FirstName} {LastName}- {Email}]",
                    response.ErrorMessage, user.FirstName, user.LastName, user.Email);
                return FailResult<string>(response.ErrorMessage, response.StatusCode);
            }

            return SuccessResult(keycloakUserId, response.StatusCode);
        }

        public async Task<Result<KeyCloakUserListDto>> GetUserByIdAsync(string id)
        {
            var response = await _clientHttpClient
                .GetAsync<KeyCloakUserListDto>(
                $"{options.Value.BaseUrl}/admin/realms/{options.Value.Realm}/users/{id}");

            return response.IsSuccess
               ? SuccessResult(response.Data!, response.StatusCode)
               : FailResult<KeyCloakUserListDto>(response.ErrorMessage, response.StatusCode);
        }

        public async Task<Result<Unit>> UpdateUserAsync(KeyCloakUserUpdateDto userDto, string id)
        {
            var response = await _clientHttpClient
                .PutJsonAsync<KeyCloakUserUpdateDto, Unit>(
                $"{options.Value.BaseUrl}/admin/realms/{options.Value.Realm}/users/{id}", userDto);

            return response.IsSuccess
               ? SuccessResult(response.Data!, response.StatusCode)
               : FailResult<Unit>(response.ErrorMessage, response.StatusCode);
        }

        public async Task<Result<Unit>> DeleteUserAsync(string id)
        {
            var response = await _clientHttpClient.PutJsonAsync<object, Unit>(
                $"{options.Value.BaseUrl}/admin/realms/{options.Value.Realm}/users/{id}", new { enabled = false });

            return response.IsSuccess
               ? SuccessResult(response.Data!, response.StatusCode)
               : FailResult<Unit>(response.ErrorMessage, response.StatusCode);
        }

        public async Task<Result<Unit>> AssignClientRoleAsync(string userId, string roleName)
        {
            var clientUUID = await GetClientUuidAsync();
            return await AssignRoleAsync(
                userId, roleName,
                roleUrl: $"{options.Value.BaseUrl}/admin/realms/{options.Value.Realm}/clients/{clientUUID}/roles/{roleName}",
                mappingUrl: $"{options.Value.BaseUrl}/admin/realms/{options.Value.Realm}/users/{userId}/role-mappings/clients/{clientUUID}");
        }

        public async Task<Result<Unit>> RemoveUserClientRoleAsync(string userId, string roleName)
        {

            var clientUUID = await GetClientUuidAsync();
            return await RemoveRoleAsync(
                userId, roleName,
                roleUrl: $"{options.Value.BaseUrl}/admin/realms/{options.Value.Realm}/clients/{clientUUID}/roles/{roleName}",
                mappingUrl: $"{options.Value.BaseUrl}/admin/realms/{options.Value.Realm}/users/{userId}/role-mappings/clients/{clientUUID}");
        }

        public async Task<Result<Unit>> AssignRealmRoleAsync(string userId, string roleName) =>
            await AssignRoleAsync(
                userId, roleName,
                roleUrl: $"{options.Value.BaseUrl}/admin/realms/{options.Value.Realm}/roles/{roleName}",
                mappingUrl: $"{options.Value.BaseUrl}/admin/realms/{options.Value.Realm}/users/{userId}/role-mappings/realm");

        public async Task<Result<Unit>> RemoveUserRealmRoleAsync(string userId, string roleName) =>
            await RemoveRoleAsync(
                userId, roleName,
                roleUrl: $"{options.Value.BaseUrl}/admin/realms/{options.Value.Realm}/roles/{roleName}",
                mappingUrl: $"{options.Value.BaseUrl}/admin/realms/{options.Value.Realm}/users/{userId}/role-mappings/realm");

        private async Task<string> GetClientUuidAsync()
        {
            if (_clientUuid is not null) return _clientUuid;

            var res = await _clientHttpClient.GetAsync<List<JsonElement>>(
                $"{options.Value.BaseUrl}/admin/realms/{options.Value.Realm}/clients?clientId={options.Value.ClientId}");

            _clientUuid = res.Data.First().GetProperty("id").GetString()!;
            return _clientUuid;
        }

        private async Task<Result<Unit>> AssignRoleAsync(string userId, string roleName, string roleUrl, string mappingUrl)
        {
            var res = await _clientHttpClient.GetAsync<KeycloakRoleDto>(roleUrl);
            if (!res.IsSuccess)
                return FailResult<Unit>(res.ErrorMessage, res.StatusCode);

            var rolePayload = new[] { new { id = res.Data.Id, name = roleName } };

            var response = await _clientHttpClient.PostJsonAsync<object, object>(mappingUrl, rolePayload);

            return response.IsSuccess
                ? SuccessResult(Unit.Value!, response.StatusCode)
                : FailResult<Unit>(response.ErrorMessage, response.StatusCode);
        }

        private async Task<Result<Unit>> RemoveRoleAsync(string userId, string roleName, string roleUrl, string mappingUrl)
        {
            var res = await _clientHttpClient.GetAsync<KeycloakRoleDto>(roleUrl);
            if (!res.IsSuccess)
                return FailResult<Unit>(res.ErrorMessage, res.StatusCode);

            var rolePayload = new[] { new { id = res.Data.Id, name = roleName } };

            var response = await _clientHttpClient.DeleteWithBodyAsync<object>(mappingUrl, rolePayload);

            return response.IsSuccess
                ? SuccessResult(Unit.Value!, response.StatusCode)
                : FailResult<Unit>(response.ErrorMessage, response.StatusCode);
        }

        public class KeycloakRoleDto
        {
            [JsonPropertyName("id")]
            public string Id { get; set; }
            [JsonPropertyName("name")]
            public string Name { get; set; }
        }
    }
}
