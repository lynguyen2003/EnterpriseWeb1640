using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models.DTO.Request
{
    public class FeedbacksRequestUpdateDTO
    {
        [Required(ErrorMessage = "Id is required")]
        public int Id { get; set; }
        [Required(ErrorMessage = "Feedback is required")]
        [StringLength(500, MinimumLength = 10, ErrorMessage = "Feedback must be between 10 and 500 characters")]
        public string Feedback { get; set; }
    }
}
