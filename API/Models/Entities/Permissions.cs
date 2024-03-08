using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models.Entities
{
    public class Permissions
    {
        [Key]
        public int Id { get; set; }
        public string PerName { get; set; }
        public ICollection<RolePermissions> RolePermissions { get; set; }
    }
}
