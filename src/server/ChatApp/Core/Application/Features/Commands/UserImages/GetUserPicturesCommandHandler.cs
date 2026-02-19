using ChatApp.Core.Application.Services;
using ChatApp.Core.Domain.Dtos.UserImages;
using ChatApp.Core.Domain.Models;
using ChatApp.Core.Helpers.Consts;
using ChatApp.Infrastructure.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Minio.Exceptions;

namespace ChatApp.Core.Application.Features.Commands.UserImages
{
    public class GetUserPicturesCommandHandler(IFileService fileService, ChatAppDbContext context)
       : BaseQueryHandler, IRequestHandler<GetUserPicturesRequestCommand, ResponseModel<List<UserImageListDto>>>
    {
        public async Task<ResponseModel<List<UserImageListDto>>> Handle(GetUserPicturesRequestCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var userImages = await context.UserImages.Where(_ => _.AppUserId == request.UserId).ToListAsync(cancellationToken);
                if (!userImages.Any()) ToFailResponseModel<UserImageListDto[]>("File not found!", StatusCodes.Status404NotFound);


                var images = userImages.Select(async (image) => new UserImageListDto
                {
                    AppUserId = image.AppUserId,
                    CreatedAt = image.CreatedAt,
                    Id = image.Id,
                    ImagePath = await fileService.GetPresignedUrl(MinioBucket.UserImages, image.ObjectName)
                });

                var result = (await Task.WhenAll(images)).ToList();

                return ToSuccessResponseModel(result, StatusCodes.Status200OK);
            }
            catch (MinioException ex)
            {
                return ToFailResponseModel<List<UserImageListDto>>(ex.Message, StatusCodes.Status500InternalServerError);
            }
        }
    }

    public class GetUserPicturesRequestCommand : IRequest<ResponseModel<List<UserImageListDto>>>
    {
        public string UserId { get; set; }
    }
}
