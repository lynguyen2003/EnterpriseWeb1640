using System.Collections.Generic;

namespace Models.Entities
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
