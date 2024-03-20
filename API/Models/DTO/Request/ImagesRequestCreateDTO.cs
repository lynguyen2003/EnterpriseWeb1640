using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models.DTO.Request
{
    public class ImagesRequestCreateDTO
    {
        [Required(ErrorMessage = "FilePath is required")]
        [Url(ErrorMessage = "FilePath must be a valid URL")]
        public string FilePath { get; set; }

        [Required(ErrorMessage = "ContributionsId is required")]
        public int ContributionsId { get; set; }
    }
}
