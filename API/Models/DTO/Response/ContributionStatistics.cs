using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models.DTO.Response
{
    public class ContributionStatistics
    {
        public string FacultyName { get; set; }
        public string AcademicYear { get; set; }
        public int ContributionCount { get; set; }
    }
}
