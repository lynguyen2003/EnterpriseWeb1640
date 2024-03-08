using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models.Entities
{
    public class RolePermissions
    {
        public int RoleId { get; set; }
        public int PermissionId { get; set; }
        public Roles Roles { get; set; }
        public Permissions Permissions { get; set; }
    }
}
