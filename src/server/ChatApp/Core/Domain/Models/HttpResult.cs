namespace ChatApp.Core.Domain.Models
{
    public sealed class HttpResult<T>
    {
        public bool IsSuccess { get; init; }
        public int StatusCode { get; init; }
        public T? Data { get; init; }
        public string? ErrorMessage { get; init; }
    }
}
