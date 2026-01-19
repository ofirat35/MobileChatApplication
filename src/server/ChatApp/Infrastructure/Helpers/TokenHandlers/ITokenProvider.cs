namespace ChatApp.Infrastructure.Helpers.TokenHandlers
{
    public interface ITokenProvider
    {
        Task<string?> GetTokenAsync();
    }
}
