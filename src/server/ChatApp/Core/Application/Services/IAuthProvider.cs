using ChatApp.Core.Domain.Dtos;
using ChatApp.Core.Domain.Dtos.Auth;
using ChatApp.Core.Domain.Dtos.Users;
using ChatApp.Core.Domain.Models;

namespace ChatApp.Core.Application.Services
{
    public interface IAuthProvider
    {
        Task<OpenIdConfigurationResponse> GetOpenIdConfigurationAsync();
        //Task<KeycloakTokenResponse> GetClientTokenAsync();
        Task<Result<TokenResponse>> LoginAsync(LoginDto user);
        Task<Result<bool>> RegisterAsync(UserCreateDto user);
    }
}
