using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataServices.JwtServices;
using Models.DTO.Request;
using System.Security.Claims;
using Models.DTO;

namespace DataServices.Interfaces
{
    public interface IJwtService
    {
        public Task<AuthResult> GenerateJwtToken(IdentityUser user);
        public Task<AuthResult> VerifyAndGenerateToken(TokenRequest tokenRequest);
    }
}
