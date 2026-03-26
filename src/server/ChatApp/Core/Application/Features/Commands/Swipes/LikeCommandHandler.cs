using ChatApp.Core.Application.Services;
using ChatApp.Core.Domain.Models;
using MediatR;

namespace ChatApp.Core.Application.Features.Commands.Swipes
{
    public class LikeCommandHandler(ISwiperService swiperService)
      : BaseCommandHandler, IRequestHandler<LikeRequestCommand, ResponseModel<bool>>
    {
        public async Task<ResponseModel<bool>> Handle(LikeRequestCommand request, CancellationToken cancellationToken)
        {
            var response = await swiperService.Like(request.UserId);
            return response.IsSuccess
                ? ToSuccessResponseModel(response.Value, StatusCodes.Status201Created)
                : ToFailResponseModel<bool>(response.Error, response.StatusCode);

        }
    }

    public class LikeRequestCommand : IRequest<ResponseModel<bool>>
    {
        public string UserId { get; set; }
    }
}
