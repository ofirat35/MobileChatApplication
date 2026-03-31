using ChatApp.Core.Application.Services;
using ChatApp.Core.Domain.Models;

namespace ChatApp.Infrastructure.Services
{
    public class PaymentService : IPaymentService
    {
        public async Task<Result<bool>> ProcessPaymentAsync()
        {
            return Result<bool>.Success(true);
        }

        public async Task<Result<bool>> ReturnPaymentAsync()
        {
            return Result<bool>.Success(true);
        }
    }
}
