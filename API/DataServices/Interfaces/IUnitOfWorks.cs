using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataServices.Interfaces
{
    public interface IUnitOfWorks
    {
        IContributionsRepository Contributions { get; }
        IImagesRepository Images { get; }
        Task<bool> CompleteAsync();
        
    }
}
