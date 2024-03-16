using DataServices.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EnpterpriseWebApi.Controllers
{
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "Admin")]
    [Route("api/[controller]")]
    [ApiController]
    public class ClaimsSetupController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly UserManager<IdentityUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly ILogger<ClaimsSetupController> _logger;

        public ClaimsSetupController(DataContext context,
                                   UserManager<IdentityUser> userManager,
                                   RoleManager<IdentityRole> roleManager,
                                   ILogger<ClaimsSetupController> logger)
        {
            _context = context;
            _userManager = userManager;
            _roleManager = roleManager;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllClaims(string email)
        {
            // check if user exist
            var user = await _userManager.FindByEmailAsync(email);

            if (user == null) // user does not exist
            {
                _logger.LogInformation($"The user with the {email} does not exist!!!");
                return BadRequest(new
                {
                    error = "User does not exist!!!"
                });
            }

            var userClaims = await _userManager.GetClaimsAsync(user);

            return Ok(userClaims);
        }

        [HttpPost("AddClaimsToUser")]
        public async Task<IActionResult> AddClaimsToUser(string email, string claimName, string claimValue)
        {
            // check if user exist
            var user = await _userManager.FindByEmailAsync(email);

            if (user == null) // user does not exist
            {
                _logger.LogInformation($"The user with the {email} does not exist!!!");
                return BadRequest(new
                {
                    error = "User does not exist!!!"
                });
            }

            var userClaim = new Claim(claimName, claimValue);

            var result = await _userManager.AddClaimAsync(user, userClaim);

            if (result.Succeeded)
            {
                return Ok(new
                {
                    result = $"User {user.Email} has a claim {claimName} added to them"
                });
            }

            return BadRequest(new
            {
                error = $"Unable to add claim {claimName} to the user {user.Email}"
            });

        }
    }
}
