using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Models.DTO.Request;
using AutoMapper;
using Models.Entities;
using EnpterpriseWebApi.Controllers;
using DataServices.Interfaces;
using Models.DTO.Response;

[Route("api/[controller]")]
[ApiController]
[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
public class UsersController : BaseController
{
    private readonly UserManager<IdentityUser> _userManager;
    public UsersController(IUnitOfWorks unitOfWorks, IMapper mapper, UserManager<IdentityUser> userManager) : base(unitOfWorks, mapper)
    {
        _userManager = userManager;
    }

    // GET: api/Users
    [HttpGet]
    public async Task<IActionResult> GetUsers()
    {
        try
        {
            var users = await _unitOfWorks.Users.GetAll();

            if (users == null)
                return NotFound();

            return Ok(_mapper.Map<IEnumerable<UsersResponseDTO>>(users));
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpGet("{email}")]
    public async Task<IActionResult> GetUser(string email)
    {
        try
        {
            var user = await _unitOfWorks.Users.GetUserByEmail(email);
            if (user == null)
                return NotFound("User not found");

            return Ok(_mapper.Map<IEnumerable<UsersResponseDTO>>(user));
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }


    // GET: api/Users/{id}
    [HttpGet("UserId")]
    public async Task<IActionResult> GetUserByUserId(string userId)
    {
        var user = await _unitOfWorks.Users.GetUserByUserId(userId);

        if (user == null)
            return NotFound();

        var result = _mapper.Map<IEnumerable<UsersResponseDTO>>(user);

        return Ok(result);
    }

    // POST: api/Users
    [HttpPost]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "Admin")]
    public async Task<IActionResult> CreateUser([FromBody] UsersRequestCreateDTO model)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
            var user = _mapper.Map<Users>(model);
            var result = await _userManager.CreateAsync(user, model.Password);
            if (result.Succeeded)
            {
                return NoContent();
            }
            else
            {
                return BadRequest();
            }
    }

    // PUT: api/Users/{id}
    [HttpPut]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "Admin")]
    public async Task<IActionResult> Update(UsersRequestUpdateDTO users)
    {
        if (!ModelState.IsValid)
            return BadRequest();

        var result = _mapper.Map<Users>(users);
        await _unitOfWorks.Users.Update(result);
        await _unitOfWorks.CompleteAsync();
        return NoContent();
    }

    // DELETE: api/Users/{id}
    [HttpDelete("{id}")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "Admin")]
    public async Task<IActionResult> DeleteUser(string id)
    {
        try
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
                return NotFound("User not found");

            var result = await _userManager.DeleteAsync(user);
            if (result.Succeeded)
                return NoContent();
            else
                return BadRequest(result.Errors);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }
}
