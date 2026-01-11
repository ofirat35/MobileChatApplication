using ChatApp.Core.Domain.Models;
using MediatR;

namespace ChatApp.Core.Application.Features.Commands
{
    public class BaseCommandHandler<TRequest, TResponse> where TRequest : IRequest<TResponse>
    {
        public ResponseModel<TResp> ToSuccessResponseModel<TResp>(TResp data, int statusCode)
        {
            return ResponseModel<TResp>.Success(data, statusCode);
        }

        public ResponseModel<TResp> ToFailResponseModel<TResp>(string errorMessage, int statusCode)
        {
            return ResponseModel<TResp>.Fail(errorMessage, statusCode);
        }
    }
}
