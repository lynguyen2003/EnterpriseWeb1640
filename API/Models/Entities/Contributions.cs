using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Reflection;
using System.Reflection.Metadata;
using System.Text;
using System.Threading.Tasks;

namespace Models.Entities
{
    public class Contributions
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string FilePath { get; set; }
        public string ImgPath { get; set; }
        public DateTime UploadDate { get; set; }
        public bool? IsApproved { get; set; }
        public bool? IsPublished { get; set; }
        [ForeignKey("ClosureDates")]
        public int ClosureDatesId { get; set; }
        public ClosureDates ClosureDates { get; set; }
        [ForeignKey("Users")]
        public string UsersId { get; set; }
        public Users Users { get; set; }
    }
}
