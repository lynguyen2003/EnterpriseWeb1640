using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
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
        [ForeignKey("Users")]
        public string UsersId {  get; set; }
        public Users User { get; set; }
    }
}
