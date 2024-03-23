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
    public class MagazinesRepository : GenericRepository<Magazines>, IMagazinesRepository
    {
        public MagazinesRepository(ILogger logger, DataContext context) : base(logger, context)
        {
        }

        public override async Task<IEnumerable<Magazines>> GetAll()
        {
            try
            {
                return await _dbSet.ToListAsync();
            }
            catch (Exception e)
            {
                _logger.LogError(e, "{Repo} GetAll Fuction error", typeof(MagazinesRepository));
                throw;
            }
        }

        public virtual async Task<bool> Update(Magazines magazines)
        {
            try
            {
                var existingMagazines = await _dbSet.FindAsync(magazines.Id);
                if (existingMagazines != null)
                {
                    existingMagazines.Title = magazines.Title;
                    existingMagazines.Description = magazines.Description;
                    existingMagazines.CoverImagePath = magazines.CoverImagePath;
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
                _logger.LogError(e, "{Repo} Update Function error", typeof(MagazinesRepository));
                throw;
            }
        }

        public override async Task<bool> Delete(int id)
        {
            try
            {
                var magazineToDelete = await _dbSet.FindAsync(id);
                if (magazineToDelete != null)
                {
                    // Mark the user as deleted
                    _dbSet.Remove(magazineToDelete);
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
                _logger.LogError(e, "{Repo} Delete Fuction error", typeof(MagazinesRepository));
                throw;
            }
        }
    }
}
