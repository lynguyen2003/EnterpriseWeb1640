using AutoMapper;
using DataServices.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Models.DTO.Request;
using Models.DTO.Response;
using Models.Entities;

namespace EnpterpriseWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MagazinesController : BaseController
    {
        public MagazinesController(IUnitOfWorks unitOfWorks, IMapper mapper) : base(unitOfWorks, mapper)
        {
        }

        [HttpGet]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "MarketingManager,Admin")]
        public async Task<IActionResult> Gets()
        {
            var magazines = await _unitOfWorks.Magazines.GetAll();

            if (magazines == null)
                return NotFound();

            return Ok(_mapper.Map<IEnumerable<MagazinesResponseDTO>>(magazines));
        }

        [HttpGet("{id}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "MarketingCoordinator,Student,Admin")]
        public async Task<IActionResult> Get(int id)
        {
            var magazines = await _unitOfWorks.Magazines.GetById(id);

            if (magazines == null)
                return NotFound();

            var result = _mapper.Map<MagazinesResponseDTO>(magazines);

            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Add(MagazinesRequestCreateDTO magazines)
        {
            if (!ModelState.IsValid)
                return BadRequest();
            var result = _mapper.Map<Magazines>(magazines);
            await _unitOfWorks.Magazines.Add(result);
            await _unitOfWorks.CompleteAsync();
            return CreatedAtAction(nameof(Gets), _mapper.Map<MagazinesResponseDTO>(result));
        }

        [HttpPut("")]
        public async Task<IActionResult> Update(MagazinesRequestUpdateDTO magazines)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var result = _mapper.Map<Magazines>(magazines);

            await _unitOfWorks.Magazines.Update(result);
            await _unitOfWorks.CompleteAsync();


            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var magazines = await _unitOfWorks.Magazines.GetById(id);

            if (magazines == null)
                return NotFound();

            await _unitOfWorks.Magazines.Delete(id);
            await _unitOfWorks.CompleteAsync();

            return NoContent();
        }
    }
}
