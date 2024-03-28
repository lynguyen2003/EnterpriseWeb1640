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
        public string Feedback { get; set; }
        public DateTime UploadDate { get; set; }
        public Users User { get; set; }
    }
}
