using AutoMapper;
using DataServices.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Models.DTO.Request;
using Models.DTO.Response;
using Models.Entities;
using System.ComponentModel.DataAnnotations;

namespace EnpterpriseWebApi.Controllers
{
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "AppUser")]
    [Route("api/[controller]")]
    [ApiController]
    public class ContributionsController : BaseController
    {
        public ContributionsController(IUnitOfWorks unitOfWorks, IMapper mapper) : base(unitOfWorks, mapper)
        {

        }

        [HttpGet]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "MarketingManager,Admin")]
        public async Task<IActionResult> Gets()
        {
            var users = await _unitOfWorks.Contributions.GetAll();

            if (users == null)
                return NotFound();

            return Ok(_mapper.Map<IEnumerable<ContributionsResponseDTO>>(users));
        }

        [HttpGet("{id}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "MarketingCoordinator,Student,Admin")]
        public async Task<IActionResult> Get(int id)
        {
            var user = await _unitOfWorks.Contributions.GetById(id);

            if (user == null)
                return NotFound();

            var result = _mapper.Map<ContributionsResponseDTO>(user);

            return Ok(result);
        }

        [HttpPost]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "Student,Admin")]
        public async Task<IActionResult> Add(ContributionsRequestCreateDTO contributions)
        {
            if (!ModelState.IsValid)
                return BadRequest();
            var result = _mapper.Map<Contributions>(contributions);
            await _unitOfWorks.Contributions.Add(result);
            await _unitOfWorks.CompleteAsync();
            return CreatedAtAction(nameof(Gets), _mapper.Map<ContributionsResponseDTO>(result));
        }

        [HttpPut("")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "MarketingCoordinator,Admin")]
        public async Task<IActionResult> Update(ContributionsRequestUpdateDTO contributions)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var result = _mapper.Map<Contributions>(contributions);

            await _unitOfWorks.Contributions.Update(result);
            await _unitOfWorks.CompleteAsync();


            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "Student,Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var user = await _unitOfWorks.Contributions.GetById(id);

            if (user == null)
                return NotFound();

            await _unitOfWorks.Contributions.Delete(id);
            await _unitOfWorks.CompleteAsync();

            return NoContent();
        }

    }
}
