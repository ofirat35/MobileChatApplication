namespace ChatApp.Core.Domain.Models
{
    public class PaginationRequestModel
    {
        public int Page { get; set; } = 0;
        public int PageSize { get; set; } = 10;
    }
}
