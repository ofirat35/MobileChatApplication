using ChatApp.Core.Application.Repositories;
using ChatApp.Core.Domain.Entities;
using ChatApp.Core.Domain.Models;

namespace ChatApp.Core.Application.Services
{
    public interface IUserMembershipService : IGenericRepository<UserMembership, Guid>
    {
        Task<Result<UserMembership>> HasMembershipAsync(Guid membershipId, string userId);
    }
}
