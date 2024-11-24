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
            policy.WithOrigins("http://localhost:5174", "https://digi-film-react-luka-kolacevics-projects.vercel.app")
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();  // Allow credentials (cookies, etc.)
        });

});

// Add Microsoft Identity platform (OpenID Connect) authentication
builder.Services.AddAuthentication(OpenIdConnectDefaults.AuthenticationScheme)
    .AddMicrosoftIdentityWebApp(builder.Configuration.GetSection("AzureAd"))
    .EnableTokenAcquisitionToCallDownstreamApi(initialScopes)
    .AddInMemoryTokenCaches();  // This helps store the token in-memory for later use

// Configure OpenID Connect Options
builder.Services.Configure<OpenIdConnectOptions>(OpenIdConnectDefaults.AuthenticationScheme, options =>
{
    options.SaveTokens = true;  // Ensures that the tokens are saved to the authentication properties
    options.Events.OnTokenValidated = async context =>
    {
       
        var userPrincipal = context.Principal;
        var userEmail = userPrincipal?.FindFirst("preferred_username")?.Value;
        
        Console.WriteLine("Claims in the token:");
        foreach (var claim in userPrincipal.Claims)
        {
            Console.WriteLine($"Claim Type: {claim.Type}, Claim Value: {claim.Value}");
        }

        if (userEmail != null)
        {
            // Get the user repository service to check if the user exists in your system
            var userRepository = context.HttpContext.RequestServices.GetRequiredService<UserRepository>();

            var user = await userRepository.GetUserByEmailAsync(userEmail);

            if (user == null)
            {
                // User not found in your system, log them out and fail authentication
                await context.HttpContext.SignOutAsync();
                context.Response.Redirect("https://digi-film-react-luka-kolacevics-projects.vercel.app");

            }
            else
            {
                // Add roles and additional claims to the identity
                var claimsIdentity = userPrincipal.Identity as ClaimsIdentity;
                claimsIdentity?.AddClaim(new Claim(ClaimTypes.Role, user.RoleId.ToString())); // Add Role
                claimsIdentity?.AddClaim(new Claim("TenantId", user.TenantId.ToString())); // Add TenantId
                
                // Optionally, print the claims for debugging purposes
                Console.WriteLine("User authenticated. Claims:");
                foreach (var claim in claimsIdentity?.Claims ?? Enumerable.Empty<Claim>())
                {
                    Console.WriteLine($"Type: {claim.Type}, Value: {claim.Value}");
                }
            }
        }
        else
        {
            context.Response.Redirect("https://digi-film-react-luka-kolacevics-projects.vercel.app");

        }
    };
});

// Add Razor Pages and MVC
builder.Services.AddRazorPages().AddMvcOptions(options =>
{
    // Ensure that all pages require authentication by default
    var policy = new AuthorizationPolicyBuilder()
                  .RequireAuthenticatedUser()
                  .Build();
    options.Filters.Add(new AuthorizeFilter(policy)); // Global authorization policy
}).AddMicrosoftIdentityUI(); // For login and logout UI handling by Microsoft Identity Web

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

// CORS middleware must be added before Authentication & Authorization

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

// Authentication and Authorization middlewares
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();

app.UseSwagger();
app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "API Docs"));

// Map Razor Pages and Controllers
app.MapRazorPages();
app.MapControllers();

// Start the application
app.Run();
