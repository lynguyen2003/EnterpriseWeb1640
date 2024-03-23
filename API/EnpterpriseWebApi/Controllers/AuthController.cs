using DataServices.Configurations;
using DataServices.Data;
using DataServices.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Models.DTO.Request;
using Models.Entities;
using DataServices.JwtServices;
using RestSharp;
using RestSharp.Authenticators;
using System.ComponentModel;
using Models.DTO;

namespace EnpterpriseWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly IJwtService _jwtService;


        public AuthController(UserManager<IdentityUser> userManager, 
                              IJwtService jwtService)
        {
            _userManager = userManager;
            _jwtService = jwtService;
        }

        [HttpPost]
        [Route("Register")]
        public async Task<IActionResult> Register([FromBody] UserRegistrationRequestDTO requestDTO)
        {
            // Validate the incoming request
            if(ModelState.IsValid)
            {
                // Check if the email already exist
                var existingUser = await _userManager.FindByEmailAsync(requestDTO.Email);

                if(existingUser != null)
                {
                    return BadRequest(new AuthResult()
                    {
                        Result = false,
                        Errors = new List<string>()
                        {
                            "Email already exist"
                        }
                    });
                }

                //create new user
                var newUser = new IdentityUser()
                {
                    Email = requestDTO.Email,
                    UserName = requestDTO.Email
                };

                var is_created = await _userManager.CreateAsync(newUser, requestDTO.Password);

                if (is_created.Succeeded)
                {
                    await _userManager.AddToRoleAsync(newUser, "AppUser");
               

                    return Ok(_jwtService.GenerateJwtToken(newUser).Result);
                }

                return BadRequest(new AuthResult()
                {
                    Errors = new List<string>()
                    {
                        "Server error"
                    },
                    Result = false
                });

            }

            return BadRequest();
        }


        [HttpPost]
        [Route("Login")]
        public async Task<IActionResult> Login([FromBody] UserLoginRequestDTO loginRequest)
        {
            if (ModelState.IsValid)
            {
                //check user exist
                var existing_user = await _userManager.FindByEmailAsync(loginRequest.Email);

                if(existing_user == null)
                {
                    return BadRequest(new AuthResult()
                    {
                        Errors = new List<string>()
                        {
                            "Invalid payload"
                        },
                        Result = false
                    });
                }

                var isCorrect = await _userManager.CheckPasswordAsync(existing_user, loginRequest.Password);

                //if not correct
                if (!isCorrect)
                    return BadRequest(new AuthResult()
                    {
                        Errors = new List<string>()
                        {
                            "Invalid credentials"
                        },
                        Result = false                       
                    });

                // if correct

                return Ok(_jwtService.GenerateJwtToken(existing_user).Result);
            }

            return BadRequest(new AuthResult()
            {
                Errors = new List<string>()
                {
                    "Invalid payload"
                },
                Result = false
            });
        }

        [HttpPost("RefreshToken")]
        public async Task<IActionResult> RefreshToken([FromBody] TokenRequest tokenRequest)
        {
            if(ModelState.IsValid)
            {
                var result = await _jwtService.VerifyAndGenerateToken(tokenRequest);

                if(result == null)
                {
                    return BadRequest(new AuthResult()
                    {
                        Errors = new List<string>()
                        {
                            "Invalid tokens"
                        },
                        Result = false
                    });
                }
                return Ok(result); 
            }

            return BadRequest(new AuthResult()
            {
                Errors = new List<string>()
                {
                    "Invalid parameter"
                },
                Result = false
            });
        }
        
    }
}
