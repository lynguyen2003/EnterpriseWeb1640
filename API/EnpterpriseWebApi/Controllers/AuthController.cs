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
using System.ComponentModel.DataAnnotations;
using AutoMapper;
using DataServices.Service;
using System.Web;

namespace EnpterpriseWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : BaseController
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly IJwtService _jwtService;
        private readonly IEmailService _emailService;

        public AuthController(
            IUnitOfWorks unitOfWorks, 
            IMapper mapper, 
            UserManager<IdentityUser> userManager, 
            IJwtService jwtService, 
            IEmailService emailService) : base(unitOfWorks, mapper)
        {
            _userManager = userManager;
            _jwtService = jwtService;
            _emailService = emailService;
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

        [HttpPost]
        [Route("forgot-password")]
        public async Task<IActionResult> ForgotPassword([Required]string email)
        {
                var existing_user = await _userManager.FindByEmailAsync(email);

                if (existing_user != null)
                {
                    var token = await _userManager.GeneratePasswordResetTokenAsync(existing_user);
                    var encodedToken = HttpUtility.UrlEncode(token);
                    var encodedEmail = HttpUtility.UrlEncode(existing_user.Email);
                    var forgotPasswordUrl = $"https://greenwichweb-4f0ca.web.app/reset-password?token={encodedToken}&email={encodedEmail}";
                    var message = new Message(new string[] { existing_user.Email! }, "[Greenwich-HCM] Change Password at greenwich.localhoast.vn", $"Hello,\n\nPlease click the following link to reset your password:\n\n{forgotPasswordUrl}");
                    _emailService.SendEmail(message);

                    return Ok("Change Password requrest is sent to your email. Please Open your email and click to the link.");
                }
                return BadRequest("Could not send link to email, please try against.");
        }

        [HttpGet("reset-password")]
        public IActionResult ResetPassword(string token, string email)
        {
            if (string.IsNullOrWhiteSpace(token) || string.IsNullOrWhiteSpace(email))
            {
                return RedirectToAction("Index", "Home");
            }

            return Ok(new UserResetPasswordDTO { Token = token, Email = email });
        }


        [HttpPost]
        [Route("reset-password")]
        public async Task<IActionResult> ResetPassword(UserResetPasswordDTO model)
        {
            if (ModelState.IsValid)
            {
                var existing_user = await _userManager.FindByEmailAsync(model.Email);

                if (existing_user != null)
                {
                    var resetPasswordResult = await _userManager.ResetPasswordAsync(existing_user, model.Token, model.Password);

                    if (!resetPasswordResult.Succeeded)
                    {
                        foreach( var error in resetPasswordResult.Errors)
                        {
                            ModelState.AddModelError(error.Code, error.Description);
                        }
                        return Ok(ModelState);
                    }
                    return Ok("Password has been changed.");
                }
                return BadRequest();
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
