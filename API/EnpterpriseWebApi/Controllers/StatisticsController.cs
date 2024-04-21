using AutoMapper;
using DataServices.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Models.DTO.Filter;
using Models.DTO.Response;

namespace EnpterpriseWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class StatisticsController : BaseController
    {
        public StatisticsController(IUnitOfWorks unitOfWorks, IMapper mapper) : base(unitOfWorks, mapper)
        {
        }

        [HttpGet]
        [Route("general")]
        public async Task<IActionResult> GetStatistics([FromQuery] StatisticsFilter filter)
        {
            if (filter == null)
            {
                return BadRequest();
            }

            var result = await _unitOfWorks.Statistics.GetStatistics(filter);

            return Ok(result);
        }

        [HttpGet]
        [Route("faculty")]
        public async Task<IActionResult> GetStatisticsWithFaculty([FromQuery]StatisticsFilter filter)
        {
            if (filter == null)
            {
                return BadRequest();
            }

            var result = await _unitOfWorks.Statistics.GetStatisticsWithFaculty(filter);

            return Ok(result);
        }
        [HttpGet]
        [Route("percentage")]
        public async Task<IActionResult> GetPercentage()
        {
            var result = await _unitOfWorks.Statistics.GetPercentage();

            return Ok(result);
        }
    }
}
