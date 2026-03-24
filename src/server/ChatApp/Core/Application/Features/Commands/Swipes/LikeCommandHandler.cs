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
            if (!response.IsSuccess) return ToFailResponseModel<bool>(response.Error, response.StatusCode!.Value);

            return ToSuccessResponseModel(response.Value!, StatusCodes.Status201Created);
        }
    }

    public class LikeRequestCommand : IRequest<ResponseModel<bool>>
    {
        public string UserId { get; set; }
    }
}
