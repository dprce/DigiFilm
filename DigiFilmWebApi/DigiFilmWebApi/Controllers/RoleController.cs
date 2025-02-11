﻿using DigiFilmWebApi.BAL;
using DigiFilmWebApi.Modeli;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DigiFilmWebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class RoleController : ControllerBase
    {
        private readonly RoleService _roleService;
        private readonly IConfiguration _configuration;
        //private readonly UserRepositoryInterface _userRepositoryInterface;
        //private readonly PasswordService _passwordService;
        public RoleController(RoleService roleService, IConfiguration configuration)
        {
          _roleService = roleService;
          _configuration = configuration;
        }

        [HttpGet("all-roles")]
        public async Task<IActionResult> GetAllRoles()
        {
            //if (!User.Identity.IsAuthenticated)
            //{
                // Return JSON response for unauthorized access
                //return Unauthorized(new
                //{
                    //Error = "User is not authenticated."
                //});
            //}
            
            var roles = await _roleService.GetAllRolesAsync();

            return Ok(new {roles = roles, message = "Role uspješno dohvaćene." });
        }
    }
}
