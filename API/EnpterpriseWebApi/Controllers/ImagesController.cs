using AutoMapper;
using DataServices.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Models.DTO.Request;
using Models.DTO.Response;
using Models.Entities;

namespace EnpterpriseWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ImagesController : BaseController
    {
        public ImagesController(IUnitOfWorks unitOfWorks, IMapper mapper) : base(unitOfWorks, mapper)
        {
        }

        [HttpGet]
        public async Task<IActionResult> Gets()
        {
            var images = await _unitOfWorks.Images.GetAll();

            if (images == null)
                return NotFound();

            return Ok(_mapper.Map<IEnumerable<ImagesResponseDTO>>(images));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var images = await _unitOfWorks.Images.GetById(id);

            if (images == null)
                return NotFound();

            var result = _mapper.Map<ImagesResponseDTO>(images);

            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Add(ImagesRequestCreateDTO images)
        {
            if (!ModelState.IsValid)
                return BadRequest();
            var result = _mapper.Map<Images>(images);
            await _unitOfWorks.Images.Add(result);
            await _unitOfWorks.CompleteAsync();
            return CreatedAtAction(nameof(Gets), _mapper.Map<ImagesResponseDTO>(result));
        }

        [HttpPut("")]
        public async Task<IActionResult> Update(ImagesRequestUpdateDTO images)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var result = _mapper.Map<Images>(images);

            await _unitOfWorks.Images.Update(result);
            await _unitOfWorks.CompleteAsync();


            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var user = await _unitOfWorks.Images.GetById(id);

            if (user == null)
                return NotFound();

            await _unitOfWorks.Images.Delete(id);
            await _unitOfWorks.CompleteAsync();

            return NoContent();
        }

    }


}
