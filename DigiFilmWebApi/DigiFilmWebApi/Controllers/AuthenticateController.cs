using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using DigiFilmWebApi.BAL;
using DigiFilmWebApi.Modeli;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace DigiFilmWebApi.Controllers
{

    [ApiController]
    [Route("[controller]")]
    public class AuthenticateController : ControllerBase
    {
        private readonly UserService _userService;
        private readonly IConfiguration _configuration;
        private readonly UserRepositoryInterface _userRepositoryInterface;
        private readonly PasswordService _passwordService;

        public AuthenticateController(UserService userService, IConfiguration configuration, UserRepositoryInterface userRepositoryInterface, PasswordService passwordService)
        {
            _userService = userService;
            _configuration = configuration;
            _userRepositoryInterface = userRepositoryInterface;
            _passwordService = passwordService;
        }
        [HttpGet("ping")]
        [Authorize]
        public IActionResult Ping()
        {
            return Ok("Pong");
        }

        [HttpGet("login")]
        public IActionResult Login()
        {
            var redirectUri = Url.Action("PostLoginRedirect", "Authenticate", null, Request.Scheme);
            return Challenge(new AuthenticationProperties { RedirectUri = redirectUri },
                OpenIdConnectDefaults.AuthenticationScheme);
        }

        [Authorize]
        [HttpGet("post-login-redirect")]
        public IActionResult PostLoginRedirect()
        {
            // Set a test cookie for debugging
            Response.Cookies.Append("TestCookie", "TestValue", new CookieOptions
            {
                SameSite = SameSiteMode.None, // Required for cross-origin cookies
                Secure = true, // Ensure cookies are sent only over HTTPS
                HttpOnly = true, // Prevent access via JavaScript for security (optional)
                Path = "/", // Ensure it's available across the entire application
                Expires = DateTime.UtcNow.AddMinutes(30) // Set an expiration time (optional)
            });

            // Optional: Add logging for debugging purposes
            Console.WriteLine("Cookie set successfully in PostLoginRedirect");

            // Redirect the user to the frontend home page
            return Redirect("https://digi-film-react.vercel.app");
        }
        
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            Response.Headers.Add("Access-Control-Allow-Origin", "https://digi-film-react.vercel.app");
            Response.Headers.Add("Access-Control-Allow-Credentials", "true");
            return SignOut(new AuthenticationProperties { 
                    RedirectUri = "https://digi-film-react.vercel.app" 
            },
                OpenIdConnectDefaults.AuthenticationScheme, 
                CookieAuthenticationDefaults.AuthenticationScheme);
        }
        
        [Authorize]
        [HttpGet("claims")]
        public async Task<IActionResult> GetClaims()
        {
            
            if (!User.Identity.IsAuthenticated)
            {
                return Unauthorized(new
                {
                    Error = "User is not authenticated."
                });
            }
            
            var claims = User.Claims.Select(c => new { c.Type, c.Value }).ToList();
            return Ok(claims);
        }
        
        [HttpGet("set-test-cookie")]
        public IActionResult SetTestCookie()
        {
            Response.Cookies.Append("TestCookie", "TestValue", new CookieOptions
            {
                SameSite = SameSiteMode.None,
                Secure = true,
                HttpOnly = true
            });
            return Ok("Cookie Set!");
        }
        
        [Authorize]
        [HttpGet("all-roles")]
        public async Task<IActionResult> GetAllRoles()
        {
            var roles = await _userService.GetAllRolesAsync();

            return Ok(new {roles = roles, message = "Role uspješno dohvaćene." });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterNewEmployeeRequest request)
        {
            Console.WriteLine("Checking claims in Register endpoint:");

            foreach (var claim in User.Claims)
            {
                Console.WriteLine($"Claim Type: {claim.Type}, Claim Value: {claim.Value}");
            }

            var tenantIdClaim = User.FindFirst("TenantId");
            if (tenantIdClaim == null)
            {
                Console.WriteLine("TenantId claim is missing.");
                return Unauthorized("Tenant ne postoji.");
            }

            Console.WriteLine($"TenantId found: {tenantIdClaim.Value}");

            int tenantId = int.Parse(tenantIdClaim.Value);

            try
            {
                await _userService.RegisterNewEmployeeAsync(request, tenantId);
                return Ok(new { message = "Zaposlenik uspješno registriran." });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Dogodila se greška pri registraciji zaposlenika.", details = ex.Message });
            }
        }


        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken([FromBody] TokenRequest request)
        {
            var principal = GetPrincipalFromExpiredToken(request.AccessToken);
            var userId = principal.FindFirst(ClaimTypes.Name)?.Value;
        
            var user = await _userRepositoryInterface.GetUserByIdAsync(int.Parse(userId));
            if (user == null)
            {
                return Unauthorized();
            }
        
            var (storedHashedToken, expiryTime) = await _userRepositoryInterface.GetRefreshTokenWithExpiryAsync(user.Id);
        
            if (DateTime.UtcNow > expiryTime || !_passwordService.VerifyPassword(request.RefreshToken, storedHashedToken))
            {
                return Unauthorized();
            }
        
            var newAccessToken = GenerateJwtToken(user);
            var newRefreshTokenPlain = GenerateRefreshToken();
            var newRefreshTokenHashed = _passwordService.HashPassword(newRefreshTokenPlain);
        
            await _userRepositoryInterface.SaveRefreshTokenAsync(user.Id, newRefreshTokenHashed);
        
            return Ok(new { AccessToken = newAccessToken, RefreshToken = newRefreshTokenPlain, RoleID = user.RoleId });
        }
        
        private ClaimsPrincipal GetPrincipalFromExpiredToken(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Token:Key"]);
        
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = false,
                ValidateAudience = false,
                ValidateLifetime = false,
            };
        
            var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out SecurityToken securityToken);
            var jwtSecurityToken = securityToken as JwtSecurityToken;
        
            if (jwtSecurityToken == null || !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
            {
                throw new SecurityTokenException("Invalid token");
            }
        
            return principal;
        }

        private string GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Token:Key"]);
        
            var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, user.Id.ToString()),
            new Claim(ClaimTypes.Role, user.RoleId.ToString()),
            new Claim("TenantId", user.TenantId.ToString())
        };
        
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
                Issuer = _configuration["Token:Issuer"],
                Audience = _configuration["Token:Audience"]
            };
        
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        private string GenerateRefreshToken()
        {
            var randomNumber = new byte[32];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomNumber);
                return Convert.ToBase64String(randomNumber);
            }
        }
        
        [HttpOptions("{*path}")]
        public IActionResult Preflight()
        {
            Response.Headers.Add("Access-Control-Allow-Origin", "https://digi-film-react.vercel.app");
            Response.Headers.Add("Access-Control-Allow-Credentials", "true");
            Response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            Response.Headers.Add("Access-Control-Allow-Headers", "Authorization, Content-Type");
            return Ok();
        }

    }

}
