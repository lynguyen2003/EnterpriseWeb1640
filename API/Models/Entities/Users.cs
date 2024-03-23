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
        public Faculties Faculities { get; set; }
        public ICollection<Feedbacks> Feedbacks { get; set; }
        public ICollection<Contributions> Contributions { get; set; }
    }
}
