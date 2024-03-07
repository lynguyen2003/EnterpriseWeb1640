﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataServices.Interfaces
{
    public interface IUnitOfWorks
    {
        IUsersRepository Users { get; }
        Task<bool> CompleteAsync();
        
    }
}
