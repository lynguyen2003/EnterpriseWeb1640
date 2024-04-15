using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models.DTO.Request
{
    public class ContributionsRequestUpdateDTO
    {
        [Required(ErrorMessage = "Id is required")]
        public int Id { get; set; }
        [StringLength(100, MinimumLength = 5, ErrorMessage = "Title must be between 5 and 100 characters")]
        public string Title { get; set; }

        [StringLength(500, MinimumLength = 10, ErrorMessage = "Description must be between 10 and 500 characters")]
        public string Description { get; set; }
        public string FilePath { get; set; }
        public string ImgPath { get; set; }
        public bool? IsApproved { get; set; }
        public bool? IsPublished { get; set; }
    }
}
