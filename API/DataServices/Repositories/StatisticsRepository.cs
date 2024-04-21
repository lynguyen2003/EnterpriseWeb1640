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
                var query = _context.Faculties
                    .Where(f => string.IsNullOrEmpty(filter.FacultyName) || f.FacultyName == filter.FacultyName)
                    .SelectMany(f => f.Users)
                    .SelectMany(u => u.Contributions)
                    .Join(_context.ClosureDates,
                        c => c.ClosureDatesId,
                        cd => cd.Id,
                        (c, cd) => new { Contribution = c, ClosureDate = cd })
                    .GroupBy(c => new { c.Contribution.Users.Faculties.FacultyName, c.ClosureDate.AcademicYear })
                    .Select(g => new ContributionStatistics
                    {
                        FacultyName = g.Key.FacultyName,
                        AcademicYear = g.Key.AcademicYear,
                        Contributions = g.Count(),
                        Contributors = g.Select(c => c.Contribution.UsersId).Distinct().Count(),
                        Percentage = 0
                    });

                var statistics = await query.ToListAsync();

                foreach (var stat in statistics)
                {
                    var totalContributionsForYear = statistics
                        .Where(s => s.AcademicYear == stat.AcademicYear)
                        .Sum(s => s.Contributions);

                    stat.Percentage = Math.Round((stat.Contributions * 100.0) / totalContributionsForYear, 2);
                }

                return statistics;
            }
            catch (Exception e)
            {
                _logger.LogError(e, "{Repo} GetStatistics Function error", typeof(StatisticsRepository));
                throw;
            }
        }

        public virtual async Task<IEnumerable<ContributionStatistics>> GetStatisticsWithFaculty(StatisticsFilter filter)
        {
            try
            {
                var query = _context.Faculties
                    .Where(f => string.IsNullOrEmpty(filter.FacultyName) || f.FacultyName == filter.FacultyName)
                    .SelectMany(f => f.Users)
                    .SelectMany(u => u.Contributions)
                    .GroupBy(c => c.Users.Faculties.FacultyName)
                    .Select(g => new ContributionStatistics
                    {
                        FacultyName = g.Key,
                        Contributions = g.Count(),
                        Contributors = g.Select(c => c.UsersId).Distinct().Count(),
                    });

                var statistics = await query.ToListAsync();

                return statistics;
            }
            catch (Exception e)
            {
                _logger.LogError(e, "{Repo} GetStatisticsWithFaculty Function error", typeof(StatisticsRepository));
                throw;
            }
        }


        public virtual async Task<IEnumerable<ContributionStatistics>> GetPercentage()
        {
            try
            {
                var contributions = _context.Contributions.AsQueryable();
                var users = _context.Users.AsQueryable();
                var faculties = _context.Faculties.AsQueryable();
                var closureDates = _context.ClosureDates.AsQueryable();

                var query = contributions
                    .Join(users, c => c.UsersId, u => u.Id, (c, u) => new { Contribution = c, User = u })
                    .Join(faculties, cu => cu.User.FacultiesId, f => f.Id, (cu, f) => new { ContributionUser = cu, Faculty = f })
                    .Join(closureDates, cf => cf.ContributionUser.Contribution.ClosureDatesId, cd => cd.Id, (cf, cd) => new { ContributionFacultyClosureDates = cf, ClosureDate = cd })
                    .GroupBy(cfc => new { cfc.ContributionFacultyClosureDates.Faculty.FacultyName, cfc.ClosureDate.AcademicYear })
                    .Select(g => new ContributionStatistics
                    {
                        FacultyName = g.Key.FacultyName,
                        AcademicYear = g.Key.AcademicYear,
                        Contributions = g.Count()
                    });

                var statistics = await query.ToListAsync();

                foreach (var stat in statistics)
                {
                    var totalContributionsForYear = statistics
                        .Where(s => s.AcademicYear == stat.AcademicYear)
                        .Sum(s => s.Contributions);

                    stat.Percentage = Math.Round((stat.Contributions * 100.0) / totalContributionsForYear, 2);
                }

                return statistics;

            }
            catch (Exception e)
            {
                _logger.LogError(e, "{Repo} GetStatistics Function error", typeof(StatisticsRepository));
                throw;
            }
        }
    }
}
