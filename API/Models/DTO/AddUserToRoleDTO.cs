using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models.DTO
{
    public class AddUserToRoleDTO
    {
        [Required(ErrorMessage = "Email is required")]
        public string Email { get; set; }
        public string? OldRoleName { get; set; }
        [Required(ErrorMessage = "Email is required")]
        public string RoleName { get; set; }

    }
}
