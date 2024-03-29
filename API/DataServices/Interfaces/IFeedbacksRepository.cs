using Models.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataServices.Interfaces
{
    public interface IFeedbacksRepository : IGenericRepository<Feedbacks>
    {
        Task<IEnumerable<Feedbacks>> GetByUserId(string userId);
    }
}
