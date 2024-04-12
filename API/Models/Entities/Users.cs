using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models.Entities
{
    public class Users : IdentityUser
    {
        [ForeignKey("Faculties")]
        public int FacultiesId { get; set; }
        public string FullName { get; set; }
        public Faculties Faculties { get; set; }
        public ICollection<Contributions> Contributions { get; set; }
    }
}
