using AutoMapper;
using Models.DTO.Response;
using Models.DTO.Request;
using Models.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Models.DTO;

namespace DataServices.MappingProfile
{
    public class MappingProfile : Profile

    {
        public MappingProfile() {
            CreateMap<CreateUserDTO, Users>().ReverseMap();
            CreateMap<UsersDTO, Users>()
                .ForMember(dest => dest.FaculitiesId, opt => opt.MapFrom(src => src.FaculityId))
                .ReverseMap();
            CreateMap<UpdateUserDTO, Users>().ReverseMap();
        }
    }
}
