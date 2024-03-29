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
        public IMagazinesRepository Magazines { get; }
        public IImagesRepository Images { get; }
        public IFeedbacksRepository Feedbacks { get; }
        private readonly DataContext _context;

        public UnitOfWorks(DataContext context, ILoggerFactory loggerFactory) 
        {
            _context = context;
            var logger = loggerFactory.CreateLogger("log");

            Contributions = new ContributionsRepository(logger, _context);
            Magazines = new MagazinesRepository(logger, _context);
            Images = new ImagesRepository(logger, _context);
            Feedbacks = new FeedbacksRepository(logger, _context);
        }


        public async Task<bool> CompleteAsync()
        {
            var result = await _context.SaveChangesAsync();
            return result > 0;
        }
    }
}
