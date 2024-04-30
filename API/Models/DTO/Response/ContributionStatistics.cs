using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models.DTO.Response
{
    public class ContributionStatistics
    {
        public int Users { get; set; }
        public string FacultyName { get; set; }
        public string AcademicYear { get; set; }
        public int Contributions { get; set; }
        public int Contributors { get; set; }
        public int TotalContributions { get; set; }
        public int TotalContributors { get; set; }
        public double Percentage { get; set; }
    }
}
