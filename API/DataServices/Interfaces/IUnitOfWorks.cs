﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataServices.Interfaces
{
    public interface IUnitOfWorks
    {
        IContributionsRepository Contributions { get; }
        IMagazinesRepository Magazines { get; }
        IImagesRepository Images { get; }
        Task<bool> CompleteAsync();
        
    }
}
