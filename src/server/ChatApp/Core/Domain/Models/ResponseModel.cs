namespace ChatApp.Core.Domain.Models
{
    public class ResponseModel<T>
    {
        public int StatusCode { get; set; }
        public List<string> ErrorMessages { get; set; }
        public bool IsError { get; set; }
        public T? Data { get; set; }

        public static ResponseModel<T> Fail(string message, int statusCode)
            => new() { ErrorMessages = [message], StatusCode = statusCode, IsError = true, Data = default };

        public static ResponseModel<T> Fail(List<string> messages, int statusCode)
            => new() { ErrorMessages = messages, StatusCode = statusCode, IsError = true, Data = default };

        public static ResponseModel<T> Success(T data, int statusCode)
            => new() { StatusCode = statusCode, IsError = false, Data = data };
    }
}
