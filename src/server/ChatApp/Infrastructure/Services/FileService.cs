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
        private readonly IMinioClient _minioClient = new MinioClient()
                .WithEndpoint(options.Value.Endpoint)
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
                var exists = await _minioClient.BucketExistsAsync(new BucketExistsArgs().WithBucket(bucketName));
                if (!exists) await _minioClient.MakeBucketAsync(new MakeBucketArgs().WithBucket(bucketName));

                var putObjectArgs = new PutObjectArgs()
                    .WithBucket(bucketName)
                    .WithObject(objectPath)
                    .WithStreamData(stream)
                    .WithObjectSize(stream.Length)
                    .WithContentType(file.ContentType);

                return await _minioClient.PutObjectAsync(putObjectArgs);
            }
            catch (MinioException)
            {
                throw; // keep original stack trace
            }
        }

        public async Task<FileDownloadDto?> DownloadFile(string bucketName, string objectPath)
        {
            var memoryStream = new MemoryStream();

            try
            {
                await _minioClient.StatObjectAsync(
                    new StatObjectArgs()
                        .WithBucket(bucketName)
                        .WithObject(objectPath)
                );

                await _minioClient.GetObjectAsync(
                    new GetObjectArgs()
                        .WithBucket(bucketName)
                        .WithObject(objectPath)
                        .WithCallbackStream(async stream =>
                        {
                            await stream.CopyToAsync(memoryStream);
                        })
                );

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
                memoryStream.Dispose();
                return null;
            }
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
