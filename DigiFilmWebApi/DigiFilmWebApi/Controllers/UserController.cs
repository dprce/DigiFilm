using DigiFilmWebApi.BAL;
using DigiFilmWebApi.Modeli;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DigiFilmWebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly UserService _userService;
        private readonly IConfiguration _configuration;
        //private readonly UserRepositoryInterface _userRepositoryInterface;
        //private readonly PasswordService _passwordService;
        public UserController(UserService userService, IConfiguration configuration)
        {
            _userService = userService;
            _configuration = configuration;
        }

        [HttpGet("all-users")]
        public async Task<IActionResult> GetAllUsers()
        {
            //if (!User.Identity.IsAuthenticated)
            //{
                // Return JSON response for unauthorized access
                //return Unauthorized(new
                //{
                    //Error = "User is not authenticated."
                //});
            //}
            
            var users = await _userService.GetAllUsersAsync();

            return Ok(new {users = users, message = "Korisnici uspješno dohvaćeni." });
        }
    }
}