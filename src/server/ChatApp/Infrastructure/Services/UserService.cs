using ChatApp.Core.Application.Services;
using ChatApp.Core.Domain.Dtos;
using ChatApp.Core.Domain.Dtos.Users;
using ChatApp.Core.Domain.Models;
using ChatApp.Extensions;
using MediatR;
using Microsoft.Extensions.Options;

namespace ChatApp.Infrastructure.Services
{
    public class UserService(IOptions<KeycloakConfig> options, IHttpClientFactory factory) : IUserService
    {
        private readonly HttpClient _clientHttpClient = factory.CreateClient("keycloak_client");

        public async Task<Result<UserListDto>> GetUserByIdAsync(string id)
        {
            var response = await _clientHttpClient
                .GetAsync<UserListDto>(
                $"{options.Value.BaseUrl}/admin/realms/{options.Value.Realm}/users/{id}");
            return response.IsSuccess
               ? Result<UserListDto>.Success(response.Data!, response.StatusCode)
               : Result<UserListDto>.Fail(response.ErrorMessage);
        }

        public async Task<Result<Unit>> UpdateUserAsync(UserUpdateDto userDto, string id)
        {
            var response = await _clientHttpClient
                .PutJsonAsync<UserUpdateDto, Unit>(
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
