using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Models.DTO.Request;
using Models.DTO.Response;
using Models.Entities;
using Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EnterpriseWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "Admin")]
    public class ClosureDatesController : ControllerBase
    {
        private readonly IClosureDates _closureDatesRepository;

        public ClosureDatesController(IClosureDates closureDatesRepository)
        {
            _closureDatesRepository = closureDatesRepository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ClosureDatesDTO>>> GetAllClosureDates()
        {
            try
            {
                var closureDates = await _closureDatesRepository.GetAllClosureDates();
                var closureDatesDTO = new List<ClosureDatesDTO>();
                foreach (var closureDate in closureDates)
                {
                    closureDatesDTO.Add(new ClosureDatesDTO
                    {
                        Id = closureDate.Id,
                        AcademicYear = closureDate.AcademicYear,
                        ClosureDate = closureDate.ClosureDate,
                        FinalClosureDate = closureDate.FinalClosureDate
                    });
                }
                return Ok(closureDatesDTO);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ClosureDatesDTO>> GetClosureDateById(int id)
        {
            try
            {
                var closureDate = await _closureDatesRepository.GetClosureDateById(id);
                if (closureDate == null)
                {
                    return NotFound();
                }
                var closureDateDTO = new ClosureDatesDTO
                {
                    Id = closureDate.Id,
                    AcademicYear = closureDate.AcademicYear,
                    ClosureDate = closureDate.ClosureDate,
                    FinalClosureDate = closureDate.FinalClosureDate
                };
                return Ok(closureDateDTO);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }

        [HttpPost]
        public async Task<ActionResult<ClosureDatesDTO>> AddClosureDate([FromBody] CreateClosureDateDTO closureDate)
        {
            try
            {
                var closureDateEntity = new ClosureDates
                {
                    AcademicYear = closureDate.AcademicYear,
                    ClosureDate = closureDate.ClosureDate,
                    FinalClosureDate = closureDate.FinalClosureDate
                };
                await _closureDatesRepository.AddClosureDate(closureDateEntity);
                var createdClosureDateDTO = new ClosureDatesDTO
                {
                    Id = closureDateEntity.Id,
                    AcademicYear = closureDateEntity.AcademicYear,
                    ClosureDate = closureDateEntity.ClosureDate,
                    FinalClosureDate = closureDateEntity.FinalClosureDate
                };
                return CreatedAtAction(nameof(GetClosureDateById), new { id = createdClosureDateDTO.Id }, createdClosureDateDTO);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateClosureDate(int id, [FromBody] UpdateClosureDateDTO closureDate)
        {
            try
            {
                var existingClosureDate = await _closureDatesRepository.GetClosureDateById(id);
                if (existingClosureDate == null)
                {
                    return NotFound();
                }
                existingClosureDate.AcademicYear = closureDate.AcademicYear;
                existingClosureDate.ClosureDate = closureDate.ClosureDate;
                existingClosureDate.FinalClosureDate = closureDate.FinalClosureDate;
                await _closureDatesRepository.UpdateClosureDate(id, existingClosureDate);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> RemoveClosureDate(int id)
        {
            try
            {
                await _closureDatesRepository.DeleteClosureDate(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }
    }
}
