using ChatApp.Core.Domain.Models;

namespace ChatApp.Core.Application.Services
{
    public interface ISwiperService
    {
        Task<Result<List<string>>> GetMatchingPreferences(int userCount);
        Task<Result<bool>> Like(string id);
        Task<Result<bool>> Pass(string id);
    }
}
