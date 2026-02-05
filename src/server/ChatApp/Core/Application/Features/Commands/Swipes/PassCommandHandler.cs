using ChatApp.Core.Application.Services;
using ChatApp.Core.Domain.Models;
using MediatR;

namespace ChatApp.Core.Application.Features.Commands.Swipes
{
    public class PassCommandHandler(ISwiperService swiperService)
      : BaseQueryHandler, IRequestHandler<PassRequestCommand, ResponseModel<bool>>
    {
        public async Task<ResponseModel<bool>> Handle(PassRequestCommand request, CancellationToken cancellationToken)
        {
            var response = await swiperService.Pass(request.Id);
            if (!response.IsSuccess) return ToFailResponseModel<bool>(response.Error, response.StatusCode!.Value);

            return ToSuccessResponseModel(response.Value!, 201);
        }
    }

    public class PassRequestCommand : IRequest<ResponseModel<bool>>
    {
        public string Id { get; set; }
    }
}
