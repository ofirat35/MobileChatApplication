using ChatApp.Core.Application.Services;
using ChatApp.Core.Domain.Dtos;
using ChatApp.Core.Domain.Dtos.Auth;
using ChatApp.Core.Domain.Models;
using ChatApp.Extensions;
using MediatR;
using Microsoft.Extensions.Options;
using System.Text.Json.Serialization;

namespace ChatApp.Infrastructure.Services
{
    public class KeycloakUserService(IOptions<KeycloakConfig> options, IHttpClientFactory factory)
        : IKeycloakUserService
    {
        private readonly HttpClient _clientHttpClient = factory.CreateClient("keycloak_client");

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
                return Result<string>.Fail("Keycloak did not return user location");

            var keycloakUserId = location.Split('/').Last();

            return response.IsSuccess
                ? Result<string>.Success(keycloakUserId, response.StatusCode)
                : Result<string>.Fail(response.ErrorMessage, response.StatusCode);
        }

        public async Task<Result<KeyCloakUserListDto>> GetUserByIdAsync(string id)
        {
            var response = await _clientHttpClient
                .GetAsync<KeyCloakUserListDto>(
                $"{options.Value.BaseUrl}/admin/realms/{options.Value.Realm}/users/{id}");
            return response.IsSuccess
               ? Result<KeyCloakUserListDto>.Success(response.Data!, response.StatusCode)
               : Result<KeyCloakUserListDto>.Fail(response.ErrorMessage, response.StatusCode);
        }

        public async Task<Result<Unit>> UpdateUserAsync(KeyCloakUserUpdateDto userDto, string id)
        {
            var response = await _clientHttpClient
                .PutJsonAsync<KeyCloakUserUpdateDto, Unit>(
                $"{options.Value.BaseUrl}/admin/realms/{options.Value.Realm}/users/{id}", userDto);
            return response.IsSuccess
               ? Result<Unit>.Success(response.Data!, response.StatusCode)
               : Result<Unit>.Fail(response.ErrorMessage, response.StatusCode);
        }

        public async Task<Result<Unit>> DeleteUserAsync(string id)
        {
            var response = await _clientHttpClient.PutJsonAsync<object, Unit>(
                $"{options.Value.BaseUrl}/admin/realms/{options.Value.Realm}/users/{id}", new { enabled = false });

            return response.IsSuccess
               ? Result<Unit>.Success(response.Data!, response.StatusCode)
               : Result<Unit>.Fail(response.ErrorMessage, response.StatusCode);
        }

        public async Task<Result<Unit>> AssignRealmRoleAsync(string userId, string roleName)
        {
            var res = await _clientHttpClient.GetAsync<KeycloakRoleDto>($"{options.Value.BaseUrl}/admin/realms/{options.Value.Realm}/roles/{roleName}");
            var rolePayload = new[]
            {
                new { id = res.Data.Id, name = roleName }
            };

            var response = await _clientHttpClient.PostJsonAsync<object, object>(
                $"{options.Value.BaseUrl}/admin/realms/{options.Value.Realm}/users/{userId}/role-mappings/realm",
                rolePayload);

            return response.IsSuccess
               ? Result<Unit>.Success(Unit.Value!, response.StatusCode)
               : Result<Unit>.Fail(response.ErrorMessage, response.StatusCode);
        }
        
        public async Task<Result<Unit>> RemoveUserRealmRoleAsync(string userId, string roleName)
        {
            var res = await _clientHttpClient.GetAsync<KeycloakRoleDto>($"{options.Value.BaseUrl}/admin/realms/{options.Value.Realm}/roles/{roleName}");
            var rolePayload = new[]
            {
                new { id = res.Data.Id, name = roleName }
            };

            var response = await _clientHttpClient.DeleteResultAsync(
                $"{options.Value.BaseUrl}/admin/realms/{options.Value.Realm}/users/{userId}/role-mappings/realm");

            return response.IsSuccess
               ? Result<Unit>.Success(Unit.Value!, response.StatusCode)
               : Result<Unit>.Fail(response.ErrorMessage, response.StatusCode);
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
