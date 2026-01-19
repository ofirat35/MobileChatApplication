namespace ChatApp.Infrastructure.Helpers.TokenHandlers
{
    public class KeycloakPublicTokenProvider() : ITokenProvider
    {

        public Task<string?> GetTokenAsync()
        {
            return Task.FromResult(string.Empty);
        }
    }

    public class KeycloakPublicTokenHandler(KeycloakPublicTokenProvider tokenProvider)
              : BearerTokenHandlerBase
    {
        protected async override Task<string?> GetTokenAsync()
            => await tokenProvider.GetTokenAsync();
    }
}
