using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models.DTO.Request
{
    public class CreateClosureDateDTO
    {
        [Required]
        public string AcademicYear { get; set; }
        [Required]
        public DateTime ClosureDate { get; set; }
        [Required]
        public DateTime FinalClosureDate { get; set; }
        public bool? IsSet { get; set; }
    }
}
