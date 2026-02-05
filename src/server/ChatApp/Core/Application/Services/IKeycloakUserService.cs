using ChatApp.Core.Domain.Dtos.Auth;
using ChatApp.Core.Domain.Models;
using MediatR;

namespace ChatApp.Core.Application.Services
{
    public interface IKeycloakUserService
    {
        Task<Result<KeyCloakUserListDto>> GetUserByIdAsync(string id);
        Task<Result<string>> CreateUserAsync(KeycloakUserCreateRequestDto user);
        Task<Result<Unit>> UpdateUserAsync(KeyCloakUserUpdateDto userDto, string id);
        Task<Result<Unit>> DeleteUserAsync(string id);
    }
}
