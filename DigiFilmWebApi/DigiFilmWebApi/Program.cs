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
using Microsoft.AspNetCore.Authentication;
using Microsoft.OpenApi.Models;

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
            policy.WithOrigins("http://localhost:5173")
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials(); // Allow credentials (cookies, etc.)
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
    options.SaveTokens = true; // Save tokens to properties
    options.Events.OnTokenValidated = async context =>
    {
        var userPrincipal = context.Principal;
        var userEmail = userPrincipal?.FindFirst("preferred_username")?.Value;

        if (userEmail != null)
        {
            // Fetch the UserRepository service
            var userRepository = context.HttpContext.RequestServices.GetRequiredService<UserRepository>();

            // Check if user exists in the database
            var user = await userRepository.GetUserByEmailAsync(userEmail);

            if (user == null)
            {
                // User not found, redirect to registration or error page
                context.Response.Redirect($"http://localhost:5173/");
                context.HandleResponse(); // Stop further processing
                return;
            }
            else
            {
                // Add claims (Role, TenantId) if the user is authorized
                var claimsIdentity = userPrincipal.Identity as ClaimsIdentity;
                claimsIdentity?.AddClaim(new Claim(ClaimTypes.Role, user.RoleId.ToString()));
                claimsIdentity?.AddClaim(new Claim("TenantId", user.TenantId.ToString()));
            }
        }
        else
        {
            // No email claim, redirect to error page
            context.Response.Redirect("http://localhost:5173/");
            context.HandleResponse();
            return;
        }
    };
});

// Add Razor Pages and MVC
builder.Services.AddRazorPages().AddMvcOptions(options =>
{
    var policy = new AuthorizationPolicyBuilder()
        .RequireAuthenticatedUser()
        .Build();
    options.Filters.Add(new AuthorizeFilter(policy)); // Global authorization policy
}).AddMicrosoftIdentityUI(); // For Microsoft Identity UI handling

// Dependency Injection for services
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<UserRepositoryInterface, UserRepository>();
builder.Services.AddScoped<UserRepository>();
builder.Services.AddScoped<RoleRepositoryInterface, RoleRepository>();
builder.Services.AddScoped<RoleService>();
builder.Services.AddScoped<PasswordService>();

// Dapper - SQL Database Connection
builder.Services.AddScoped<IDbConnection>(sp =>
    new SqlConnection(builder.Configuration.GetConnectionString("DigiFilmDatabase")));

// Add Swagger to services
builder.Services.AddSwaggerGen();

// Build the application
var app = builder.Build();

// Middleware Setup
app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();

app.UseSwagger();
app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "API Docs"));

// Map Razor Pages and Controllers
app.MapRazorPages();
app.MapControllers();

app.Run();
