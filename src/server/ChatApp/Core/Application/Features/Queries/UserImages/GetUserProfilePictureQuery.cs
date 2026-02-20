using ChatApp.Core.Application.Services;
using ChatApp.Core.Domain.Dtos.UserImages;
using ChatApp.Core.Domain.Models;
using ChatApp.Core.Helpers.Consts;
using ChatApp.Extensions;
using ChatApp.Infrastructure.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Minio.Exceptions;

namespace ChatApp.Core.Application.Features.Queries.UserImages
{
    public class GetUserProfilePictureQueryHandler(IFileService fileService, ChatAppDbContext context)
       : BaseQueryHandler, IRequestHandler<GetUserProfilePictureRequestQuery, ResponseModel<UserImageListDto>>
    {
        public async Task<ResponseModel<UserImageListDto>> Handle(GetUserProfilePictureRequestQuery request, CancellationToken cancellationToken)
        {
            var userImage = await context.UserImages.FirstOrDefaultAsync(_ => _.AppUserId == request.UserId && _.IsProfilePicture && _.IsValid);
            if (userImage is null) return ToFailResponseModel<UserImageListDto>("File not found!", StatusCodes.Status404NotFound);

            var mappedImage = new UserImageListDto
            {
                AppUserId = userImage.AppUserId,
                CreatedAt = userImage.CreatedAt,
                Id = userImage.Id,
                ImagePath = await fileService.GetPresignedUrl(MinioBucket.UserImages, userImage.ObjectName)
            };

            return ToSuccessResponseModel(mappedImage, StatusCodes.Status200OK);
        }
    }

    public class GetUserProfilePictureRequestQuery : IRequest<ResponseModel<UserImageListDto>>
    {
        public string UserId { get; set; }
    }
}
