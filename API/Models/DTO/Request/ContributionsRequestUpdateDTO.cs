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
        [Required(ErrorMessage = "Title is required")]
        [StringLength(100, MinimumLength = 5, ErrorMessage = "Title must be between 5 and 100 characters")]
        public string Title { get; set; }

        [Required(ErrorMessage = "Description is required")]
        [StringLength(500, MinimumLength = 10, ErrorMessage = "Description must be between 10 and 500 characters")]
        public string Description { get; set; }

        [Required(ErrorMessage = "FilePath is required")]
        [Url(ErrorMessage = "FilePath must be a valid URL")]
        public string FilePath { get; set; }

        [Required(ErrorMessage = "ClosureDatesId is required")]
        [RegularExpression(@"^\d+$", ErrorMessage = "ClosureDatesId must be a numeric value")]
        public string ClosureDatesId { get; set; }

        [Required(ErrorMessage = "UsersId is required")]
        public string UsersId { get; set; }

        [Required(ErrorMessage = "MagazinesId is required")]
        [RegularExpression(@"^\d+$", ErrorMessage = "MagazinesId must be a numeric value")]
        public int MagazinesId { get; set; }
    }
}
