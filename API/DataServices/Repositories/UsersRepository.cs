using DataServices.Data;
using DataServices.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Models.DTO.Request;
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

        public override async Task<IEnumerable<Users>> GetAll()
        {
            try
            {
                return await _dbSet.ToListAsync();
            }
            catch (Exception e)
            {
                _logger.LogError(e, "{Repo} GetAll Fuction error", typeof(UsersRepository));
                throw;
            }
        }

        public async Task<bool> AddUserWithFaculityId(Users users, int faculityId)
        {
            try
            {
                users.FaculitiesId = faculityId;
                _dbSet.Add(users);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception e)
            {
                _logger.LogError(e, "{Repo} Add Function error", typeof(UsersRepository));
                throw;
            }
        }


        public override async Task<bool> Update(Users users)
        {
            try
            {
                var existingUser = await _dbSet.FindAsync(users.Id);
                if (existingUser != null)
                {
                    existingUser.UserName = users.UserName;
                    existingUser.Email = users.Email;
                    existingUser.Phone = users.Phone;
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

        public override async Task<bool> Delete(int Id)
        {
            try
            {
                var userToDelete = await _dbSet.FindAsync(Id);
                if (userToDelete != null)
                {
                    // Mark the user as deleted
                    _dbSet.Remove(userToDelete);
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
                _logger.LogError(e, "{Repo} Delete Fuction error", typeof(UsersRepository));
                throw;
            }
        }


    }
}
