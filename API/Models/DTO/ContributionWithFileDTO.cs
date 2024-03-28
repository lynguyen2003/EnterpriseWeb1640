using Microsoft.AspNetCore.Http;
using Models.DTO.Request;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models.DTO
{
    public class ContributionWithFileDTO
    {
        public ContributionsRequestCreateDTO Contributions { get; set; }
        public IFormFile File { get; set; }
    }
}
