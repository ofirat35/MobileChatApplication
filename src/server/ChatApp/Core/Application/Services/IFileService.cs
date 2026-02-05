using ChatApp.Core.Domain.Dtos.UserImages;
using Minio.DataModel.Response;

namespace ChatApp.Core.Application.Services
{
    public interface IFileService
    {

        Task<PutObjectResponse> UploadFileAsync(IFormFile file, string bucketName, string objectPath);
        Task<FileDownloadDto> DownloadFile(string bucketName, string objectPath);
    }
}
