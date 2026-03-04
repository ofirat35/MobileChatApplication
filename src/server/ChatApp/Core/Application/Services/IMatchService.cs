using ChatApp.Core.Application.Repositories;
using ChatApp.Core.Domain.Dtos.AppUsers;
using ChatApp.Core.Domain.Entities;
using ChatApp.Core.Domain.Models;

namespace ChatApp.Core.Application.Services
{
    public interface IMatchService : IGenericRepository<Match, Guid>
    {
        Task<PaginatedItemsViewModel<UserProfile>> GetMatches(int page, int pageSize = 10);
    }
}
