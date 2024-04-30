using Microsoft.AspNetCore.Mvc;
using Models.DTO.Filter;
using Models.DTO.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataServices.Interfaces
{
    public interface IStatisticsRepository
    {
        Task<IEnumerable<ContributionStatistics>> GetStatistics(StatisticsFilter filter);
        Task<IEnumerable<ContributionStatistics>> GetStatisticsWithFaculty(StatisticsFilter filter);
        Task<int> GetStatisticsUsers();
        Task<int> GetStatisticsApprovedContributions();
        Task<IEnumerable<ContributionStatistics>> GetPercentageWithAcademicYear();
    }
}
