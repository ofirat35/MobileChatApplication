using ChatApp.Core.Application.Consts;
using ChatApp.Core.Application.Extensions;
using ChatApp.Core.Application.Services;
using ChatApp.Core.Domain.Dtos.UserImages;
using ChatApp.Core.Domain.Models;
using ChatApp.Core.Helpers.Consts;
using ChatApp.Infrastructure.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Minio.Exceptions;

namespace ChatApp.Core.Application.Features.Queries.UserImages
{
    public class GetUserPicturesQueryHandler(IFileService fileService, ChatAppDbContext context)
       : BaseQueryHandler, IRequestHandler<GetUserPicturesRequestQuery, ResponseModel<List<UserImageListDto>>>
    {
        public async Task<ResponseModel<List<UserImageListDto>>> Handle(GetUserPicturesRequestQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var userImages = await context.UserImages
                    .Where(_ => _.AppUserId == request.UserId && _.IsValid)
                    .OrderByDescending(_ => _.IsProfilePicture)
                    .ThenBy(_ => _.CreatedDate)
                    .ToListAsync(cancellationToken);
                if (!userImages.Any()) ToFailResponseModel<UserImageListDto[]>(ExceptionMessages.EntityNotFound, StatusCodes.Status404NotFound);


                var images = userImages.Select(async (image) => new UserImageListDto
                {
                    AppUserId = image.AppUserId,
                    CreatedDate = image.CreatedDate,
                    Id = image.Id,
                    ImagePath = await fileService.GetPresignedUrl(MinioBucket.UserImages, image.ObjectName)
                });

                var result = (await Task.WhenAll(images)).ToList();

                return ToSuccessResponseModel(result);
            }
            catch (MinioException ex)
            {
                return ToFailResponseModel<List<UserImageListDto>>(ex.Message, StatusCodes.Status500InternalServerError);
            }
        }
    }

    public class GetUserPicturesRequestQuery : IRequest<ResponseModel<List<UserImageListDto>>>
    {
        public string UserId { get; set; }
    }
}
