using ChatApp.Extensions;
using ChatApp.Infrastructure.Data;
using ChatApp.Middlewares;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddChatAppServices(builder.Configuration);

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    try
    {
        var db = scope.ServiceProvider.GetRequiredService<ChatAppDbContext>();
        await db.Database.MigrateAsync();
    }
    catch (Exception  ex)
    {
        Console.WriteLine(ex.Message);
    }

}


if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCustomExceptionHandling();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

//app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
