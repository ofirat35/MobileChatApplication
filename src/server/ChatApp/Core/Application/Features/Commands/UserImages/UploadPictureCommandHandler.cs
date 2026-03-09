using ChatApp.Core.Application.Services;
using ChatApp.Core.Domain.Dtos.UserImages;
using ChatApp.Core.Domain.Entities;
using ChatApp.Core.Domain.Models;
using ChatApp.Core.Helpers.Consts;
using ChatApp.Extensions;
using ChatApp.Infrastructure.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Minio.DataModel.Response;
using Minio.Exceptions;

namespace ChatApp.Core.Application.Features.Commands.UserImages
{
    public class UploadPictureCommandHandler(IFileService fileService, IHttpContextAccessor httpContext, ChatAppDbContext context)
        : BaseQueryHandler, IRequestHandler<UploadPictureRequestCommand, ResponseModel<UserImageListDto>>
    {
        public async Task<ResponseModel<UserImageListDto>> Handle(UploadPictureRequestCommand request, CancellationToken cancellationToken)
        {
            var userId = httpContext.GetUserId();
            PutObjectResponse response;
            try
            {
                var extension = request.File.ContentType switch
                {
                    "image/jpeg" => ".jpg",
                    "image/png" => ".png",
                    "image/webp" => ".webp",
                    _ => throw new InvalidOperationException("Unsupported file type")
                };
                var allowed = new[] { ".jpg", ".jpeg", ".png", ".webp" };
                if (!allowed.Contains(extension))
                    throw new InvalidOperationException("Unsupported file type");


                var objectPath = $"{userId}/{Guid.NewGuid()}{extension}";
                response = await fileService.UploadFileAsync(request.File, MinioBucket.UserImages, objectPath);
                var image = new UserImage
                {
                    AppUserId = userId,
                    Bucket = MinioBucket.UserImages,
                    ObjectName = response.ObjectName,
                    Size = response.Size,
                    CreatedAt = DateTime.Now,
                    IsProfilePicture = !(await context.UserImages.AnyAsync(_ => _.AppUserId == userId && _.IsValid && _.IsProfilePicture)),
                    IsValid = true
                };
                context.Add(image);
                await context.SaveChangesAsync(cancellationToken);

                return ToSuccessResponseModel(
                    new UserImageListDto
                    {
                        AppUserId = image.AppUserId,
                        CreatedAt = image.CreatedAt,
                        Id = image.Id,
                        ImagePath = await fileService.GetPresignedUrl(MinioBucket.UserImages, image.ObjectName)
                    }, 200);
            }
            catch (MinioException ex)
            {
                return ToFailResponseModel<UserImageListDto>(ex.Message, StatusCodes.Status500InternalServerError);
            }
        }
    }

    public class UploadPictureRequestCommand : IRequest<ResponseModel<UserImageListDto>>
    {
        public IFormFile File { get; set; }
    }
}
