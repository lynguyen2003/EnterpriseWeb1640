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
    public class FeedbacksRepository : GenericRepository<Feedbacks>, IFeedbacksRepository
    {
        public FeedbacksRepository(ILogger logger, DataContext context) : base(logger, context)
        {
        }

        public override async Task<IEnumerable<Feedbacks>> GetAll()
        {
            try
            {
                return await _dbSet.ToListAsync();
            }
            catch (Exception e)
            {
                _logger.LogError(e, "{Repo} GetAll Fuction error", typeof(FeedbacksRepository));
                throw;
            }
        }

        public virtual async Task<IEnumerable<Feedbacks>> GetByUserId(string userId)
        {
            return await _dbSet.Where(c => c.UsersId == userId).ToListAsync();
        }

        public virtual async Task<bool> Update(Feedbacks feedbacks)
        {
            try
            {
                var existingFeedbacks = await _dbSet.FindAsync(feedbacks.Id);
                if (existingFeedbacks != null)
                {
                    existingFeedbacks.Feedback = feedbacks.Feedback;
                    //TO DO:

                    await _context.SaveChangesAsync();
                    return true;
                }
                else
                {
                    return false;
                }
            }
            catch (Exception e)
            {
                _logger.LogError(e, "{Repo} Update Function error", typeof(FeedbacksRepository));
                throw;
            }
        }

        public override async Task<bool> Delete(int id)
        {
            try
            {
                var feedbackToDelete = await _dbSet.FindAsync(id);
                if (feedbackToDelete != null)
                {
                    // Mark the user as deleted
                    _dbSet.Remove(feedbackToDelete);
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
                _logger.LogError(e, "{Repo} Delete Fuction error", typeof(FeedbacksRepository));
                throw;
            }
        }
    }
}
