using FluentValidation;
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
                         context.Response.StatusCode = exceptionObject.Error switch
                         {
                             //BadRequestException ex => StatusCodes.Status400BadRequest,
                             //NotFoundException ex => StatusCodes.Status404NotFound,
                             //ForbiddenException ex => StatusCodes.Status403Forbidden,
                             ValidationException ex => StatusCodes.Status400BadRequest,
                             HttpRequestException ex => StatusCodes.Status400BadRequest,
                             _ => StatusCodes.Status500InternalServerError
                         };
                         var errorMessage = $"{exceptionObject.Error.Message}";
                         if (string.IsNullOrEmpty(errorMessage))
                             errorMessage = "An unexceptected error occurred! Please try again .";

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

