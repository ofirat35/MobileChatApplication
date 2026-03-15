using ChatApp.Core.Application.Services;
using ChatApp.Core.Domain.Dtos.UserImages;
using ChatApp.Core.Domain.Entities;
using ChatApp.Core.Domain.Models;
using ChatApp.Core.Helpers.Consts;
using ChatApp.Extensions;
using ChatApp.Infrastructure.Data;
using ChatApp.Infrastructure.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;
using Minio.DataModel.Response;
using Minio.Exceptions;

namespace ChatApp.Core.Application.Features.Commands.UserImages
{
    public class DeletePictureCommandHandler(IFileService fileService, IHttpContextAccessor httpContext, ChatAppDbContext context)
        : BaseQueryHandler, IRequestHandler<DeletePictureRequestCommand, ResponseModel<bool>>
    {
        public async Task<ResponseModel<bool>> Handle(DeletePictureRequestCommand request, CancellationToken cancellationToken)
        {
            var userId = httpContext.GetUserId();
            var file = await context.UserImages.FirstOrDefaultAsync(_ => _.Id == request.Id && _.AppUserId == userId && _.IsValid);
            if (file is null) return ToFailResponseModel<bool>("File not found!", StatusCodes.Status404NotFound);

            file.IsValid = false;
            await context.SaveChangesAsync(cancellationToken);
            await UpdateProfilePictureAsync(userId);
            var response = await fileService.DeleteFileAsync(file.Bucket, file.ObjectName);

            return response
                ? ToSuccessResponseModel(true, 200)
                : ToFailResponseModel<bool>("Unexpected error occured", StatusCodes.Status500InternalServerError);
        }

        public async Task<bool> UpdateProfilePictureAsync(string userId)
        {
            var profilePictureExists = await context.UserImages
                .AnyAsync(_ => _.AppUserId == userId && _.IsValid && _.IsProfilePicture);

            if (profilePictureExists) return true;

            var latestPicture = await context.UserImages
                .OrderByDescending(_ => _.CreatedAt)
                .FirstOrDefaultAsync(_ => _.AppUserId == userId && _.IsValid);

            if (latestPicture != null)
            {
                latestPicture.IsProfilePicture = true;
                await context.SaveChangesAsync();
            }

            return false;
        }
    }

    public class DeletePictureRequestCommand : IRequest<ResponseModel<bool>>
    {
        public Guid Id { get; set; }
    }
}
