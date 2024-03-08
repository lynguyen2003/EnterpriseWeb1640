using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models.Entities
{   public class UserRoles
    {
        public int UserId { get; set; }
        public int RoleId { get; set; }
        public Users Users { get; set; }
        public Roles Roles { get; set; }    
    }
}
