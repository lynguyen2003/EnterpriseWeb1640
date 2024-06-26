﻿using DataServices.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Models.DTO.Request;
using Models.DTO.Response;
using Models.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EnpterpriseWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
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
                        FinalClosureDate = closureDate.FinalClosureDate,
                        IsSet = closureDate.IsSet
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
                    FinalClosureDate = closureDate.FinalClosureDate,
                    IsSet = closureDate.IsSet
                };
                return Ok(closureDateDTO);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }

        [HttpPost]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "Admin")]
        public async Task<ActionResult<ClosureDatesDTO>> AddClosureDate([FromBody] CreateClosureDateDTO closureDate)
        {
            try
            {
                var closureDateEntity = new ClosureDates
                {
                    AcademicYear = closureDate.AcademicYear,
                    ClosureDate = closureDate.ClosureDate,
                    FinalClosureDate = closureDate.FinalClosureDate,
                    IsSet = closureDate.IsSet
                };
                await _closureDatesRepository.AddClosureDate(closureDateEntity);
                var createdClosureDateDTO = new ClosureDatesDTO
                {
                    Id = closureDateEntity.Id,
                    AcademicYear = closureDateEntity.AcademicYear,
                    ClosureDate = closureDateEntity.ClosureDate,
                    FinalClosureDate = closureDateEntity.FinalClosureDate,
                    IsSet = closureDateEntity.IsSet
                };
                return CreatedAtAction(nameof(GetClosureDateById), new { id = createdClosureDateDTO.Id }, createdClosureDateDTO);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }

        [HttpPut("{id}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "Admin")]
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
                existingClosureDate.IsSet = closureDate.IsSet;
                await _closureDatesRepository.UpdateClosureDate(id, existingClosureDate);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }

        [HttpDelete("{id}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "Admin")]
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
