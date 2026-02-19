using ChatApp.Core.Application.Services;
using ChatApp.Core.Domain.Dtos.UserImages;
using Microsoft.Extensions.Options;
using Minio;
using Minio.DataModel.Args;
using Minio.DataModel.Response;
using Minio.Exceptions;

namespace ChatApp.Infrastructure.Services
{
    public class FileService(IOptions<Core.Domain.Dtos.MinioConfig> options) : IFileService
    {
        private readonly IMinioClient _internalMinioClient = new MinioClient()
                .WithEndpoint(options.Value.Endpoint)
                .WithCredentials(options.Value.AccessKey, options.Value.SecretKey)
                .Build();

        private readonly IMinioClient _publicMinioClient = new MinioClient()
               .WithEndpoint(options.Value.PublicEndpoint)
               .WithCredentials(options.Value.AccessKey, options.Value.SecretKey)
               .Build();

        public async Task<PutObjectResponse> UploadFileAsync(
            IFormFile file,
            string bucketName,
            string objectPath)
        {
            await using var stream = new MemoryStream();
            await file.CopyToAsync(stream);
            stream.Position = 0;

            try
            {
                var exists = await _internalMinioClient.BucketExistsAsync(new BucketExistsArgs().WithBucket(bucketName));
                if (!exists) await _internalMinioClient.MakeBucketAsync(new MakeBucketArgs().WithBucket(bucketName));

                var putObjectArgs = new PutObjectArgs()
                    .WithBucket(bucketName)
                    .WithObject(objectPath)
                    .WithStreamData(stream)
                    .WithObjectSize(stream.Length)
                    .WithContentType(file.ContentType);

                return await _internalMinioClient.PutObjectAsync(putObjectArgs);
            }
            catch (MinioException)
            {
                throw;
            }
        }

        public async Task<FileDownloadDto?> DownloadFile(string bucketName, string objectPath)
        {
            var memoryStream = new MemoryStream();

            try
            {
                var getObjectArgs = new GetObjectArgs()
                        .WithBucket(bucketName)
                        .WithObject(objectPath)
                        .WithCallbackStream(async (stream, ct) =>
                        {
                            await stream.CopyToAsync(memoryStream, ct);
                        });
                await _internalMinioClient.GetObjectAsync(getObjectArgs);

                memoryStream.Position = 0;

                var fileName = Path.GetFileName(objectPath);

                return new FileDownloadDto(
                    memoryStream,
                    fileName,
                    GetContentType(fileName)
                );
            }
            catch (MinioException)
            {
                await memoryStream.DisposeAsync();
                return null;
            }
        }

        public async Task<string> GetPresignedUrl(string bucketName, string objectPath)
        {
            var args = new PresignedGetObjectArgs()
                .WithBucket(bucketName)
                .WithObject(objectPath)
                .WithExpiry(3600);

            return await _publicMinioClient.PresignedGetObjectAsync(args);
        }

        string GetContentType(string fileName)
        {
            if (fileName.Contains(".jpg"))
            {
                return "image/jpg";
            }
            else if (fileName.Contains(".jpeg"))
            {
                return "image/jpeg";
            }
            else if (fileName.Contains(".png"))
            {
                return "image/png";
            }
            else if (fileName.Contains(".gif"))
            {
                return "image/gif";
            }
            else if (fileName.Contains(".pdf"))
            {
                return "application/pdf";
            }
            else
            {
                return "application/octet-stream";
            }
        }
    }
}
