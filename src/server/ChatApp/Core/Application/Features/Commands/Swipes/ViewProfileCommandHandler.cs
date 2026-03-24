using ChatApp.Core.Application.Services;
using ChatApp.Core.Domain.Models;
using MediatR;

namespace ChatApp.Core.Application.Features.Commands.Swipes
{
    public class ViewProfileCommandHandler(ISwiperService swiperService)
      : BaseCommandHandler, IRequestHandler<ViewProfileRequestCommand, ResponseModel<bool>>
    {
        public async Task<ResponseModel<bool>> Handle(ViewProfileRequestCommand request, CancellationToken cancellationToken)
        {
            var response = await swiperService.ViewProfile(request.UserId);
            if (!response.IsSuccess) return ToFailResponseModel<bool>(response.Error, response.StatusCode!.Value);

            return ToSuccessResponseModel(response.Value!, StatusCodes.Status201Created);
        }
    }

    public class ViewProfileRequestCommand : IRequest<ResponseModel<bool>>
    {
        public string UserId { get; set; }
    }
}
