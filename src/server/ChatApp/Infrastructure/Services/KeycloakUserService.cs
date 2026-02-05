using ChatApp.Core.Application.Services;
using ChatApp.Core.Domain.Dtos;
using ChatApp.Core.Domain.Dtos.Auth;
using ChatApp.Core.Domain.Models;
using ChatApp.Extensions;
using MediatR;
using Microsoft.Extensions.Options;

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
                : Result<string>.Fail(response.ErrorMessage);
        }

        public async Task<Result<KeyCloakUserListDto>> GetUserByIdAsync(string id)
        {
            var response = await _clientHttpClient
                .GetAsync<KeyCloakUserListDto>(
                $"{options.Value.BaseUrl}/admin/realms/{options.Value.Realm}/users/{id}");
            return response.IsSuccess
               ? Result<KeyCloakUserListDto>.Success(response.Data!, response.StatusCode)
               : Result<KeyCloakUserListDto>.Fail(response.ErrorMessage);
        }

        public async Task<Result<Unit>> UpdateUserAsync(KeyCloakUserUpdateDto userDto, string id)
        {
            var response = await _clientHttpClient
                .PutJsonAsync<KeyCloakUserUpdateDto, Unit>(
                $"{options.Value.BaseUrl}/admin/realms/{options.Value.Realm}/users/{id}", userDto);
            return response.IsSuccess
               ? Result<Unit>.Success(response.Data!, response.StatusCode)
               : Result<Unit>.Fail(response.ErrorMessage);
        }

        public async Task<Result<Unit>> DeleteUserAsync(string id)
        {
            var response = await _clientHttpClient.DeleteResultAsync(
                $"{options.Value.BaseUrl}/admin/realms/{options.Value.Realm}/users/{id}");

            return response.IsSuccess
               ? Result<Unit>.Success(response.Data!, response.StatusCode)
               : Result<Unit>.Fail(response.ErrorMessage);
        }
    }
}
