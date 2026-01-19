namespace ChatApp.Infrastructure.Helpers.TokenHandlers
{
    public class KeycloakUserTokenProvider() : ITokenProvider
    {
        public Task<string?> GetTokenAsync()
        {
            return Task.FromResult(string.Empty);
        }
    }

    public class KeycloakUserTokenHandler(KeycloakUserTokenProvider tokenProvider)
       : BearerTokenHandlerBase
    {
        protected async override Task<string?> GetTokenAsync()
            => await tokenProvider.GetTokenAsync();
    }
}
