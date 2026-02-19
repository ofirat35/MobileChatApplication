using ChatApp.Core.Application.Repositories;
using ChatApp.Core.Domain.Dtos.AppUsers;
using ChatApp.Core.Domain.Entities;
using ChatApp.Core.Domain.Models;

namespace ChatApp.Core.Application.Services
{
    public interface ISwiperService : IGenericRepository<Swipe, Guid>
    {
        Task<Result<List<UserProfile>>> GetMatchingPreferences(int count, int? offset);
        Task<Result<bool>> Like(string id);
        Task<Result<bool>> Pass(string id);
        Task<Result<bool>> ViewProfile(string id);
    }
}
