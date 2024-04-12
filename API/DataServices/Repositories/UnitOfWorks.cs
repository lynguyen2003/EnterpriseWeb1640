using DataServices.Data;
using DataServices.Interfaces;
using Microsoft.Extensions.Logging;
using Models.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataServices.Repositories
{
    public class UnitOfWorks : IUnitOfWorks
    {
        public IContributionsRepository Contributions { get; }
        public IUsersRepository Users { get; }
        public ICommentsRepository Comments { get; }
        private readonly DataContext _context;

        public UnitOfWorks(DataContext context, ILoggerFactory loggerFactory) 
        {
            _context = context;
            var logger = loggerFactory.CreateLogger("log");

            Contributions = new ContributionsRepository(logger, _context);
            Users = new UsersRepository(logger, _context);
            Comments = new CommentsRepository(logger, _context);
        }


        public async Task<bool> CompleteAsync()
        {
            var result = await _context.SaveChangesAsync();
            return result > 0;
        }
    }
}
