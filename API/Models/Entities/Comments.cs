using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models.Entities
{
    public class Comments
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Content { get; set; }
        public DateTime CreatedAt { get; set; }
        public int ContributionId { get; set; }
        public Contributions Contribution { get; set; }

    }
}
