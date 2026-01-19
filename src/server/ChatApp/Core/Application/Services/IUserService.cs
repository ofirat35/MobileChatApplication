using ChatApp.Core.Domain.Dtos.Users;
using ChatApp.Core.Domain.Models;
using MediatR;

namespace ChatApp.Core.Application.Services
{
    public interface IUserService
    {
        Task<Result<UserListDto>> GetUserByIdAsync(string id);
        Task<Result<Unit>> UpdateUserAsync(UserUpdateDto userDto, string id);
        //Task<Result<Unit>> UpdateUserAsync(UserUpdateDto userDto);
        Task<Result<Unit>> DeleteUserAsync(string id);
    }
}
