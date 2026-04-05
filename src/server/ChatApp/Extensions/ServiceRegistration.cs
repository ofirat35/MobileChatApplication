using ChatApp.Core.Application.Behaviours;
using ChatApp.Core.Application.Services;
using ChatApp.Core.Domain.Dtos;
using ChatApp.Infrastructure.Data;
using ChatApp.Infrastructure.Helpers.TokenHandlers;
using ChatApp.Infrastructure.Services;
using FluentValidation;
using Keycloak.AuthServices.Authentication;
using Keycloak.AuthServices.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection.Extensions;
using System.Reflection;

namespace ChatApp.Extensions
{
    public static class ServiceRegistration
    {
        public static IServiceCollection AddChatAppServices(
            this IServiceCollection services,
            IConfiguration configuration)
        {
            services.AddSignalR(options =>
            {
                options.KeepAliveInterval = TimeSpan.FromSeconds(15);
                options.ClientTimeoutInterval = TimeSpan.FromSeconds(30);
            });
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
                opt.TokenValidationParameters.ValidIssuers = [
                        "http://localhost:8080/realms/ChatApp",
                        "http://10.0.2.2:8080/realms/ChatApp"
                    ];
                opt.TokenValidationParameters.ValidateIssuer = true;

                opt.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        var accessToken = context.Request.Query["access_token"];

                        var path = context.HttpContext.Request.Path;

                        if (!string.IsNullOrEmpty(accessToken) &&
                            path.StartsWithSegments("/hubs"))
                        {
                            context.Token = accessToken;
                        }

                        return Task.CompletedTask;
                    }
                };
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
            services.AddTransient<KeycloakUserTokenProvider>();

            services.AddScoped<KeycloakClientTokenHandler>();
            services.AddScoped<KeycloakUserTokenHandler>();
            services.AddHttpClient("keycloak_client",
                client => client.Timeout = TimeSpan.FromSeconds(20))
                .AddHttpMessageHandler<KeycloakClientTokenHandler>();
            services.AddHttpClient("keycloak_user",
                client => client.Timeout = TimeSpan.FromSeconds(20))
                .AddHttpMessageHandler<KeycloakUserTokenHandler>();

            services.AddValidatorsFromAssemblyContaining(typeof(Program));
            services.AddAutoMapper(_ => { }, Assembly.GetExecutingAssembly());
            services.AddMediatR(cfg =>
            {
                cfg.RegisterServicesFromAssemblyContaining<Program>();
                cfg.AddOpenBehavior(typeof(ValidationBehaviour<,>));
            });

            services.AddAuthorization(opt =>
            {
                opt.AddPolicy("BasicUser", policy =>
                {
                    policy.RequireResourceRoles("basic_user", "premium_user");
                });
                opt.AddPolicy("PremiumUser", policy =>
                {
                    policy.RequireResourceRoles("premium_user");
                });
                opt.AddPolicy("Admin", policy =>
                {
                    policy.RequireRealmRoles("admin_user", "superadmin_user");
                });
                opt.AddPolicy("SuperAdmin", policy =>
                {
                    policy.RequireRealmRoles("superadmin_user");
                });
            }).AddKeycloakAuthorization(configuration);

            return services;
        }
    }
}
