using System;
using System.Collections.Generic;
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
        public byte[] Content { get; set; }
        public byte[] ImageFile {  get; set; }
        public DateTime UploadDate { get; set; }
        public ClosureDates ClosureDates { get; set; }
        public ICollection<FeedBacks> FeedBacks { get; set; }
    }
}
