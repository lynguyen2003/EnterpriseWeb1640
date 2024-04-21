using DataServices.Data;
using DataServices.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Models.DTO.Filter;
using Models.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataServices.Repositories
{
    public class UsersRepository : GenericRepository<Users>, IUsersRepository
    {
        public UsersRepository(ILogger logger, DataContext context) : base(logger, context)
        {
        }

        public virtual async Task<IEnumerable<Users>> GetAll(UsersFilter usersFilter)
        {
            try
            {
                var query = _dbSet.AsQueryable();
                if (!string.IsNullOrEmpty(usersFilter.Email))
                {
                    query = query.Where(c => c.Email == usersFilter.Email);
                }
                if (usersFilter.FacultiesId.HasValue)
                {
                    query = query.Where(c => c.FacultiesId == usersFilter.FacultiesId);
                }
                return await query.Skip((usersFilter.PageNum - 1) * usersFilter.PageSize)
                    .Take(usersFilter.PageSize)
                    .ToListAsync();
            }
            catch (Exception e)
            {
                _logger.LogError(e, "{Repo} GetAll Fuction error", typeof(UsersRepository));
                throw;
            }
        }

        public virtual async Task<IEnumerable<Users>> GetUserByEmail(string email)
        {
            return await _dbSet.Where(c => c.Email == email).ToListAsync();
        }

        public virtual async Task<IEnumerable<Users>> GetUserByUserId(string userId)
        {
            return await _dbSet.Where(c => c.Id == userId).ToListAsync();
        }

        public virtual async Task<IEnumerable<Users>> GetUserByFacultiesId(int facultiesId)
        {
            return await _dbSet.Where(c => c.FacultiesId == facultiesId).ToListAsync();
        }   

        public override async Task<bool> Update(Users users)
        {
            try
            {
                var existingUsers = await _dbSet.FindAsync(users.Id);
                if (existingUsers != null)
                {
                    existingUsers.UserName = users.UserName;
                    existingUsers.FullName = users.FullName;
                    existingUsers.Email = users.Email;
                    existingUsers.PhoneNumber = users.PhoneNumber;
                    existingUsers.FacultiesId = users.FacultiesId;
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
                _logger.LogError(e, "{Repo} Update Function error", typeof(UsersRepository));
                throw;
            }
        }
    }
}
