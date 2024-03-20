using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models.Entities
{
    public class Images
    {
        public int Id { get; set; }
        public string FilePath { get; set; }
        [ForeignKey("Contributions")]
        public int ContributionsId { get; set; }
        public Contributions Contributions { get; set; }
    }
}
