namespace ChatApp.Core.Domain.Models
{
    public sealed class Result<T>
    {
        public bool IsSuccess { get; }
        public T? Value { get; }
        public string? Error { get; }
        public int? StatusCode { get; }

        private Result(bool isSuccess, T? value, string? error, int? statusCode = null)
        {
            IsSuccess = isSuccess;
            Value = value;
            Error = error;
            StatusCode = statusCode;
        }

        public static Result<T> Success(T value, int? statusCode = null)
            => new(true, value, null, statusCode);

        public static Result<T> Fail(string error, int? statusCode = null)
            => new(false, default, error, statusCode);

    }
}
