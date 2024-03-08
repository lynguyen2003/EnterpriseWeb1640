using DataServices.Data;
using DataServices.Interfaces;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataServices.Repositories
{
    public class UnitOfWorks : IUnitOfWorks, IDisposable
    {
        private readonly DataContext _context;
        public IUsersRepository Users {  get; }

        public UnitOfWorks(DataContext context, ILoggerFactory loggerFactory) 
        {
            _context = context;
            var logger = loggerFactory.CreateLogger("log");

            Users = new UsersRepository(logger, _context);
        }

        public async Task<bool> CompleteAsync()
        {
            var result = await _context.SaveChangesAsync();
            return result > 0;
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}
