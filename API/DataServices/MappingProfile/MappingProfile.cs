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

            CreateMap<Contributions, ContributionsResponseDTO>();
            CreateMap<ContributionsRequestUpdateDTO, Contributions>();
            CreateMap<ContributionsRequestCreateDTO, Contributions>()
				.ForMember(dest => dest.Id, opt => opt.Ignore())
				.ForMember(dest => dest.UploadDate, opt => opt.MapFrom(src => DateTime.Now));
        }
	}
}
