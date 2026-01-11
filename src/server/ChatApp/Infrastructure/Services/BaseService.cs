using ChatApp.Core.Application.Services;
using ChatApp.Core.Domain.Models;

namespace ChatApp.Infrastructure.Services
{
    public class BaseService : IBaseService
    {
        public static Result<TResp> ToSuccessResult<TResp>(TResp data, int? statusCode = null)
        {
            return Result<TResp>.Success(data, statusCode);
        }

        public static Result<TResp> ToFailResult<TResp>(string errorMessage, int? statusCode = null)
        {
            return Result<TResp>.Fail(errorMessage, statusCode);
        }
    }
}
