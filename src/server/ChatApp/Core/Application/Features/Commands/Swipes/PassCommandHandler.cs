using ChatApp.Core.Application.Services;
using ChatApp.Core.Domain.Models;
using MediatR;

namespace ChatApp.Core.Application.Features.Commands.Swipes
{
    public class PassCommandHandler(ISwiperService swiperService)
      : BaseCommandHandler, IRequestHandler<PassRequestCommand, ResponseModel<bool>>
    {
        public async Task<ResponseModel<bool>> Handle(PassRequestCommand request, CancellationToken cancellationToken)
        {
            var response = await swiperService.Pass(request.UserId);
            return response.IsSuccess
                ? ToSuccessResponseModel(response.Value, StatusCodes.Status201Created)
                : ToFailResponseModel<bool>(response.Error, response.StatusCode);
        }
    }

    public class PassRequestCommand : IRequest<ResponseModel<bool>>
    {
        public string UserId { get; set; }
    }
}
