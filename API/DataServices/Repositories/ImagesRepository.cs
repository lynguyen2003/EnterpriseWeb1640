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
    public class ImagesRepository : GenericRepository<Images>, IImagesRepository
    {
        public ImagesRepository(ILogger logger, DataContext context) : base(logger, context)
        {
        }

        public override async Task<IEnumerable<Images>> GetAll()
        {
            try
            {
                return await _dbSet.ToListAsync();
            }
            catch (Exception e)
            {
                _logger.LogError(e, "{Repo} GetAll Fuction error", typeof(ImagesRepository));
                throw;
            }
        }

        public override async Task<bool> Update(Images images)
        {
            try
            {
                var existingImages = await _dbSet.FindAsync(images.Id);
                if (existingImages != null)
                {
                    existingImages.FilePath = images.FilePath;

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
                _logger.LogError(e, "{Repo} Update Function error", typeof(ImagesRepository));
                throw;
            }
        }

        public override async Task<bool> Delete(int id)
        {
            try
            {
                var imageToDelete = await _dbSet.FindAsync(id);
                if (imageToDelete != null)
                {
                    // Mark the user as deleted
                    _dbSet.Remove(imageToDelete);
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
                _logger.LogError(e, "{Repo} Delete Fuction error", typeof(ImagesRepository));
                throw;
            }
        }
    }
}
