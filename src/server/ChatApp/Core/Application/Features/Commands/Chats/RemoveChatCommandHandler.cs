using ChatApp.Core.Application.Services;
using ChatApp.Core.Domain.Models;
using ChatApp.Extensions;
using MediatR;

namespace ChatApp.Core.Application.Features.Commands.Chats
{
    public class RemoveChatCommandHandler(
        IMatchService matchService,
        ISwiperService swiperService,
        IHttpContextAccessor httContext)
        : BaseCommandHandler, IRequestHandler<RemoveChatRequestCommand, ResponseModel<bool>>
    {
        public async Task<ResponseModel<bool>> Handle(RemoveChatRequestCommand request, CancellationToken cancellationToken)
        {
            var matchResult = await matchService.RemoveMatchAsync(request.UserId);
            if (!matchResult.IsSuccess) return ToFailResponseModel<bool>(matchResult.Error, matchResult.StatusCode);


            var swipeResult = await swiperService.RemoveSwipesAsync(httContext.GetUserId(), request.UserId);
            if (!swipeResult.IsSuccess) return ToFailResponseModel<bool>(swipeResult.Error, swipeResult.StatusCode);

            return ToSuccessResponseModel(true, StatusCodes.Status200OK);
        }
    }

    public class RemoveChatRequestCommand : IRequest<ResponseModel<bool>>
    {
        public string UserId { get; set; }
    }
}
