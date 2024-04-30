using AutoMapper;
using Models.Entities;
using Models.DTO.Request;
using Models.DTO.Response;
using Models.DTO;
using Microsoft.AspNetCore.Identity;

namespace DataServices.MappingProfile
{
	public class MappingProfile : Profile
	{
		public MappingProfile()
		{
			CreateMap<Faculties, FacultiesDTO>();
			CreateMap<CreateFacultyDTO, Faculties>();
			CreateMap<UpdateFacultyDTO, Faculties>();

            CreateMap<Contributions, ContributionsResponseDTO>()
                .ForMember(dest => dest.FacultyName, opt => opt.MapFrom(src => src.Users.Faculties.FacultyName))
                .ReverseMap();
            CreateMap<ContributionsRequestUpdateDTO, Contributions>();
            CreateMap<ContributionsRequestCreateDTO, Contributions>()
				.ForMember(dest => dest.Id, opt => opt.Ignore())
				.ForMember(dest => dest.UploadDate, opt => opt.MapFrom(src => DateTime.Now));

            CreateMap<Users, UsersResponseDTO>();
            CreateMap<UsersRequestCreateDTO, Users>();
            CreateMap<UsersRequestUpdateDTO, Users>();

            CreateMap<Users, UsersResponseDTO>();

            CreateMap<Comments, CommentsResponseDTO>();
            CreateMap<CommentsRequestCreateDTO, Comments>()
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.Now));

        }
    }
}
