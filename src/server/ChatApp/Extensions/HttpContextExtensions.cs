using System.Security.Claims;

namespace ChatApp.Extensions
{
    public static class HttpContextExtensions
    {
        public static string GetUserId(this IHttpContextAccessor context)
        {
            if (context.HttpContext is null || !context.HttpContext.User.Identity.IsAuthenticated) throw new Exception("Error with user authentication!");

            return context.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value ??
                context.HttpContext.User.FindFirst("sub")?.Value;
        }
    }
}
