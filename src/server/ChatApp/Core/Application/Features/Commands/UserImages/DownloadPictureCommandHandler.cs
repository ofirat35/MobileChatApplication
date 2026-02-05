using ChatApp.Core.Application.Services;
using ChatApp.Core.Domain.Dtos.UserImages;
using ChatApp.Core.Domain.Models;
using ChatApp.Core.Helpers.Consts;
using ChatApp.Infrastructure.Data;
using MediatR;
using Minio.Exceptions;

namespace ChatApp.Core.Application.Features.Commands.UserImages
{
    public class DownloadPictureCommandHandler(IFileService fileService, IHttpContextAccessor httpContext, ChatAppDbContext context)
        : BaseQueryHandler, IRequestHandler<DownloadPictureRequestCommand, ResponseModel<FileDownloadDto>>
    {
        public async Task<ResponseModel<FileDownloadDto>> Handle(DownloadPictureRequestCommand request, CancellationToken cancellationToken)
        {
            FileDownloadDto response;
            try
            {
                var userImage = context.UserImages.FirstOrDefault(_ => _.Id == request.Id);
                if (userImage is null) ToFailResponseModel<FileDownloadDto>("File not found!", StatusCodes.Status404NotFound);

                response = await fileService.DownloadFile(MinioBucket.UserImages, userImage.ObjectName);

                return response is null
                    ? ToFailResponseModel<FileDownloadDto>("File not found!", StatusCodes.Status404NotFound)
                    : ToSuccessResponseModel(response, 200);
            }
            catch (MinioException ex)
            {
                return ToFailResponseModel<FileDownloadDto>(ex.Message, StatusCodes.Status500InternalServerError);
            }
        }
    }

    public class DownloadPictureRequestCommand : IRequest<ResponseModel<FileDownloadDto>>
    {
        public Guid Id { get; set; }
    }
}
