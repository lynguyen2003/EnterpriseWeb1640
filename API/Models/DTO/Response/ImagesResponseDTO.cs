﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models.DTO.Response
{
    public class ImagesResponseDTO
    {
        public int Id { get; set; }
        public string FilePath { get; set; }
        public int ContributionsId { get; set; }
    }
}
