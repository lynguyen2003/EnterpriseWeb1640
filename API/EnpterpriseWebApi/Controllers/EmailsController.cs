using AutoMapper;
using DataServices.Interfaces;
using DataServices.JwtServices;
using DataServices.Service;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Models.DTO;
using System.Web;

namespace EnpterpriseWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmailsController : BaseController
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly IJwtService _jwtService;
        private readonly IEmailService _emailService;
        public EmailsController(
            IUnitOfWorks unitOfWorks, 
            IMapper mapper, 
            UserManager<IdentityUser> userManager, 
            IJwtService jwtService, 
            IEmailService emailService) : base(unitOfWorks, mapper)
        {
            _userManager = userManager;
            _jwtService = jwtService;
            _emailService = emailService;
        }

        [HttpGet]
        [Route("SendEmail")]
        public async Task<IActionResult> SendEmail(int facultiesId)
        {
            var facultyUsers = await _unitOfWorks.Users.GetUserByFacultiesId(facultiesId);
            // Get all users with the MarketingCoordinator role
            var users = await _userManager.GetUsersInRoleAsync("MarketingCoordinator");

            // Filter users by facultiesId
            var usersToSendEmail = users.Where(u => facultyUsers.Any(fu => fu.Email == u.Email));

            if (usersToSendEmail.Any())
            {
                foreach (var user in usersToSendEmail)
                {
                    var message = new Message(new string[] { user.Email! }, "[System Notification] New contribution has been posted", "A new contribution has been posted and requires your comment within 14 days.\n\nPlease review the submission and provide your feedback as soon as possible.\n\n");
                    _emailService.SendEmail(message);
                }

                return Ok("");
            }
            return BadRequest("Could not send email, please try against.");
        }
    }
}
