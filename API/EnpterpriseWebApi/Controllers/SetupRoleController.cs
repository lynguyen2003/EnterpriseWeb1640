using DataServices.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models.DTO;

namespace EnpterpriseWebApi.Controllers
{
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "Admin, MarketingCoordinator")]
    [Route("api/[controller]")]
    [ApiController]
    public class SetupRoleController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly UserManager<IdentityUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly ILogger<SetupRoleController> _logger;
        private string roleName;

        public SetupRoleController(DataContext context, 
                                   UserManager<IdentityUser> userManager,
                                   RoleManager<IdentityRole> roleManager,
                                   ILogger<SetupRoleController> logger)
        {
            _context = context;
            _userManager = userManager;
            _roleManager = roleManager;
            _logger = logger;
        }

        [HttpGet]
        public IActionResult GetAllRoles()
        {
            var roles = _roleManager.Roles.ToList();
            return Ok(roles);
        }

        [HttpPost]
        public async Task<IActionResult> CreateRole(string name)
        {
            // check exist role
            var roleExist = await _roleManager.RoleExistsAsync(name);

            if (!roleExist) // check role exist status
            {

                var roleResult = await _roleManager.CreateAsync(new IdentityRole(name));

                // check role has been added successfully
                if (roleResult.Succeeded)
                {
                    _logger.LogInformation($"The Role {name} has been added successfully!!");
                    return Ok(new
                    {
                        result = $"The role {name} has been added successfully!!"
                    });
                }
                else
                {
                    _logger.LogInformation($"The Role {name} has not been added!!!");
                    return BadRequest(new
                    {
                        error = $"The role {name} has not been added!!!"
                    });
                }
            }
            return BadRequest(new { error = "Role already exist!!!" });
        }

        [HttpGet("GetAllUsers")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userManager.Users.ToListAsync();
            return Ok(users);
        }

        [HttpPost("AddUserToRole")]
        public async Task<IActionResult> AddUserToRole(AddUserToRoleDTO model)
        {
            // check if user exist
            var user = await _userManager.FindByEmailAsync(model.Email);

            if (user == null) // user does not exist
            {
                _logger.LogInformation($"User does not exist!!!");
                return BadRequest(new
                {
                    error = "User does not exist!!!"
                });
            }

            // check if role exist
            var roleExist = await _roleManager.RoleExistsAsync(model.RoleName);

            if (!roleExist) // check role exist status
            {
                _logger.LogInformation($"Role does not exist!!!");
                return BadRequest(new
                {
                    error = "Role does not exist!!!"
                });
            }

            if (!string.IsNullOrEmpty(model.OldRoleName))
            {
                await _userManager.RemoveFromRoleAsync(user, model.OldRoleName);
            }

            // check if user assign to role success
            var result = await _userManager.AddToRoleAsync(user, model.RoleName);
            if (result.Succeeded)
            {
                return Ok(new
                {
                    result = "Success, user has been added to the role!!"
                });
            }
            else
            {
                _logger.LogInformation($"The user was not able to be added to the role!!!");
                return BadRequest(new
                {
                    error = "The user was not able to be added to the role!!!"
                });
            }
        }

        [HttpGet("GetUserRoles")]
        public async Task<IActionResult> GetUserRoles(string email)
        {
            // check if email valid
            var user = await _userManager.FindByEmailAsync(email);

            if (user == null) // user does not exist
            {
                _logger.LogInformation($"The user with the {email} does not exist!!!");
                return BadRequest(new
                {
                    error = "User does not exist!!!"
                });
            }

            // return the roles
            var roles = await _userManager.GetRolesAsync(user);

            return Ok(roles);
        }

        [HttpDelete("RemoveUserFromRole")]
        public async Task<IActionResult> RemoveUserFromRole(string email, string roleName)
        {
            var user = await _userManager.FindByEmailAsync(email);

            if (user == null) // user does not exist
            {
                _logger.LogInformation($"The user with the {email} does not exist!!!");
                return BadRequest(new
                {
                    error = "User does not exist!!!"
                });
            }

            // check if role exist
            var roleExist = await _roleManager.RoleExistsAsync(roleName);

            if (!roleExist) // check role exist status
            {
                _logger.LogInformation($"The role {roleName} does not exist!!!");
                return BadRequest(new
                {
                    error = "Role does not exist!!!"
                });
            }

            //remove
            var result = await _userManager.RemoveFromRoleAsync(user, roleName);

            if (result.Succeeded)
            {
                return Ok(new
                {
                    result = $"User {email} has been removed from role {roleName}"
                });
            }

            return BadRequest(new
            {
                error = $"Unable to remove User {email} from role {roleName}!!!"
            });
        }

    }
}
