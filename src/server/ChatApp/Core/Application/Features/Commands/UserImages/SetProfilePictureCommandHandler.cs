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
    public class SetProfilePictureCommandHandler(IHttpContextAccessor httpContext, ChatAppDbContext context)
        : BaseQueryHandler, IRequestHandler<SetProfilePictureRequestCommand, ResponseModel<bool>>
    {
        public async Task<ResponseModel<bool>> Handle(SetProfilePictureRequestCommand request, CancellationToken cancellationToken)
        {
            var userId = httpContext.GetUserId();
            var userImages = await context.UserImages.Where(_ => _.AppUserId == userId && _.IsValid).ToListAsync();
            var imageToSet = userImages.FirstOrDefault(_ => _.Id == request.ImageId);
            if (!userImages.Any() || imageToSet is null) return ToFailResponseModel<bool>("File not found!", StatusCodes.Status404NotFound);

            userImages.Where(_ => _.IsProfilePicture).ToList().ForEach((userImage) => userImage.IsProfilePicture = false);
            imageToSet.IsProfilePicture = true;

            return await context.SaveChangesAsync() > 0
                 ? ToSuccessResponseModel(true, StatusCodes.Status200OK)
                 : ToFailResponseModel<bool>("Error while saving", StatusCodes.Status500InternalServerError);
        }
    }
}

public class SetProfilePictureRequestCommand : IRequest<ResponseModel<bool>>
{
    public Guid ImageId { get; set; }
}
