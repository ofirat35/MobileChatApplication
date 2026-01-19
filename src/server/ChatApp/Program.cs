using ChatApp.Extensions;
using ChatApp.Middlewares;
using Keycloak.AuthServices.Authentication;
using Keycloak.AuthServices.Authorization;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddChatAppServices(builder.Configuration);
builder.Services.AddCors((options) =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});
builder.Services.AddKeycloakWebApiAuthentication(builder.Configuration, opt =>
{
    opt.RequireHttpsMetadata = false;
});

builder.Services.AddAuthorization(opt =>
{
    opt.AddPolicy("BasicUser", policy =>
    {
        policy.RequireResourceRoles("BasicUser");
    });
    opt.AddPolicy("PremiumUser", policy =>
    {
        policy.RequireResourceRoles("PremiumUser");
    });
    opt.AddPolicy("Admin", policy =>
    {
        policy.RequireResourceRoles("Admin");
    });
    opt.AddPolicy("SuperAdmin", policy =>
    {
        policy.RequireResourceRoles("SuperAdmin");
    });
}).AddKeycloakAuthorization(builder.Configuration);

var app = builder.Build();

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
