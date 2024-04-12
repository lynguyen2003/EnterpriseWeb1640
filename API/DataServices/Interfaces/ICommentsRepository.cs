using Models.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataServices.Interfaces
{
    public interface ICommentsRepository : IGenericRepository<Comments>
    {
        Task<IEnumerable<Comments>> GetCommentsByContributionId(int contributionId);
        Task AddComment(Comments comments);
        Task UpdateComment(Comments comments);
        Task DeleteComment(int id);

    }
}
