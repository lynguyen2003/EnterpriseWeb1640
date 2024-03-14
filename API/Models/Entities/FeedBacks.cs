using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models.Entities
{
    public class Feedbacks
    {
        public int Id { get; set; }
        public string Comment { get; set; }
        public DateTime CommentDate { get; set; }
        public string UserId { get; set; }
        public int ConId { get; set; }
        public Users Users { get; set; }
        public Contributions Contributions { get; set; }
    }
}
