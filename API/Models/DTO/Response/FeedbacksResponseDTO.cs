using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models.DTO.Response
{
    public class FeedbacksResponseDTO
    {
        public int Id { get; set; }
        public string Feedback { get; set; }
        public DateTime UploadDate { get; set; }
        public string UsersId { get; set; }
    }
}
