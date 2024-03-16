using DataServices.Data;
using DataServices.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Models.Entities;

namespace DataServices.Repositories
{
	public class FacultiesRepository : IFacultiesRepository
	{
		private readonly DataContext _context;

		public FacultiesRepository(DataContext context)
		{
			_context = context;
		}

		public async Task<Faculties> GetFacultyByIdAsync(int id)
		{
			return await _context.Faculties.FindAsync(id);
		}

		public async Task<IEnumerable<Faculties>> GetAllFacultiesAsync()
		{
			return await _context.Faculties.ToListAsync();
		}

		public async Task CreateFacultyAsync(Faculties faculty)
		{
			_context.Faculties.Add(faculty);
			await _context.SaveChangesAsync();
		}

		public async Task UpdateFacultyAsync(Faculties faculty)
		{
			_context.Entry(faculty).State = EntityState.Modified;
			await _context.SaveChangesAsync();
		}

		public async Task DeleteFaculty(int id)
		{
			var faculty = await _context.Faculties.FindAsync(id);
			_context.Faculties.Remove(faculty);
			await _context.SaveChangesAsync();
		}
	}
}
