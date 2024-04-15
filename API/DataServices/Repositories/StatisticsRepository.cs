using DataServices.Data;
using DataServices.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Models.DTO.Filter;
using Models.DTO.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataServices.Repositories
{
    public class StatisticsRepository : IStatisticsRepository
    {
        public readonly ILogger _logger;
        protected DataContext _context;

        public StatisticsRepository(ILogger logger, DataContext context)
        {
            _logger = logger;
            _context = context;
        }

        public virtual async Task<IEnumerable<ContributionStatistics>> GetStatistics(StatisticsFilter filter)
        {
            try
            {
                var contributions = _context.Contributions.AsQueryable();
                var users = _context.Users.AsQueryable();
                var faculties = _context.Faculties.AsQueryable();
                var closureDates = _context.ClosureDates.AsQueryable();

                if (!string.IsNullOrEmpty(filter.FacultyName))
                {
                    faculties = faculties.Where(f => f.FacultyName == filter.FacultyName);
                }

                if (!string.IsNullOrEmpty(filter.AcademicYear))
                {
                    closureDates = closureDates.Where(f => f.AcademicYear == filter.AcademicYear);
                }

                var query = contributions
                    .Join(users, c => c.UsersId, u => u.Id, (c, u) => new { Contribution = c, User = u })
                    .Join(faculties, cu => cu.User.FacultiesId, f => f.Id, (cu, f) => new { ContributionUser = cu, Faculty = f })
                    .Join(closureDates, cf => cf.ContributionUser.Contribution.ClosureDatesId, cd => cd.Id, (cf, cd) => new { ContributionFacultyClosureDates = cf, ClosureDate = cd })
                    .GroupBy(cfc => new { cfc.ContributionFacultyClosureDates.Faculty.FacultyName, cfc.ClosureDate.AcademicYear })
                    .Select(g => new ContributionStatistics
                    {
                        FacultyName = g.Key.FacultyName,
                        AcademicYear = g.Key.AcademicYear,
                        ContributionCount = g.Count()
                    });

                return await query.ToListAsync();

            }
            catch (Exception e)
            {
                _logger.LogError(e, "{Repo} GetStatistics Function error", typeof(StatisticsRepository));
                throw;
            }
        }
    }
}
