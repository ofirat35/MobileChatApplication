using ChatApp.Core.Application.Services;
using ChatApp.Core.Domain.Entities;
using ChatApp.Core.Domain.Models;
using ChatApp.Core.Helpers.Consts;
using ChatApp.Extensions;
using ChatApp.Infrastructure.Data;
using MediatR;
using Minio.DataModel.Response;
using Minio.Exceptions;

namespace ChatApp.Core.Application.Features.Commands.UserImages
{
    public class UploadPictureCommandHandler(IFileService fileService, IHttpContextAccessor httpContext, ChatAppDbContext context)
        : BaseQueryHandler, IRequestHandler<UploadPictureRequestCommand, ResponseModel<PutObjectResponse>>
    {
        public async Task<ResponseModel<PutObjectResponse>> Handle(UploadPictureRequestCommand request, CancellationToken cancellationToken)
        {
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


                var objectPath = $"{httpContext.GetUserId()}/{Guid.NewGuid()}{extension}";
                response = await fileService.UploadFileAsync(request.File, MinioBucket.UserImages, objectPath);
                var image = new UserImage
                {
                    AppUserId = httpContext.GetUserId(),
                    Bucket = MinioBucket.UserImages,
                    ObjectName = response.ObjectName,
                    Size = response.Size,
                    CreatedAt = DateTime.Now
                };
                context.Add(image);
                await context.SaveChangesAsync(cancellationToken);
            }
            catch (MinioException ex)
            {
                return ToFailResponseModel<PutObjectResponse>(ex.Message, StatusCodes.Status500InternalServerError);
            }

            return ToSuccessResponseModel(response, 200);
        }
    }

    public class UploadPictureRequestCommand : IRequest<ResponseModel<PutObjectResponse>>
    {
        public IFormFile File { get; set; }
    }
}
