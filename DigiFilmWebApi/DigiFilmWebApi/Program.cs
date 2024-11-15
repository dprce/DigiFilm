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

var builder = WebApplication.CreateBuilder(args);

// Define initial scopes for downstream API
IEnumerable<string>? initialScopes = builder.Configuration["DownstreamApi:Scopes"]?.Split(' ');

// Add Microsoft Identity platform (OpenID Connect) authentication
builder.Services.AddAuthentication(OpenIdConnectDefaults.AuthenticationScheme)
    .AddMicrosoftIdentityWebApp(builder.Configuration.GetSection("AzureAd"))
    .EnableTokenAcquisitionToCallDownstreamApi(initialScopes)
    .AddInMemoryTokenCaches();

builder.Services.Configure<OpenIdConnectOptions>(OpenIdConnectDefaults.AuthenticationScheme, options =>
{
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
            var userRepository = context.HttpContext.RequestServices.GetRequiredService<UserRepository>();

            var user = await userRepository.GetUserByEmailAsync(userEmail);

            if (user == null)
            {
                await context.HttpContext.SignOutAsync();
                context.Fail("User does not exist in the system.");
            }
            else
            {
                var claimsIdentity = userPrincipal.Identity as ClaimsIdentity;
                claimsIdentity?.AddClaim(new Claim(ClaimTypes.Role, user.RoleId.ToString()));
                claimsIdentity?.AddClaim(new Claim("TenantId", user.TenantId.ToString()));
                Console.WriteLine("User authenticated. Claims:");
                foreach (var claim in claimsIdentity?.Claims ?? Enumerable.Empty<Claim>())
                {
                    Console.WriteLine($"Type: {claim.Type}, Value: {claim.Value}");
                }
            }
        }
    };
});

builder.Services.AddRazorPages().AddMvcOptions(options =>
{
    var policy = new AuthorizationPolicyBuilder()
                  .RequireAuthenticatedUser()
                  .Build();
    options.Filters.Add(new AuthorizeFilter(policy));
}).AddMicrosoftIdentityUI();

builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<UserRepositoryInterface, UserRepository>(); 
builder.Services.AddScoped<UserRepository>(); 
builder.Services.AddScoped<RoleRepositoryInterface, RoleRepository>();
builder.Services.AddScoped<PasswordService>();
builder.Services.AddScoped<IDbConnection>(sp =>
    new SqlConnection(builder.Configuration.GetConnectionString("DigiFilmDatabase")));

var app = builder.Build();

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapRazorPages();
app.MapControllers();

app.Run();
