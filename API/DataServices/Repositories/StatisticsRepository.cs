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

        public virtual async Task<int> GetStatisticsUsers()
        {
            try
            {
                int userCount = await _context.Users.CountAsync();
                return userCount;
            }
            catch (Exception e)
            {
                _logger.LogError(e, "{Repo} GetStatisticsUsers Function error", typeof(StatisticsRepository));
                throw;
            }
        }

        public virtual async Task<int> GetStatisticsApprovedContributions()
        {
            try
            {
                int contributionCount = await _context.Contributions.
                    Where(c => c.IsApproved == true).
                    CountAsync();
                return contributionCount;
            }
            catch (Exception e)
            {
                _logger.LogError(e, "{Repo} GetStatisticsUsers Function error", typeof(StatisticsRepository));
                throw;
            }
        }


        public virtual async Task<IEnumerable<ContributionStatistics>> GetPercentageWithAcademicYear()
        {
            try
            {
                var statistics = await _context.ClosureDates
                    .SelectMany(cd => cd.Contributions, (cd, c) => new { ClosureDate = cd, Contribution = c })
                    .GroupBy(x => x.ClosureDate.AcademicYear)
                    .Select(g => new ContributionStatistics
                    {
                        AcademicYear = g.Key,
                        Contributions = g.Count(),
                        Percentage = Math.Round((double)g.Count() / _context.Contributions.Count() * 100, 0)
                    })
                    .ToListAsync();

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
