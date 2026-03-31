using ChatApp.Core.Application.Consts;
using ChatApp.Core.Domain.Models;

namespace ChatApp.Core.Application.Features.Commands
{
    public class BaseCommandHandler
    {
        protected ResponseModel<TResp> ToSuccessResponseModel<TResp>(TResp? data, int? statusCode = null)
        {
            return ResponseModel<TResp>.Success(
                data ?? default,
                statusCode ?? StatusCodes.Status200OK);
        }

        protected ResponseModel<TResp> ToFailResponseModel<TResp>(string? errorMessage, int? statusCode)
        {
            return ResponseModel<TResp>.Fail(
                errorMessage ?? ExceptionMessages.UnexpectedException,
                statusCode ?? StatusCodes.Status500InternalServerError);
        }

        protected int ResolveStatusCode<T>(Result<T> result)
           => result.StatusCode ?? StatusCodes.Status400BadRequest;
    }
}
