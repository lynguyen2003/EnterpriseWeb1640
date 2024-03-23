using DataServices.Configurations;
using DataServices.Data;
using DataServices.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Models.DTO;
using Models.DTO.Request;
using Models.Entities;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace DataServices.JwtServices
{
    public class JwtService : IJwtService
    {
        private readonly IConfiguration _configuration;
        private readonly DataContext _context;
        private readonly TokenValidationParameters _tokenValidationParameters;
        private readonly UserManager<IdentityUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly ILogger<JwtService> _logger;
        public JwtService(IConfiguration configuration, 
                          DataContext context, 
                          TokenValidationParameters tokenValidationParameters, 
                          UserManager<IdentityUser> userManager,
                          RoleManager<IdentityRole> roleManager,
                          ILogger<JwtService> logger)
        {
            _configuration = configuration;
            _context = context;
            _tokenValidationParameters = tokenValidationParameters;
            _userManager = userManager;
            _roleManager = roleManager;
            _logger = logger;
        }

        public async Task<AuthResult> GenerateJwtToken(IdentityUser user)
        {
            var jwtTokenHandler = new JwtSecurityTokenHandler();

            var key = Encoding.UTF8.GetBytes(_configuration.GetSection("JwtConfig:Secret").Value);

            var claims = await GetAllValidClaims(user);

            //Token descriptor
            var tokenDescriptor = new SecurityTokenDescriptor()
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.Add(TimeSpan.Parse(_configuration.GetSection("JwtConfig:ExpiryTimeFrame").Value)),
                Issuer = _configuration.GetSection("JwtConfig:Issuer").Value,
                Audience = _configuration.GetSection("JwtConfig:Audience").Value,
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = jwtTokenHandler.CreateToken(tokenDescriptor);
            var jwtToken = jwtTokenHandler.WriteToken(token);

            var refreshToken = new RefreshToken()
            {
                JwtId = token.Id,
                Token = RandomStringGeneration(35) + Guid.NewGuid(), // generate a refresh token
                AddedDate = DateTime.UtcNow,
                ExpiryDate = DateTime.UtcNow.AddMonths(6),
                IsRevoked = false,
                IsUsed = false,
                UserId = user.Id
            };

            await _context.RefreshTokens.AddAsync(refreshToken);
            await _context.SaveChangesAsync();

            return new AuthResult()
            {
                Token = jwtToken,
                RefreshToken = refreshToken.Token,
                Success = true,
                Result = true
            };
        }

        // get all valid claims for the corresponding user
        public async Task<List<Claim>> GetAllValidClaims(IdentityUser user)
        {
            var _options = new IdentityOptions();

            var claims = new List<Claim>
            {
                new Claim("Id", user.Id),
                new Claim(JwtRegisteredClaimNames.Sub, user.Email),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            };

            // getting claims that we have assign to the user
            var userClaims = await _userManager.GetClaimsAsync(user);
            claims.AddRange(userClaims);

            //get user role and add it to the claims
            var userRoles = await _userManager.GetRolesAsync(user);

            foreach(var userRole in userRoles)
            {
                var role = await _roleManager.FindByNameAsync(userRole);

                if(role != null)
                {
                    claims.Add(new Claim(ClaimTypes.Role, userRole));
                    var roleClaims = await _roleManager.GetClaimsAsync(role);

                    foreach(var roleClaim in roleClaims)
                    {
                        claims.Add(roleClaim);
                    }
                }
            }
            return claims; 
        }

        public async Task<AuthResult> VerifyAndGenerateToken(TokenRequest tokenRequest)
        {
            var jwtTokenHandler = new JwtSecurityTokenHandler();

            try
            {
                _tokenValidationParameters.ValidateLifetime = false; // for testing

                var tokenInVerification = jwtTokenHandler.ValidateToken(tokenRequest.Token, _tokenValidationParameters, out var validedToken);

                if(validedToken is JwtSecurityToken jwtSecurityToken)
                {
                    var result = jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase);

                    if (result == false)
                        return null;
                }

                var utcExpiryDate = long.Parse(tokenInVerification.Claims.FirstOrDefault(x => x.Type == JwtRegisteredClaimNames.Exp).Value);

                var expiryDate = UnixTimeStampToDateTime(utcExpiryDate);
                if (expiryDate > DateTime.Now)
                {
                    return new AuthResult()
                    {
                        Result = false,
                        Errors = new List<string>()
                        {
                            "Expired token"
                        }
                    };
                }

                var storedToken = await _context.RefreshTokens.FirstOrDefaultAsync(x => x.Token == tokenRequest.RefreshToken);

                if(storedToken == null)
                {
                    return new AuthResult()
                    {
                        Result = false,
                        Errors = new List<string>()
                        {
                            "Invalid tokens"
                        }
                    };
                }

                if(storedToken.IsUsed)
                    return new AuthResult()
                    {
                        Result = false,
                        Errors = new List<string>()
                        {
                            "Invalid tokens"
                        }
                    };
                if(storedToken.IsRevoked)
                    return new AuthResult()
                    {
                        Result = false,
                        Errors = new List<string>()
                        {
                            "Invalid tokens"
                        }
                    };

                var jti = tokenInVerification.Claims.FirstOrDefault(x => x.Type == JwtRegisteredClaimNames.Jti).Value;

                if(storedToken.JwtId != jti)
                    return new AuthResult()
                    {
                        Result = false,
                        Errors = new List<string>()
                        {
                            "Invalid tokens"
                        }
                    };

                if(storedToken.ExpiryDate < DateTime.UtcNow)
                    return new AuthResult()
                    {
                        Result = false,
                        Errors = new List<string>()
                        {
                            "Expired tokens"
                        }
                    };

                storedToken.IsUsed = true;
                _context.RefreshTokens.Update(storedToken);
                await _context.SaveChangesAsync();

                var dbUser = await _userManager.FindByIdAsync(storedToken.UserId);
                return await GenerateJwtToken(dbUser);
            }
            catch (Exception ex)
            {
                return new AuthResult()
                {
                    Result = false,
                    Errors = new List<string>()
                        {
                            "Server error"
                        }
                };
            }
        }

        private DateTime UnixTimeStampToDateTime(long unixTimeStamp)
        {
            var dateTimeVal = new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc);
            dateTimeVal = dateTimeVal.AddSeconds(unixTimeStamp).ToUniversalTime();
            return dateTimeVal;
        }

        private string RandomStringGeneration(int length)
        {
            var random = new Random();
            var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefghijklmnopqrstuvwxyz_";
            return new string(Enumerable.Repeat(chars, length).Select(s => s[random.Next(s.Length)]).ToArray());
        }
    }
}
