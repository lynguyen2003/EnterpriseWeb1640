using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models.DTO.Request
{
    public class CommentsRequestCreateDTO
    {
        [Required(ErrorMessage = "UserName is required")]
        public string UserName { get; set; }
        [Required(ErrorMessage = "Email is required!")]
        [EmailAddress(ErrorMessage = "Email is not valid!")]
        public string Email { get; set; }
        [Required(ErrorMessage = "Content is required!")]
        public string Content { get; set; }
        [Required(ErrorMessage = "ContributionId is required!")]
        [Range(1, int.MaxValue, ErrorMessage = "ContributionId is required!")]
        public int ContributionId { get; set; }
    }
}
