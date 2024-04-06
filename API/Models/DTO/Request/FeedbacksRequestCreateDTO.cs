using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models.DTO.Request
{
    public class FeedbacksRequestCreateDTO
    {
        [Required(ErrorMessage = "Feedback is required")]
        [StringLength(500, MinimumLength = 10, ErrorMessage = "Feedback must be between 10 and 500 characters")]
        public string Feedback { get; set; }
        [Required(ErrorMessage = "UsersId is required")]
        public string UsersId { get; set; }
    }
}
