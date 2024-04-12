using DataServices.Data;
using DataServices.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Models.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataServices.Repositories
{
    public class CommentsRepository : GenericRepository<Comments>, ICommentsRepository
    {
        public CommentsRepository(ILogger logger, DataContext context) : base(logger, context)
        {
        }

        public override async Task<IEnumerable<Comments>> GetAll()
        {
            try
            {
                return await _dbSet.ToListAsync();
            }
            catch (Exception e)
            {
                _logger.LogError(e, "{Repo} GetAll Fuction error", typeof(CommentsRepository));
                throw;
            }
        }

        public virtual async Task<IEnumerable<Comments>> GetCommentsByContributionId(int contributionId)
        {
            return await _dbSet.Where(x => x.ContributionId == contributionId).ToListAsync();
        }

        public Task AddComment(Comments comments)
        {
            throw new NotImplementedException();
        }

        public Task UpdateComment(Comments comments)
        {
            throw new NotImplementedException();
        }

        public Task DeleteComment(int id)
        {
            throw new NotImplementedException();
        }

        public override async Task<bool> Delete(int id)
        {
            try
            {
                var commentToDelete = await _dbSet.FindAsync(id);
                if (commentToDelete != null)
                {
                    // Mark the user as deleted
                    _dbSet.Remove(commentToDelete);
                    await _context.SaveChangesAsync();
                    return true; // Successfully deleted
                }
                else
                {
                    return false; // User not found
                }
            }
            catch (Exception e)
            {
                _logger.LogError(e, "{Repo} Delete Fuction error", typeof(CommentsRepository));
                throw;
            }
        }

    }
}
