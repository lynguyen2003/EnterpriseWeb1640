﻿using Models.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataServices.Interfaces
{
    public interface IUsersRepository : IGenericRepository<Users>
    {
        Task<IEnumerable<Users>> GetUserByEmail(string email);
    }
}
