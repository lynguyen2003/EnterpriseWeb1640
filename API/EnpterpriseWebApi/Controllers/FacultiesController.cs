using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using Models.Entities;
using AutoMapper;
using Models.DTO.Response;
using Models.DTO.Request;
using Models.DTO;
using DataServices.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace EnpterpriseWebApi.Controllers
{
	[Authorize]
	[Route("api/[controller]")]
	[ApiController]
	public class FacultiesController : ControllerBase
	{
		private readonly IFacultiesRepository _facultiesRepository;
		private readonly IMapper _mapper;

		public FacultiesController(IFacultiesRepository facultiesRepository, IMapper mapper)
		{
			_facultiesRepository = facultiesRepository;
			_mapper = mapper;
		}

		[HttpGet]
		public async Task<ActionResult<IEnumerable<FacultiesDTO>>> GetFaculties()
		{
			var faculties = await _facultiesRepository.GetAllFacultiesAsync();
			var facultiesDTOs = _mapper.Map<IEnumerable<FacultiesDTO>>(faculties);
			return Ok(facultiesDTOs);
		}

		[HttpGet("{id}")]
		public async Task<ActionResult<FacultiesDTO>> GetFaculty(int id)
		{
			var faculty = await _facultiesRepository.GetFacultyByIdAsync(id);
			if (faculty == null)
			{
				return NotFound();
			}
			var facultyDTO = _mapper.Map<FacultiesDTO>(faculty);
			return Ok(facultyDTO);
		}

		[HttpPost]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "Admin")]
        public async Task<ActionResult<FacultiesDTO>> CreateFaculty(CreateFacultyDTO facultyDTO)
		{
			var faculty = _mapper.Map<Faculties>(facultyDTO);
			await _facultiesRepository.CreateFacultyAsync(faculty);
			var createdFacultyDTO = _mapper.Map<FacultiesDTO>(faculty);
			return CreatedAtAction(nameof(GetFaculty), new { id = createdFacultyDTO.Id }, createdFacultyDTO);
		}

		[HttpPut]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "Admin")]
        public async Task<IActionResult> UpdateFaculty(int id, UpdateFacultyDTO facultyDTO)
		{
			var faculty = await _facultiesRepository.GetFacultyByIdAsync(id);
			if (faculty == null)
			{
				return NotFound();
			}
			_mapper.Map(facultyDTO, faculty);
			await _facultiesRepository.UpdateFacultyAsync(faculty);
			return NoContent();
		}

		[HttpDelete("{id}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "Admin")]
        public async Task<IActionResult> DeleteFaculty(int id)
		{
			var faculty = await _facultiesRepository.GetFacultyByIdAsync(id);
			if (faculty == null)
			{
				return NotFound();
			}
			await _facultiesRepository.DeleteFaculty(id);
			return NoContent();
		}
	}
}
