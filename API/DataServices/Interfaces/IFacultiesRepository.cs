using System.Collections.Generic;
using Models.Entities;

namespace DataServices.Interfaces
{
	public interface IFacultiesRepository
	{
		Task<Faculties> GetFacultyByIdAsync(int id);
		Task<IEnumerable<Faculties>> GetAllFacultiesAsync();
		Task CreateFacultyAsync(Faculties faculty);
		Task UpdateFacultyAsync(Faculties faculty);
		Task DeleteFaculty(int id);
	}
}
