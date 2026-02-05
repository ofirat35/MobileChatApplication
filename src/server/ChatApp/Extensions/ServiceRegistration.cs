using ChatApp.Core.Application.Behaviours;
using ChatApp.Core.Application.Services;
using ChatApp.Core.Domain.Dtos;
using ChatApp.Infrastructure.Data;
using ChatApp.Infrastructure.Helpers.TokenHandlers;
using ChatApp.Infrastructure.Services;
using FluentValidation;
using Keycloak.AuthServices.Authentication;
using Keycloak.AuthServices.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Options;
using System.Reflection;

namespace ChatApp.Extensions
{
    public static class ServiceRegistration
    {
        public static IServiceCollection AddChatAppServices(
            this IServiceCollection services,
            IConfiguration configuration)
        {

            var registrations = AppDomain.CurrentDomain.GetAssemblies()
                .Where(a => a.FullName!.StartsWith("ChatApp"))
                .SelectMany(a => a.GetTypes())
                .Where(t =>
                    t.IsClass &&
                    !t.IsAbstract &&
                    t.Namespace != null &&
                    t.Name.EndsWith("Service"))
                .SelectMany(t => t.GetInterfaces()
                    .Where(i => i.Name == $"I{t.Name}")
                    .Select(i => new
                    {
                        Service = i,
                        Implementation = t
                    }));
            foreach (var registration in registrations)
            {
                services.TryAddScoped(registration.Service, registration.Implementation);
            }
            //Manuel DI's
            services.AddScoped<IAppCacheService, InMemoryCacheService>();

            services.AddControllers();
            services.AddOpenApi();

            services.AddMemoryCache();
            services.AddCors((options) =>
            {
                options.AddDefaultPolicy(policy =>
                {
                    policy.AllowAnyOrigin()
                          .AllowAnyHeader()
                          .AllowAnyMethod();
                });
            });
            services.AddKeycloakWebApiAuthentication(configuration, opt =>
            {
                opt.RequireHttpsMetadata = false;
                opt.TokenValidationParameters.ValidIssuer = "http://localhost:8080/realms/ChatApp";
                opt.TokenValidationParameters.ValidateIssuer = true;
            });


            services.AddDbContext<ChatAppDbContext>(opt =>
            {
                opt.UseSqlServer(configuration.GetConnectionString("SqlConnectionString"));
            });



            services.Configure<KeycloakConfig>(configuration.GetSection("KeycloakClientConfig"));
            services.Configure<MinioConfig>(configuration.GetSection("MinioConfig"));
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
            services.AddAutoMapper(_ => { }, Assembly.GetExecutingAssembly());
            services.AddMediatR(cfg =>
            {
                cfg.RegisterServicesFromAssemblyContaining<Program>();
                cfg.AddOpenBehavior(typeof(ValidationBehaviour<,>));
            });
            //    opt =>
            //{
            //    opt.AddPolicy("BasicUser", policy =>
            //    {
            //        policy.RequireResourceRoles("BasicUser");
            //    });
            //    opt.AddPolicy("PremiumUser", policy =>
            //    {
            //        policy.RequireResourceRoles("PremiumUser");
            //    });
            //    opt.AddPolicy("Admin", policy =>
            //    {
            //        policy.RequireResourceRoles("Admin");
            //    });
            //    opt.AddPolicy("SuperAdmin", policy =>
            //    {
            //        policy.RequireResourceRoles("SuperAdmin");
            //    });
            services.AddAuthorization().AddKeycloakAuthorization(configuration);

            return services;
        }
    }
}
