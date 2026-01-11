using ChatApp.Extensions;
using ChatApp.Middlewares;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddChatAppServices(builder.Configuration);

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCustomExceptionHandling();
app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
