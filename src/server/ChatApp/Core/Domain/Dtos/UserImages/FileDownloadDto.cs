namespace ChatApp.Core.Domain.Dtos.UserImages
{
    public record FileDownloadDto(
      Stream Stream,
      string FileName,
      string ContentType
  );
}
