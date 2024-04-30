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

            var result = await _unitOfWorks.Statistics.GetStatistics(filter);

            return Ok(result);
        }

        [HttpGet]
        [Route("faculty")]
        public async Task<IActionResult> GetStatisticsWithFaculty([FromQuery]StatisticsFilter filter)
        {

            var result = await _unitOfWorks.Statistics.GetStatisticsWithFaculty(filter);

            return Ok(result);
        }

        [HttpGet]
        [Route("users")]
        public async Task<IActionResult> GetStatisticsUsers()
        {

            var result = await _unitOfWorks.Statistics.GetStatisticsUsers();

            return Ok(result);
        }

        [HttpGet]
        [Route("approved-contributions")]
        public async Task<IActionResult> GetStatisticsApprovedContributions()
        {

            var result = await _unitOfWorks.Statistics.GetStatisticsApprovedContributions();

            return Ok(result);
        }

        [HttpGet]
        [Route("percentage-academic_year")]
        public async Task<IActionResult> GetPercentage()
        {
            var result = await _unitOfWorks.Statistics.GetPercentageWithAcademicYear();

            return Ok(result);
        }
    }
}
