using ChatApp.Core.Application.Services;
using ChatApp.Core.Domain.Models;
using ChatApp.Infrastructure.Data;

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
