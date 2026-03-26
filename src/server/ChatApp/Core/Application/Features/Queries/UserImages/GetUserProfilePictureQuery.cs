using ChatApp.Core.Application.Consts;
using ChatApp.Core.Application.Extensions;
using ChatApp.Core.Application.Services;
using ChatApp.Core.Domain.Dtos.UserImages;
using ChatApp.Core.Domain.Models;
using ChatApp.Core.Helpers.Consts;
using ChatApp.Infrastructure.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ChatApp.Core.Application.Features.Queries.UserImages
{
    public class GetUserProfilePictureQueryHandler(IFileService fileService, ChatAppDbContext context)
       : BaseQueryHandler, IRequestHandler<GetUserProfilePictureRequestQuery, ResponseModel<UserImageListDto>>
    {
        public async Task<ResponseModel<UserImageListDto>> Handle(GetUserProfilePictureRequestQuery request, CancellationToken cancellationToken)
        {
            var userImage = await context.UserImages.FirstOrDefaultAsync(_ => _.AppUserId == request.UserId && _.IsProfilePicture && _.IsValid);
            if (userImage is null) 
                return ToFailResponseModel<UserImageListDto>(ExceptionMessages.EntityNotFound, StatusCodes.Status404NotFound);

            var mappedImage = new UserImageListDto
            {
                AppUserId = userImage.AppUserId,
                CreatedDate = userImage.CreatedDate,
                Id = userImage.Id,
                ImagePath = await fileService.GetPresignedUrl(MinioBucket.UserImages, userImage.ObjectName)
            };

            return ToSuccessResponseModel(mappedImage);
        }
    }

    public class GetUserProfilePictureRequestQuery : IRequest<ResponseModel<UserImageListDto>>
    {
        public string UserId { get; set; }
    }
}
