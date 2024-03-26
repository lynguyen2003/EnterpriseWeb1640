using Models.Entities;
using System;
using System.Collections.Generic;

namespace DataServices.Interfaces
{
    public interface IClosureDates
    {
        Task<IEnumerable<ClosureDates>> GetAllClosureDates();
        Task<ClosureDates> GetClosureDateById(int id);
        Task AddClosureDate(ClosureDates closureDate);
        Task UpdateClosureDate(int id, ClosureDates closureDate);
        Task DeleteClosureDate(int id);
    }
}