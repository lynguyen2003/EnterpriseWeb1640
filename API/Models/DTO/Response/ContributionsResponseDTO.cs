using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models.DTO.Response
{
    public class ContributionsResponseDTO
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string FilePath { get; set; }
        public string ImgPath { get; set; }
        public DateTime UploadDate { get; set; }
        public bool IsApproved { get; set; }
        public bool IsPublished { get; set; }
        public int ClosureDatesId { get; set; }
        public string UsersId { get; set; }
        public int MagazinesId { get; set; }
    }
}
