using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models.Entities
{
    public class ClosureDates
    {
        public int Id { get; set; }
        public DateTime AcademicYear { get; set; }
        public DateTime ClosureDate { get; set; }
        public DateTime FinalClosureDate { get; set; }
        public ICollection<Contributions> Contributions { get; set; }
    }
}
