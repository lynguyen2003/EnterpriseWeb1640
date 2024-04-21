﻿using Models.DTO.Filter;
using Models.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataServices.Interfaces
{
    public interface IContributionsRepository : IGenericRepository<Contributions>
    {
        Task<IEnumerable<Contributions>> GetAll(ContributionsFilter paginationDTO);
        Task<IEnumerable<Contributions>> GetByUserId(string userId);
    }
}
