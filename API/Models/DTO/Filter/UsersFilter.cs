using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models.DTO.Filter
{
    public class UsersFilter
    {
        public int PageNum { get; set; } = 1;
        public int PageSize { get; set; } = 50;
        public string? Email { get; set; }
        public int? FacultiesId { get; set; }
    }
}
