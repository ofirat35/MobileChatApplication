using AutoMapper;
using ChatApp.Core.Domain.Dtos.UserImages;
using ChatApp.Core.Domain.Models;
using ChatApp.Extensions;
using ChatApp.Infrastructure.Data;
using MediatR;

namespace ChatApp.Core.Application.Features.Commands.UserImages
{
    public class GetUserPicturesCommandHandler(
        IHttpContextAccessor httpContext,
        IMapper mapper,
        ChatAppDbContext context)
        : BaseQueryHandler, IRequestHandler<GetUserPicturesRequestCommand, ResponseModel<List<UserImageListDto>>>
    {
        public async Task<ResponseModel<List<UserImageListDto>>> Handle(GetUserPicturesRequestCommand request, CancellationToken cancellationToken)
        {
            var userImages = context.UserImages.Where(_ => _.AppUserId == httpContext.GetUserId());
            var response = mapper.Map<List<UserImageListDto>>(userImages);

            return ToSuccessResponseModel(response, 200);
        }
    }

    public class GetUserPicturesRequestCommand : IRequest<ResponseModel<List<UserImageListDto>>>
    {
    }
}
