using AutoMapper;
using DataServices.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Models.DTO;
using Models.DTO.Request;
using Models.Entities;

namespace EnpterpriseWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : BaseController
    {
        public UsersController(IUnitOfWorks unitOfWorks, IMapper mapper) : base(unitOfWorks, mapper)
        {
        }

        [HttpGet]
        public async Task<IActionResult> Gets() 
        {
            var users = await _unitOfWorks.Users.GetAll(); 

            if (users == null)
                return NotFound();

            return Ok(_mapper.Map<IEnumerable<UsersDTO>>(users));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var user = await _unitOfWorks.Users.GetById(id);

            if (user == null) 
                return NotFound();

            var result = _mapper.Map<UsersDTO>(user);

            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Add([FromBody] CreateUserDTO userDTO)
        {
            if (!ModelState.IsValid)
                return BadRequest();
            var result = _mapper.Map<Users>(userDTO);
            await _unitOfWorks.Users.AddUserWithFaculityId(result, userDTO.FaculityId);
            await _unitOfWorks.CompleteAsync();
            return CreatedAtAction(nameof(Get), new { userId = result.Id }, result); //TO DO
        }

        [HttpPut("")]
        public async Task<IActionResult> Update([FromBody] UsersDTO userDTO)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var result = _mapper.Map<Users>(userDTO);

            await _unitOfWorks.Users.Update(result);
            await _unitOfWorks.CompleteAsync();


            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var user = await _unitOfWorks.Users.GetById(id);

            if (user == null)
                return NotFound();

            await _unitOfWorks.Users.Delete(id);
            await _unitOfWorks.CompleteAsync();

            return NoContent();
        }
    }
}
