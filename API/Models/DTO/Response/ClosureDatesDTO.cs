using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models.DTO.Response
{
    public class ClosureDatesDTO
    {
        public int Id { get; set; }
        public string AcademicYear { get; set; }
        public DateTime ClosureDate { get; set; }
        public DateTime FinalClosureDate { get; set; }
        public bool? IsSet { get; set; }
    }
}
