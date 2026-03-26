using ChatApp.Core.Application.Features.Commands.Memberships;
using ChatApp.Core.Application.Repositories;
using ChatApp.Core.Domain.Entities;
using ChatApp.Core.Domain.Models;

namespace ChatApp.Core.Application.Services
{
    public interface IMembershipService : IGenericRepository<Membership, Guid>
    {
        Task<Result<List<Membership>>> GetActiveMembershipsAsync();
        Task<Result<Membership>> GetMembershipByNameAsync(string membershipName);
        Task<Result<Membership>> GetMembershipByIdAsync(Guid id);
        Task<Result<bool>> CreateMembershipAsync(Membership membership);
        Task<Result<bool>> BuyMembershipAsync(Guid membershipId, string userId, byte duration);
        Task<Result<bool>> DeleteMembershipAsync(Guid id);
    }
}
