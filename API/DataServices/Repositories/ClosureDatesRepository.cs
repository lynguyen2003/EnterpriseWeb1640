using DataServices.Data;
using DataServices.Interfaces;
using Microsoft.EntityFrameworkCore;
using Models.Entities;
using Models.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DataServices.Repositories
{
    public class ClosureDatesRepository : IClosureDates
    {
        private readonly DataContext _context;

        public ClosureDatesRepository(DataContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<ClosureDates>> GetAllClosureDates()
        {
            return await _context.ClosureDates.ToListAsync();
        }

        public async Task<ClosureDates> GetClosureDateById(int id)
        {
            return await _context.ClosureDates.FindAsync(id);
        }

        public async Task AddClosureDate(ClosureDates closureDate)
        {
            _context.ClosureDates.Add(closureDate);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteClosureDate(int id)
        {
            var closuredate = await _context.ClosureDates.FindAsync(id);
            _context.ClosureDates.Remove(closuredate);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateClosureDate(int id, ClosureDates closureDate)
        {
            _context.Entry(closureDate).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }
    }
}
