using Microsoft.AspNetCore.Diagnostics;
using System.Text.Json;

namespace ChatApp.Middlewares
{
    public static class ExceptionHandlingMiddleware
    {
        public static void UseCustomExceptionHandling(this WebApplication app)
        {
            app.UseExceptionHandler(
             options =>
             {
                 options.Run(async context =>
                 {
                     context.Response.ContentType = "application/json";
                     var exceptionObject = context.Features.Get<IExceptionHandlerFeature>();

                     if (exceptionObject != null)
                     {
                         var logger = app.Services.GetRequiredService<ILogger<Program>>();

                         var errorMessage = $"{exceptionObject.Error.Message}";
                         if (string.IsNullOrEmpty(errorMessage))
                             errorMessage = "An unexceptected error occurred!";

                         logger.LogError(
                            exceptionObject.Error,
                            "{ErrorMessage}. StatusCode: {StatusCode}, RequestPath: {Path}.",
                            errorMessage,
                            context.Response.StatusCode,
                            context.Request.Path
                            );

                         await context.Response
                             .WriteAsync(JsonSerializer.Serialize(new
                             {
                                 StatusCode = context.Response.StatusCode,
                                 ErrorMessage = errorMessage

                             }))
                             .ConfigureAwait(false);
                     }
                 });
             });
        }
    }
}

