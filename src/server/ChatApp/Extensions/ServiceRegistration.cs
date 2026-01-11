using ChatApp.Core.Application.Services;
using ChatApp.Core.Domain.Dtos;
using ChatApp.Infrastructure.Services;

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
            services.Configure<KeycloakConfig>(configuration.GetSection("KeycloakConfig"));
            services.AddHttpClient("keycloak", client =>
            {
                client.BaseAddress = new Uri(configuration["KeycloakConfig:base_url"]!);
                client.Timeout = TimeSpan.FromSeconds(10);
            });

            services.AddMediatR(configuration => configuration.RegisterServicesFromAssemblyContaining<Program>());

            return services;
        }
    }
}
