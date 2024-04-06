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
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class FeedbacksController : BaseController
    {
        public FeedbacksController(IUnitOfWorks unitOfWorks, IMapper mapper) : base(unitOfWorks, mapper)
        {
        }

        [HttpGet]
        public async Task<IActionResult> Gets()
        {
            var feedbacks = await _unitOfWorks.Feedbacks.GetAll();

            if (feedbacks == null)
                return NotFound();

            return Ok(_mapper.Map<IEnumerable<FeedbacksResponseDTO>>(feedbacks));
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetByUserId(string userId)
        {
            var feedback = await _unitOfWorks.Feedbacks.GetByUserId(userId);

            if (feedback == null)
                return NotFound();

            return Ok(feedback);
        }

        [HttpPost]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "MarketingCoordinator, Admin")]
        public async Task<IActionResult> Add(FeedbacksRequestCreateDTO feedbacks)
        {
            if (!ModelState.IsValid)
                return BadRequest();
            var result = _mapper.Map<Feedbacks>(feedbacks);
            await _unitOfWorks.Feedbacks.Add(result);
            await _unitOfWorks.CompleteAsync();
            return CreatedAtAction(nameof(Gets), _mapper.Map<FeedbacksResponseDTO>(result));
        }

        [HttpPut("")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "MarketingCoordinator,Admin")]
        public async Task<IActionResult> Update(FeedbacksRequestUpdateDTO feedbacks)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var result = _mapper.Map<Feedbacks>(feedbacks);

            await _unitOfWorks.Feedbacks.Update(result);
            await _unitOfWorks.CompleteAsync();


            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "MarketingCoordinator,Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var user = await _unitOfWorks.Feedbacks.GetById(id);

            if (user == null)
                return NotFound();

            await _unitOfWorks.Feedbacks.Delete(id);
            await _unitOfWorks.CompleteAsync();

            return NoContent();
        }
    }
}
