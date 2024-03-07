using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models.Entities
{
    public class Users
    {
        [Key]
        public int Id { get; set; } 
        public string UserName { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public int Phone { get; set; }
        [ForeignKey("Faculities")]
        public int FaculitiesId { get; set; }
        public Faculities Faculities { get; set; }
        public ICollection<UserRoles> UserRoles { get; set; }
        public ICollection<Contributions> Contributions { get; set;}
    }
}
