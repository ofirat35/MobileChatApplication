using ChatApp.Core.Domain.Models;

namespace ChatApp.Core.Application.Services
{
    public interface IPaymentService
    {
        Task<Result<bool>> ProcessPaymentAsync();
        Task<Result<bool>> ReturnPaymentAsync();
    }
}
