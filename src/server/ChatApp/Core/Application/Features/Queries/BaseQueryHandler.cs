using ChatApp.Core.Domain.Models;

namespace ChatApp.Core.Application.Features.Queries
{
    public class BaseQueryHandler
    {
        protected ResponseModel<TResp> ToSuccessResponseModel<TResp>(TResp data, int statusCode)
        {
            return ResponseModel<TResp>.Success(data, statusCode);
        }

        protected ResponseModel<TResp> ToFailResponseModel<TResp>(string errorMessage, int statusCode)
        {
            return ResponseModel<TResp>.Fail(errorMessage, statusCode);
        }

        protected int ResolveStatusCode<T>(Result<T> result)
           => result.StatusCode ?? StatusCodes.Status400BadRequest;
    }
}
