using System.Data.SqlClient;
using System.Data;
using Dapper;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.Identity.Web;
using Microsoft.Identity.Web.UI;
using System.Security.Claims;
using DigiFilmWebApi.BAL;
using DigiFilmWebApi.DAL;
using DigiFilmWebApi.Modeli;
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.HttpOverrides;

var builder = WebApplication.CreateBuilder(args);

// Define initial scopes for downstream API
IEnumerable<string>? initialScopes = builder.Configuration["DownstreamApi:Scopes"]?.Split(' ');

builder.Services.AddControllers();
builder.Services.AddMvcCore();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS Configuration
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("https://digi-film-react.vercel.app") // Exact frontend URL
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials()
                .WithExposedHeaders("Set-Cookie");
        });
});

// Add Microsoft Identity platform (OpenID Connect) authentication
builder.Services.AddAuthentication(OpenIdConnectDefaults.AuthenticationScheme)
    .AddMicrosoftIdentityWebApp(builder.Configuration.GetSection("AzureAd"))
    .EnableTokenAcquisitionToCallDownstreamApi(initialScopes)
    .AddInMemoryTokenCaches(); // Store token in-memory

// Configure OpenID Connect Options
builder.Services.Configure<OpenIdConnectOptions>(OpenIdConnectDefaults.AuthenticationScheme, options =>
{
    options.SaveTokens = false; // Save tokens to properties if needed
    options.Events.OnTokenValidated = async context =>
    {
        var claimsIdentity = context.Principal.Identity as ClaimsIdentity;
        
        var userPrincipal = context.Principal;
        var userEmail = userPrincipal?.FindFirst("preferred_username")?.Value;

        // Remove all existing claims
        if (claimsIdentity != null)
        {
            var claimsToRemove = claimsIdentity.Claims.ToList(); // Create a list of all claims
            foreach (var claim in claimsToRemove)
            {
                claimsIdentity.RemoveClaim(claim); // Remove each claim individually
            }
        }

        if (!string.IsNullOrEmpty(userEmail))
        {
            // Fetch the UserRepository service
            var userRepository = context.HttpContext.RequestServices.GetRequiredService<UserRepository>();
            var user = await userRepository.GetUserByEmailAsync(userEmail);

            if (user != null)
            {
                // Add only the necessary claims
                claimsIdentity?.AddClaim(new Claim("RoleId", user.RoleId.ToString()));
                claimsIdentity?.AddClaim(new Claim("TenantId", user.TenantId.ToString()));
            }
            else
            {
                // Redirect if user is not found
                context.Response.Redirect("https://digi-film-react.vercel.app");
                context.HandleResponse();
                return;
            }
        }
        else
        {
            // Redirect if no email claim is present
            context.Response.Redirect("https://digi-film-react.vercel.app");
            context.HandleResponse();
            return;
        }
    };

    // Configure cookies to handle cross-origin scenarios
    options.NonceCookie.SameSite = SameSiteMode.None;
    options.NonceCookie.SecurePolicy = CookieSecurePolicy.Always;
    options.CorrelationCookie.SameSite = SameSiteMode.None;
    options.CorrelationCookie.SecurePolicy = CookieSecurePolicy.Always;
});

builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.SameSite = SameSiteMode.None; // Allow cross-origin cookies
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always; // Enforce HTTPS
});

// Proxy/Load Balancer Configuration
builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
});

// Dependency Injection for services
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<UserRepositoryInterface, UserRepository>();
builder.Services.AddScoped<UserRepository>();
builder.Services.AddScoped<RoleRepositoryInterface, RoleRepository>();
builder.Services.AddScoped<RoleService>();
builder.Services.AddScoped<PasswordService>();
builder.Services.AddScoped<FilmService>();

// If you have a FilmRepository or FilmRepositoryInterface, register it as well
builder.Services.AddScoped<FilmRepositoryInterface, FilmRepository>();

// Dapper - SQL Database Connection
builder.Services.AddScoped<IDbConnection>(sp =>
    new SqlConnection(builder.Configuration.GetConnectionString("DigiFilmDatabase")));

// Add Swagger to services
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Middleware Setup

// Handle forwarded headers before anything else
app.UseForwardedHeaders();

// Redirect to HTTPS
app.UseHttpsRedirection();

// Ensure CORS is applied before authentication
app.UseCors("AllowFrontend");

// Ensure cookies are handled
app.UseCookiePolicy();

// Serve static files (if any)
app.UseStaticFiles();

// Enable routing
app.UseRouting();

// Authentication and Authorization
app.UseAuthentication();
app.UseAuthorization();

// Swagger UI
app.UseSwagger();
app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "API Docs"));

// Map controllers
app.MapControllers();

app.Run();
