using ChatApp.Core.Domain.Dtos.Auth;
using ChatApp.Core.Domain.Models;

namespace ChatApp.Core.Application.Services
{
    public interface IAuthProvider
    {
        Task<Result<KeycloakTokenResponse>> GetAdminTokenAsync();
        Task<Result<TokenResponse>> LoginAsync(string username, string password);
        Task<Result<bool>> RegisterAsync(string username, string password);
    }
}
