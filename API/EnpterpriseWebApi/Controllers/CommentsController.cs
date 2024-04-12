using AutoMapper;
using DataServices.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Models.DTO.Request;
using Models.DTO.Response;
using Models.Entities;
using System.ComponentModel.DataAnnotations;

namespace EnpterpriseWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class CommentsController : BaseController
    {
        public CommentsController(IUnitOfWorks unitOfWorks, IMapper mapper) : base(unitOfWorks, mapper)
        {
        }

        [HttpGet]
        public async Task<IActionResult> Gets()
        {
            var comments = await _unitOfWorks.Comments.GetAll();

            return Ok(_mapper.Map<IEnumerable<CommentsResponseDTO>>(comments));
        }

        [HttpGet]
        [Route("Contribution")]
        public async Task<IActionResult> GetCommentsByContributionId([Required]int contributionId)
        {
            var comments = await _unitOfWorks.Comments.GetCommentsByContributionId(contributionId);

            return Ok(_mapper.Map<IEnumerable<CommentsResponseDTO>>(comments));
        }

        [HttpPost]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "Student,MarketingCoordinator")]
        public async Task<IActionResult> AddComment([FromBody] CommentsRequestCreateDTO comments)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var comment = _mapper.Map<Comments>(comments);

            await _unitOfWorks.Comments.Add(comment);
            await _unitOfWorks.CompleteAsync();

            return CreatedAtAction(nameof(Gets), _mapper.Map<CommentsResponseDTO>(comment));
        }

        [HttpPut]
        public async Task<IActionResult> UpdateComment()
        {
            throw new NotImplementedException();
        }

        [HttpDelete("{id}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "Student,MarketingCoordinator")]
        public async Task<IActionResult> Delete(int id)
        {
            var comment = await _unitOfWorks.Comments.GetById(id);

            if (comment == null)
                return NotFound();

            await _unitOfWorks.Comments.Delete(id);
            await _unitOfWorks.CompleteAsync();

            return NoContent();
        }
    }
}
