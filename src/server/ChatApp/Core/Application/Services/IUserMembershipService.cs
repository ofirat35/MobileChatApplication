using ChatApp.Core.Application.Repositories;
using ChatApp.Core.Domain.Entities;

namespace ChatApp.Core.Application.Services
{
    public interface IUserMembershipService : IGenericRepository<UserMembership, Guid>
    {
        Task<UserMembership> HasMembership(string membership, string userId);
    }
}
