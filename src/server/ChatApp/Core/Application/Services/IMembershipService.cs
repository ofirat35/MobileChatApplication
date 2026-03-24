using ChatApp.Core.Application.Repositories;
using ChatApp.Core.Domain.Entities;

namespace ChatApp.Core.Application.Services
{
    public interface IMembershipService : IGenericRepository<Membership, Guid>
    {
        Task<List<Membership>> GetActiveMembershipTypes();
        Task DeleteMembershipAsync(Guid id);
    }
}
