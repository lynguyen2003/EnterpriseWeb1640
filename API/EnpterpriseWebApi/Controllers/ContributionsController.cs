using AutoMapper;
using DataServices.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Models.DTO.Filter;
using Models.DTO.Request;
using Models.DTO.Response;
using Models.Entities;
using System.ComponentModel.DataAnnotations;

namespace EnpterpriseWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class ContributionsController : BaseController
    {
        public ContributionsController(IUnitOfWorks unitOfWorks, IMapper mapper) : base(unitOfWorks, mapper)
        {

        }

        [HttpGet]
        public async Task<IActionResult> Gets([FromQuery] ContributionsFilter paginationDTO)
        {
            var contributions = await _unitOfWorks.Contributions.GetAll(paginationDTO);
            return Ok(_mapper.Map<List<ContributionsResponseDTO>>(contributions));
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetByUserId(string userId)
        {
            var user = await _unitOfWorks.Contributions.GetByUserId(userId);

            if (user == null)
                return NotFound();

            return Ok(user);
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
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "Student,Admin,MarketingCoordinator")]
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
