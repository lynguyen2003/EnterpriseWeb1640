using AutoMapper;
using Models.Entities;
using Models.DTO.Request;
using Models.DTO.Response;
using Models.DTO;

namespace DataServices.MappingProfile
{
	public class MappingProfile : Profile
	{
		public MappingProfile()
		{
			CreateMap<Faculties, FacultiesDTO>();
			CreateMap<CreateFacultyDTO, Faculties>();
			CreateMap<UpdateFacultyDTO, Faculties>();
		}
	}
}
