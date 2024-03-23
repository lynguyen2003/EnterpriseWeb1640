using DataServices.Data;
using DataServices.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Models.Entities;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataServices.Repositories
{
    public class ContributionsRepository : GenericRepository<Contributions>, IContributionsRepository
    {
        public ContributionsRepository(ILogger logger, DataContext context) : base(logger, context)
        {
        }

        public override async Task<IEnumerable<Contributions>> GetAll()
        {
            try
            {
                return await _dbSet.ToListAsync();
            }
            catch (Exception e)
            {
                _logger.LogError(e, "{Repo} GetAll Fuction error", typeof(ContributionsRepository));
                throw;
            }
        }

        public virtual async Task<IEnumerable<Contributions>> GetByUserId(string userId)
        {
            return await _dbSet.Where(c => c.UsersId == userId).ToListAsync();
        }

        public virtual async Task<bool> Update(Contributions contributions)
        {
            try
            {
                var existingContributions = await _dbSet.FindAsync(contributions.Id);
                if (existingContributions != null)
                {
                    existingContributions.Title = contributions.Title;
                    existingContributions.Description = contributions.Description;
                    existingContributions.FilePath = contributions.FilePath;
                    existingContributions.UploadDate = contributions.UploadDate = DateTime.UtcNow;
                    existingContributions.ClosureDatesId = contributions.ClosureDatesId;
                    existingContributions.UsersId = contributions.UsersId;
                    existingContributions.MagazinesId = contributions.MagazinesId;
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
                _logger.LogError(e, "{Repo} Update Function error", typeof(ContributionsRepository));
                throw;
            }
        }

        public override async Task<bool> Delete(int id)
        {
            try
            {
                var contributionToDelete = await _dbSet.FindAsync(id);
                if (contributionToDelete != null)
                {
                    // Mark the user as deleted
                    _dbSet.Remove(contributionToDelete);
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
                _logger.LogError(e, "{Repo} Delete Fuction error", typeof(ContributionsRepository));
                throw;
            }
        }
    }
}
