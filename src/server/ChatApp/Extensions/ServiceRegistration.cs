using ChatApp.Core.Application.Behaviours;
using ChatApp.Core.Application.Services;
using ChatApp.Core.Domain.Dtos;
using ChatApp.Infrastructure.Helpers.TokenHandlers;
using ChatApp.Infrastructure.Services;
using FluentValidation;

namespace ChatApp.Extensions
{
    public static class ServiceRegistration
    {
        public static IServiceCollection AddChatAppServices(
            this IServiceCollection services,
            IConfiguration configuration)
        {

            services.AddControllers();
            services.AddOpenApi();
            services.AddScoped<IAuthProvider, KeyCloakAuthProvider>();
            services.AddScoped<IUserService, UserService>();
            services.Configure<KeycloakConfig>(configuration.GetSection("KeycloakClientConfig"));
            services.AddHttpContextAccessor();

            services.AddHttpClient();
            services.AddTransient<KeycloakClientTokenProvider>();
            services.AddTransient<KeycloakPublicTokenProvider>();
            services.AddTransient<KeycloakUserTokenProvider>();

            services.AddScoped<KeycloakClientTokenHandler>();
            services.AddScoped<KeycloakPublicTokenHandler>();
            services.AddScoped<KeycloakUserTokenHandler>();
            services.AddHttpClient("keycloak_client",
                client => client.Timeout = TimeSpan.FromSeconds(20))
                .AddHttpMessageHandler<KeycloakClientTokenHandler>();
            services.AddHttpClient("keycloak_public",
                client => client.Timeout = TimeSpan.FromSeconds(20))
                .AddHttpMessageHandler<KeycloakPublicTokenHandler>();
            services.AddHttpClient("keycloak_user",
                client => client.Timeout = TimeSpan.FromSeconds(20))
                .AddHttpMessageHandler<KeycloakUserTokenHandler>();
            //.AddHttpMessageHandler<KeycloakClientTokenHandler>();

            services.AddValidatorsFromAssemblyContaining(typeof(Program));
            //services.AddAutoMapper(_ => { }, Assembly.GetExecutingAssembly());
            services.AddMediatR(cfg =>
            {
                cfg.RegisterServicesFromAssemblyContaining<Program>();
                cfg.AddOpenBehavior(typeof(ValidationBehaviour<,>));
            });


            return services;
        }
    }
}
